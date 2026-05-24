import { default as React } from 'react';
import { MarkerProps } from './Marker';
export interface PriceMarkerProps extends Omit<MarkerProps, 'children'> {
    price: string | number;
    currency?: string;
    isHoverable?: boolean;
}
export declare const PriceMarker: React.FC<PriceMarkerProps>;
