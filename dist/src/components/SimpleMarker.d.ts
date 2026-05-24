import { default as React } from 'react';
import { MarkerProps } from './Marker';
export interface SimpleMarkerProps extends Omit<MarkerProps, 'children'> {
    label: string;
    bgColor?: string;
    textColor?: string;
    simplifyAtZoom?: number;
}
export declare const SimpleMarker: React.FC<SimpleMarkerProps>;
