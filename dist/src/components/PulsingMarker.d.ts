import { default as React } from 'react';
import { MarkerProps } from './Marker';
export interface PulsingMarkerProps extends Omit<MarkerProps, 'children'> {
    color?: string;
    size?: number;
}
export declare const PulsingMarker: React.FC<PulsingMarkerProps>;
