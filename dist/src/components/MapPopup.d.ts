import { default as React } from 'react';
import { default as maplibregl } from 'maplibre-gl';
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
export declare const MapPopup: React.FC<MapPopupProps>;
