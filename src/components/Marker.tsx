import React, { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import maplibregl from 'maplibre-gl';
import { useMap } from './VWorldMap';

export interface MarkerProps {
  lngLat: [number, number];
  color?: string;
  draggable?: boolean;
  onDragEnd?: (lngLat: [number, number]) => void;
  onClick?: (event: MouseEvent, marker: maplibregl.Marker) => void;
  onContextMenu?: (event: MouseEvent, marker: maplibregl.Marker) => void;
  selected?: boolean;
  highlighted?: boolean;
  zIndex?: number;
  ariaLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

function applyMarkerState(
  element: HTMLElement,
  {
    selected,
    highlighted,
    zIndex,
    ariaLabel,
    className,
  }: Pick<MarkerProps, 'selected' | 'highlighted' | 'zIndex' | 'ariaLabel' | 'className'>
) {
  element.dataset.selected = selected ? 'true' : 'false';
  element.dataset.highlighted = highlighted ? 'true' : 'false';
  element.style.zIndex = zIndex === undefined ? '' : String(zIndex);
  element.style.setProperty('scale', selected ? '1.18' : highlighted ? '1.1' : '');
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
  if (className) {
    for (const token of className.split(/\s+/)) {
      if (token) element.classList.add(token);
    }
  }
}

export const Marker: React.FC<MarkerProps> = ({
  lngLat,
  color = '#3FB1CE',
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
  const { map } = useMap();
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const classNameRef = useRef<string | undefined>(undefined);
  const onClickRef = useRef(onClick);
  const onContextMenuRef = useRef(onContextMenu);
  const onDragEndRef = useRef(onDragEnd);

  useEffect(() => {
    onClickRef.current = onClick;
    onContextMenuRef.current = onContextMenu;
    onDragEndRef.current = onDragEnd;
  }, [onClick, onContextMenu, onDragEnd]);

  // Create a container element for the portal
  const container = useMemo(() => {
    const div = document.createElement('div');
    // Ensure the container doesn't have default pointer events that might block dragging 
    // unless necessary, but we'll leave it default for interaction.
    return div;
  }, []);

  useEffect(() => {
    if (!map) return;

    let markerOptions: maplibregl.MarkerOptions = { color, draggable };
    
    // If children are provided, use the portal container
    if (children) {
      markerOptions = { element: container, draggable };
    }

    const marker = new maplibregl.Marker(markerOptions)
      .setLngLat(lngLat)
      .addTo(map);
    const element = marker.getElement();
    const handleClick = (event: MouseEvent) => {
      if (!onClickRef.current) return;
      event.stopPropagation();
      onClickRef.current(event, marker);
    };
    const handleContextMenu = (event: MouseEvent) => {
      if (!onContextMenuRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      onContextMenuRef.current(event, marker);
    };

    element.addEventListener('click', handleClick);
    element.addEventListener('contextmenu', handleContextMenu);

    if (draggable) {
      marker.on('dragend', () => {
        const newLngLat = marker.getLngLat();
        onDragEndRef.current?.([newLngLat.lng, newLngLat.lat]);
      });
    }

    markerRef.current = marker;

    return () => {
      element.removeEventListener('click', handleClick);
      element.removeEventListener('contextmenu', handleContextMenu);
      marker.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, children ? container : null]); // Re-create if switching between default and custom

  // Update position if lngLat changes
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat(lngLat);
    }
  }, [lngLat]);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    const element = marker.getElement();
    if (classNameRef.current) {
      for (const token of classNameRef.current.split(/\s+/)) {
        if (token) element.classList.remove(token);
      }
    }
    applyMarkerState(element, { selected, highlighted, zIndex, ariaLabel, className });
    classNameRef.current = className;
  }, [selected, highlighted, zIndex, ariaLabel, className]);

  // If using custom children, render them into the container using a portal
  if (children) {
    return createPortal(children, container);
  }

  return null;
};
