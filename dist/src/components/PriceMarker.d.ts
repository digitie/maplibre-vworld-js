import { default as React } from 'react';
import { MarkerProps } from './Marker';
export interface PriceItem {
    label?: string;
    price: string | number;
    /** Currency / unit symbol shown before the price. Falls back to the root `currency` prop. */
    currency?: string;
}
export interface PriceMarkerProps extends Omit<MarkerProps, 'children'> {
    /** Single price or an array of price items (e.g., for gas stations with multiple fuels). */
    price: string | number | PriceItem[];
    /** Currency / unit symbol shown before the price. @default '' */
    currency?: string;
    /** Apply hover styling. @default true */
    isHoverable?: boolean;
}
/**
 * Airbnb-style price chip marker.
 */
export declare const PriceMarker: React.FC<PriceMarkerProps>;
