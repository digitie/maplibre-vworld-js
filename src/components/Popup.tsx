'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import maplibregl from 'maplibre-gl';
import { useMap, useEvent } from '../store/hooks';

let globalPopupZIndex = 1;

export interface PopupProps {
  /** Anchor position as `[longitude, latitude]`. */
  lngLat: [number, number];
  /** Popup body. Rendered into a `<div>` via React portal. */
  children: React.ReactNode;
  /**
   * Offset from the anchor point, see {@link maplibregl.PopupOptions.offset}.
   * Applied via `setOffset` when changed — does not re-create the popup.
   */
  offset?: maplibregl.PopupOptions['offset'];
  /**
   * Maximum CSS width, e.g. `'320px'`. Applied via `setMaxWidth` when
   * changed — does not re-create the popup.
   */
  maxWidth?: string;
  /**
   * Show the built-in close button. Construction-only: changing this after
   * mount has no effect (MapLibre does not expose a setter). @default true
   */
  closeButton?: boolean;
  /**
   * Close on click anywhere on the map. Construction-only. @default true
   */
  closeOnClick?: boolean;
  /**
   * Additional className applied to the popup root. Construction-only.
   */
  className?: string;
  /** Fired when the popup closes (button click, outside click, or unmount). */
  onClose?: () => void;
}

/**
 * MapLibre popup rendered with React children via portal.
 *
 * The MapLibre instance is created once per `(map, container)` and reused.
 * `lngLat`, `offset`, and `maxWidth` are applied via setters on prop
 * changes (cheap). `closeButton`, `closeOnClick`, and `className` are
 * construction-only and are read once at first mount.
 *
 * Snapshotting the construction-only options in a ref means consumers can
 * pass inline literals (e.g. `closeButton={true}`) without re-mounting the
 * popup every render and losing focus / triggering `onClose`.
 */
export const Popup: React.FC<PopupProps> = ({
  lngLat,
  children,
  offset,
  closeButton = true,
  closeOnClick = true,
  maxWidth,
  className,
  onClose,
}) => {
  const map = useMap();
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const stableOnClose = useEvent(onClose);

  // Snapshot construction-only options at first render. Changes after mount
  // are ignored on purpose (MapLibre has no setters for these).
  const constructionOptionsRef = useRef({ closeButton, closeOnClick, className });

  const container = useMemo<HTMLDivElement | null>(
    () => (typeof document === 'undefined' ? null : document.createElement('div')),
    [],
  );

  useEffect(() => {
    if (!map || !container) return;
    const popup = new maplibregl.Popup({
      ...constructionOptionsRef.current,
      offset,
      maxWidth,
    })
      .setLngLat(lngLat)
      .setDOMContent(container)
      .addTo(map);

    const popupElement = popup.getElement();
    const handleBringToFront = () => {
      popupElement.style.zIndex = String(++globalPopupZIndex);
    };

    // Initialize with a high z-index and bring to front on click
    handleBringToFront();
    popupElement.addEventListener('click', handleBringToFront);

    const handleClose = () => stableOnClose();
    popup.on('close', handleClose);
    popupRef.current = popup;

    return () => {
      popupElement.removeEventListener('click', handleBringToFront);
      popup.off('close', handleClose);
      popup.remove();
      popupRef.current = null;
    };
    // Only re-create when the map / container identity changes. Other
    // options are either snapshotted (construction-only) or updated via
    // setters in the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, container]);

  useEffect(() => {
    popupRef.current?.setLngLat(lngLat);
  }, [lngLat[0], lngLat[1]]);

  useEffect(() => {
    if (offset !== undefined) popupRef.current?.setOffset(offset);
  }, [offset]);

  useEffect(() => {
    if (maxWidth !== undefined) popupRef.current?.setMaxWidth(maxWidth);
  }, [maxWidth]);

  if (!container) return null;
  return createPortal(children, container);
};
