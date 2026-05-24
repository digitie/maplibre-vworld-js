import { default as React } from 'react';
import { MarkerProps } from './Marker';
export interface PlaceMarkerProps extends Omit<MarkerProps, 'children'> {
    title: string;
    description: string;
    category: string;
    photoUrl?: string;
    link?: string;
    simplifyAtZoom?: number;
}
export declare const PlaceMarker: React.FC<PlaceMarkerProps>;
