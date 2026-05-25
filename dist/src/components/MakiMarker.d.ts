import { default as React } from 'react';
import { PinMarkerProps } from './PinMarker';
export interface MakiMarkerProps extends Omit<PinMarkerProps, 'icon'> {
    iconName?: string;
    icon?: string;
    iconBaseUrl?: string;
    fallbackIcon?: string;
    iconColor?: string;
}
export declare const MakiMarker: React.FC<MakiMarkerProps>;
