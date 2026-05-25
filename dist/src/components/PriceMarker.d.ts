import { default as React } from 'react';
import { MarkerProps } from './Marker';
export interface PriceMarkerProps extends Omit<MarkerProps, 'children'> {
    price: string | number;
    /** Currency / unit symbol shown before the price. @default '' */
    currency?: string;
    /** Apply hover styling. @default true */
    isHoverable?: boolean;
}
/**
 * Airbnb-style price chip marker.
 */
export declare const PriceMarker: React.FC<PriceMarkerProps>;
