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
    /**
     * Semantic zoom thresholds for Level of Detail (LOD): `[stage2Zoom, stage3Zoom]`.
     * - Zoom >= stage2Zoom: Stage 1 (Full detail, all prices)
     * - stage3Zoom <= Zoom < stage2Zoom: Stage 2 (Mid detail, up to 2 prices)
     * - Zoom < stage3Zoom: Stage 3 (Low detail, small dot)
     * @default [13, 11]
     */
    lodThresholds?: [number, number];
}
/**
 * Airbnb-style price chip marker.
 */
export declare const PriceMarker: React.FC<PriceMarkerProps>;
