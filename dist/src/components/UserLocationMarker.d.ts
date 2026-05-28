import { default as React } from 'react';
import { PulsingMarkerProps } from './PulsingMarker';
export interface UserLocationMarkerProps extends Omit<PulsingMarkerProps, 'children'> {
    /** User's position as `[longitude, latitude]`. */
    lngLat: [number, number];
    /** Accuracy in meters. If provided, draws a circular overlay around the location. */
    accuracy_m?: number;
}
/**
 * A marker specifically designed to represent the user's current location.
 * Internally uses `PulsingMarker` for the blue pulsing dot effect.
 */
export declare const UserLocationMarker: React.FC<UserLocationMarkerProps>;
