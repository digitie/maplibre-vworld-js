import { default as React } from 'react';
import { MarkerProps } from './Marker';
export interface PinMarkerProps extends Omit<MarkerProps, 'children'> {
    color?: string;
    icon?: React.ReactNode;
    size?: number;
    showInnerCircle?: boolean;
    label?: string;
    tooltip?: string;
}
export declare const PinMarker: React.FC<PinMarkerProps>;
