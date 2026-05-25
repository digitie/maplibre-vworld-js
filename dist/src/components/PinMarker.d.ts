import { default as React } from 'react';
import { MarkerProps } from './Marker';
export interface PinMarkerProps extends Omit<MarkerProps, 'children' | 'anchor'> {
    color?: string;
    icon?: React.ReactNode;
    size?: number;
    showInnerCircle?: boolean;
    label?: string;
    tooltip?: string;
}
/**
 * Teardrop-shaped pin with an optional icon centered in the head and an
 * optional label below the tip. Anchors at the tip (bottom-center) so the
 * coordinate refers to the pointed-to location, not the bubble center.
 */
export declare const PinMarker: React.FC<PinMarkerProps>;
