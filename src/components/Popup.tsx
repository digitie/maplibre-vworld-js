'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import maplibregl from 'maplibre-gl';
import { useMap, useEvent } from '../store/hooks';

export interface PopupProps {
  /** Anchor position as `[longitude, latitude]`. */
  lngLat: [number, number];
  /** Popup body. Rendered into a `<div>` via React portal. */
  children: React.ReactNode;
  /** Offset from the anchor point, see {@link maplibregl.PopupOptions.offset}. */
  offset?: maplibregl.PopupOptions['offset'];
  /** @default true */
  closeButton?: boolean;
  /** @default true */
  closeOnClick?: boolean;
  /** Constrain the popup width, e.g. `'320px'`. */
  maxWidth?: string;
  /** Additional className applied to the popup root. */
  className?: string;
  /** Fired when the popup closes (button click, outside click, or unmount). */
  onClose?: () => void;
}

/**
 * MapLibre popup rendered with React children via portal. The MapLibre
 * instance is created once per `(map, popup option)` set and reused on
 * position / content changes.
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

  const container = useMemo<HTMLDivElement | null>(
    () => (typeof document === 'undefined' ? null : document.createElement('div')),
    [],
  );

  useEffect(() => {
    if (!map || !container) return;
    const popup = new maplibregl.Popup({ offset, closeButton, closeOnClick, className, maxWidth })
      .setLngLat(lngLat)
      .setDOMContent(container)
      .addTo(map);
    const handleClose = () => stableOnClose();
    popup.on('close', handleClose);
    popupRef.current = popup;

    return () => {
      popup.off('close', handleClose);
      popup.remove();
      popupRef.current = null;
    };
    // Re-create only when MapLibre options that the constructor consumes
    // change. `lngLat` is applied via setLngLat below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, container, offset, closeButton, closeOnClick, className, maxWidth]);

  useEffect(() => {
    popupRef.current?.setLngLat(lngLat);
  }, [lngLat[0], lngLat[1]]);

  if (!container) return null;
  return createPortal(children, container);
};
