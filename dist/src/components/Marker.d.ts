import { default as React } from 'react';
export interface MarkerProps {
    lngLat: [number, number];
    color?: string;
    draggable?: boolean;
    onDragEnd?: (lngLat: [number, number]) => void;
    children?: React.ReactNode;
}
export declare const Marker: React.FC<MarkerProps>;
