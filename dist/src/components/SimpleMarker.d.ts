import { default as React } from 'react';
import { MarkerProps } from './Marker';
export interface SimpleMarkerProps extends Omit<MarkerProps, 'children'> {
    label: string;
    bgColor?: string;
    textColor?: string;
    /**
     * Below this zoom, simplify to a small {@link PinMarker} instead of the
     * full label pill. Falls back to the map's `semanticZoomThreshold` prop.
     */
    simplifyAtZoom?: number;
}
/**
 * Label pill marker with optional semantic zoom simplification. Only
 * re-renders when the zoom level *crosses* the simplification threshold,
 * not on every zoom change — thanks to {@link useMapSelector}.
 */
export declare const SimpleMarker: React.FC<SimpleMarkerProps>;
