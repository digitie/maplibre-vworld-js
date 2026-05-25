import { default as React } from 'react';
import { default as maplibregl } from 'maplibre-gl';
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
export declare const Marker: React.FC<MarkerProps>;
