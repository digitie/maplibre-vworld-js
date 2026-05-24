import { default as React } from 'react';
import { MarkerProps } from './Marker';
export interface RoutePointMarkerProps extends Omit<MarkerProps, 'children'> {
    label: string | number;
    color?: string;
    size?: number;
}
export declare const RoutePointMarker: React.FC<RoutePointMarkerProps>;
