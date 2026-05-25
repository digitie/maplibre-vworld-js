import { default as React } from 'react';
import { default as maplibregl } from 'maplibre-gl';
import { Bounds } from '../schemas';
export interface ServerClusterPoint {
    id: string | number;
    lngLat: [number, number];
    count: number;
    label?: string;
    bounds?: Bounds;
    zoomTo?: number;
    color?: string;
    size?: number;
    [key: string]: unknown;
}
export interface ServerClusterLayerProps {
    clusters: ServerClusterPoint[];
    renderCluster?: (cluster: ServerClusterPoint, onClick: () => void) => React.ReactNode;
    onClusterClick?: (cluster: ServerClusterPoint) => void;
    fitBoundsOptions?: Omit<maplibregl.FitBoundsOptions, 'linear'>;
    flyToOptions?: Omit<maplibregl.FlyToOptions, 'center' | 'zoom'>;
}
export declare const ServerClusterLayer: React.FC<ServerClusterLayerProps>;
