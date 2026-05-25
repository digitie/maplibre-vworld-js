import { default as React } from 'react';
import { MarkerProps } from './Marker';
export interface PlaceMarkerProps extends Omit<MarkerProps, 'children'> {
    title: string;
    description: string;
    category: string;
    photoUrl?: string;
    link?: string;
    /** Link button label. @default 'View more' */
    linkLabel?: string;
    /** Below this zoom, replace the card with a {@link PinMarker}. */
    simplifyAtZoom?: number;
}
export declare const PlaceMarker: React.FC<PlaceMarkerProps>;
