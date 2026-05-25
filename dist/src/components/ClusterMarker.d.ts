import { default as React } from 'react';
import { MarkerProps } from './Marker';
export interface ClusterMarkerProps extends Omit<MarkerProps, 'children' | 'onClick'> {
    count: number;
    color?: string;
    size?: number;
    /** Click handler for the cluster bubble. */
    onClick?: () => void;
}
/**
 * Default cluster bubble — color and size scale with `count`. Used by
 * {@link ClusterLayer} when no `renderCluster` is provided.
 */
export declare const ClusterMarker: React.FC<ClusterMarkerProps>;
