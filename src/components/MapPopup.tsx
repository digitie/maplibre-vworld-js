import React, { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import maplibregl from 'maplibre-gl';
import { useMap } from './VWorldMap';

export interface MapPopupProps {
  lngLat: [number, number];
  children: React.ReactNode;
  offset?: maplibregl.PopupOptions['offset'];
  closeButton?: boolean;
  closeOnClick?: boolean;
  maxWidth?: string;
  className?: string;
  onClose?: () => void;
}

export const MapPopup: React.FC<MapPopupProps> = ({
  lngLat,
  children,
  offset,
  closeButton = true,
  closeOnClick = true,
  maxWidth,
  className,
  onClose,
}) => {
  const { map } = useMap();
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const onCloseRef = useRef(onClose);
  const container = useMemo(() => document.createElement('div'), []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!map) return;
    const popup = new maplibregl.Popup({
      offset,
      closeButton,
      closeOnClick,
      className,
      maxWidth,
    })
      .setLngLat(lngLat)
      .setDOMContent(container)
      .addTo(map);
    const handleClose = () => {
      onCloseRef.current?.();
    };
    popup.on('close', handleClose);
    popupRef.current = popup;

    return () => {
      popup.off('close', handleClose);
      popup.remove();
      popupRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, container]);

  useEffect(() => {
    popupRef.current?.setLngLat(lngLat);
  }, [lngLat]);

  return createPortal(children, container);
};
