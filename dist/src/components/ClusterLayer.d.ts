import { default as React } from 'react';
import { default as Supercluster } from 'supercluster';
/**
 * Standard supercluster point Feature with the original consumer data merged
 * into `properties`.
 */
export interface ClusterPointFeature<P = Record<string, unknown>> {
    type: 'Feature';
    properties: P & {
        cluster: boolean;
        cluster_id?: number;
        point_count?: number;
        point_count_abbreviated?: string | number;
    };
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
}
/**
 * Input point. Beyond `id` and `lngLat`, arbitrary properties are preserved
 * and surfaced through the `renderMarker` callback's `point` argument.
 */
export interface ClusterPoint {
    id: string | number;
    lngLat: [number, number];
    [key: string]: unknown;
}
export interface ClusterLayerProps {
    /** Points to cluster. */
    points: ClusterPoint[];
    /** Render an unclustered point. */
    renderMarker: (point: ClusterPoint) => React.ReactNode;
    /**
     * Render a cluster bubble. If omitted, {@link ClusterMarker} is used and
     * clicking expands the cluster via `flyTo` to the supercluster expansion
     * zoom.
     */
    renderCluster?: (cluster: ClusterPointFeature, pointCount: number, supercluster: Supercluster) => React.ReactNode;
    /** Pixel radius for grouping. @default 50 */
    radius?: number;
    /** Maximum zoom at which clustering still applies. @default 16 */
    maxZoom?: number;
    /**
     * If true, supercluster will generate stable IDs for clusters.
     * This is recommended to prevent React key churn on re-renders.
     * @default true
     */
    generateId?: boolean;
}
/**
 * Clusters dense marker collections via `supercluster`. Off-screen points
 * are not rendered (viewport culling), and re-cluster only happens when
 * the view bounds or zoom level actually change.
 *
 * Consumers supply a flat `points` array and a `renderMarker` function. The
 * library handles the GeoJSON conversion and supercluster lifecycle.
 */
export declare const ClusterLayer: React.FC<ClusterLayerProps>;
