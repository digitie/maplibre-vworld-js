import { default as React } from 'react';
export interface PointFeature {
    type: 'Feature';
    properties: {
        cluster: boolean;
        cluster_id?: number;
        point_count?: number;
        point_count_abbreviated?: string | number;
        [key: string]: any;
    };
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
}
/**
 * Interface representing a point to be clustered.
 */
export interface ClusterPoint {
    id: string | number;
    lngLat: [number, number];
    [key: string]: any;
}
/**
 * Props for the MarkerClusterer component.
 */
export interface MarkerClustererProps {
    /**
     * Array of point objects to be rendered or clustered.
     */
    points: ClusterPoint[];
    /**
     * Render function for an individual, unclustered marker.
     */
    renderMarker: (point: ClusterPoint) => React.ReactNode;
    /**
     * Optional render function for a cluster marker.
     * If omitted, a default circular cluster marker is used.
     * The third argument is the supercluster instance, useful for
     * `getClusterExpansionZoom(cluster_id)` inside an onClick handler.
     */
    renderCluster?: (cluster: PointFeature, pointCount: number, supercluster: any) => React.ReactNode;
    /**
     * The pixel radius for grouping markers together.
     * @default 50
     */
    radius?: number;
    /**
     * The max zoom level where markers are clustered. Beyond this, all markers dissolve.
     * @default 16
     */
    maxZoom?: number;
}
/**
 * A highly optimized component that groups nearby markers into clusters based on the current zoom level and map bounds.
 * Automatically performs Viewport Culling, meaning off-screen markers are unmounted from the DOM.
 */
export declare const MarkerClusterer: React.FC<MarkerClustererProps>;
