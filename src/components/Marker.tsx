'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import maplibregl from 'maplibre-gl';
import { useMap, useEvent } from '../store/hooks';

let globalMarkerZIndex = 1000;

export interface MarkerProps {
  /** Marker position as `[longitude, latitude]`. */
  lngLat: [number, number];
  /**
   * Color of the built-in pin SVG. Ignored when `children` is provided.
   * @default '#3FB1CE'
   */
  color?: string;
  /**
   * Where the marker element anchors against the `lngLat`. Matches
   * MapLibre's [`MarkerOptions.anchor`](https://maplibre.org/maplibre-gl-js/docs/API/types/MarkerOptions/#anchor).
   *
   * - For pin-shaped content where the tip touches the coordinate, use
   *   `'bottom'`.
   * - For a centered bubble / dot, leave as `'center'` (default).
   */
  anchor?: maplibregl.PositionAnchor;
  /**
   * Pixel offset `[x, y]` applied after `anchor`. Matches MapLibre's
   * `MarkerOptions.offset`.
   */
  offset?: maplibregl.PointLike;
  /** Allow the user to drag the marker. */
  draggable?: boolean;
  /** Fired after a drag ends, with the new `[lng, lat]`. */
  onDragEnd?: (lngLat: [number, number]) => void;
  /** Fired on click of the marker DOM. */
  onClick?: (event: MouseEvent, marker: maplibregl.Marker) => void;
  /** Fired on right-click of the marker DOM. */
  onContextMenu?: (event: MouseEvent, marker: maplibregl.Marker) => void;
  /** Visual selected state — sets `data-selected="true"` and applies a scale + shadow. */
  selected?: boolean;
  /** Visual highlighted state — sets `data-highlighted="true"` and applies a softer scale + shadow. */
  highlighted?: boolean;
  /** CSS `z-index` for stacking among other markers. */
  zIndex?: number;
  /** `aria-label` for accessibility. When set, the element also gets `role="button"`. */
  ariaLabel?: string;
  /** Additional CSS class names. */
  className?: string;
  /**
   * Custom marker content. When provided, the built-in pin SVG is replaced
   * with the children rendered via React portal into a `<div>` element.
   */
  children?: React.ReactNode;
}

function applyMarkerState(
  element: HTMLElement,
  prevClassName: string | undefined,
  {
    selected,
    highlighted,
    zIndex,
    ariaLabel,
    className,
  }: Pick<MarkerProps, 'selected' | 'highlighted' | 'zIndex' | 'ariaLabel' | 'className'>,
): void {
  element.dataset.selected = selected ? 'true' : 'false';
  element.dataset.highlighted = highlighted ? 'true' : 'false';
  element.style.zIndex = zIndex === undefined ? '' : String(zIndex);
  // MapLibre owns the root `transform` for positioning. Keep a CSS variable
  // for consumer hooks and set the individual `scale` property so selected /
  // highlighted state composes with MapLibre's transform instead of replacing it.
  const scale = selected ? '1.18' : highlighted ? '1.1' : '1';
  element.style.setProperty('--vworld-marker-scale', scale);
  element.style.setProperty('scale', scale === '1' ? '' : scale);
  element.style.filter = selected
    ? 'drop-shadow(0 6px 14px rgba(0,0,0,0.34))'
    : highlighted
      ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.26))'
      : '';
  if (ariaLabel) {
    element.setAttribute('aria-label', ariaLabel);
    element.setAttribute('role', 'button');
  } else {
    element.removeAttribute('aria-label');
    element.removeAttribute('role');
  }
  // Token-set diff: only remove tokens that disappeared, only add tokens
  // that newly appeared. This avoids a single-frame flicker on tokens that
  // are common to the old and new className.
  const prevTokens = prevClassName
    ? prevClassName.split(/\s+/).filter(Boolean)
    : [];
  const nextTokens = className ? className.split(/\s+/).filter(Boolean) : [];
  const nextSet = new Set(nextTokens);
  for (const token of prevTokens) {
    if (!nextSet.has(token)) element.classList.remove(token);
  }
  const prevSet = new Set(prevTokens);
  for (const token of nextTokens) {
    if (!prevSet.has(token)) element.classList.add(token);
  }
}

/**
 * Renders a MapLibre marker. With no `children`, MapLibre's default pin SVG
 * is used (color customizable). With `children`, a custom DOM element hosts
 * the children via React portal.
 *
 * The MapLibre marker instance is created once per `(map, hasChildren)`
 * pair and reused across prop changes. Callbacks (`onClick`, `onDragEnd`,
 * `onContextMenu`) can change freely without re-creating the marker.
 */
export const Marker: React.FC<MarkerProps> = ({
  lngLat,
  color = '#3FB1CE',
  anchor,
  offset,
  draggable = false,
  onDragEnd,
  onClick,
  onContextMenu,
  selected,
  highlighted,
  zIndex,
  ariaLabel,
  className,
  children,
}) => {
  const map = useMap();
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const prevClassNameRef = useRef<string | undefined>(undefined);
  const dynamicZIndexRef = useRef<number | undefined>(undefined);
  const hasOnClickRef = useRef(onClick !== undefined);
  const hasOnContextMenuRef = useRef(onContextMenu !== undefined);
  const hasChildren = children !== undefined && children !== null && children !== false;

  const stableOnClick = useEvent(onClick);
  const stableOnContextMenu = useEvent(onContextMenu);
  const stableOnDragEnd = useEvent(onDragEnd);

  useLayoutEffect(() => {
    hasOnClickRef.current = onClick !== undefined;
    hasOnContextMenuRef.current = onContextMenu !== undefined;
  }, [onClick, onContextMenu]);

  // Stable portal container — created once per component instance (only
  // when used). SSR-safe: the effect that uses it never runs on the server.
  const container = useMemo<HTMLDivElement | null>(() => {
    if (typeof document === 'undefined') return null;
    return document.createElement('div');
  }, []);

  useEffect(() => {
    if (!map) return;

    const options: maplibregl.MarkerOptions = hasChildren && container
      ? { element: container, draggable, anchor, offset }
      : { color, draggable, anchor, offset };

    const marker = new maplibregl.Marker(options).setLngLat(lngLat).addTo(map);
    const element = marker.getElement();

    const handleClick = (event: MouseEvent) => {
      dynamicZIndexRef.current = ++globalMarkerZIndex;
      element.style.zIndex = String(dynamicZIndexRef.current);

      if (!hasOnClickRef.current) return;
      event.stopPropagation();
      stableOnClick(event, marker);
    };
    const handleContextMenu = (event: MouseEvent) => {
      if (!hasOnContextMenuRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      stableOnContextMenu(event, marker);
    };
    const handleDragEnd = () => {
      const { lng, lat } = marker.getLngLat();
      stableOnDragEnd([lng, lat]);
    };

    element.addEventListener('click', handleClick);
    element.addEventListener('contextmenu', handleContextMenu);
    if (draggable) marker.on('dragend', handleDragEnd);

    markerRef.current = marker;

    return () => {
      element.removeEventListener('click', handleClick);
      element.removeEventListener('contextmenu', handleContextMenu);
      if (draggable) marker.off('dragend', handleDragEnd);
      marker.remove();
      markerRef.current = null;
    };
    // `hasChildren`, `color`, `draggable` affect the construction options
    // and so genuinely require a re-create. lngLat / offset / state are
    // applied via the dedicated effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, hasChildren, color, draggable, anchor, container]);

  // Update position when lngLat changes (cheap; no re-create needed).
  useEffect(() => {
    markerRef.current?.setLngLat(lngLat);
  }, [lngLat[0], lngLat[1]]);

  // `offset` has a setter on MapLibre's Marker, so we can update without
  // re-creating. `anchor` does not — changing it falls through to the
  // construction effect above.
  useEffect(() => {
    if (offset !== undefined) markerRef.current?.setOffset(offset);
  }, [offset]);

  // Apply visual state.
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const effectiveZIndex = dynamicZIndexRef.current !== undefined 
      ? dynamicZIndexRef.current 
      : zIndex;

    applyMarkerState(marker.getElement(), prevClassNameRef.current, {
      selected,
      highlighted,
      zIndex: effectiveZIndex,
      ariaLabel,
      className,
    });
    prevClassNameRef.current = className;
  }, [selected, highlighted, zIndex, ariaLabel, className]);

  if (hasChildren && container) {
    return createPortal(children, container);
  }
  return null;
};
