import { default as React } from 'react';
import { MarkerProps } from './Marker';
export interface ClusterMarkerProps extends Omit<MarkerProps, 'children' | 'onClick'> {
    count: number;
    color?: string;
    size?: number;
    onClick?: () => void;
}
export declare const ClusterMarker: React.FC<ClusterMarkerProps>;
