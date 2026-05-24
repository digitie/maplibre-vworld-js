import { default as React } from 'react';
import { default as maplibregl } from 'maplibre-gl';
import { VWorldLayerType } from '../vworld';
/**
 * Props for the VWorldMap component.
 */
export interface VWorldMapProps {
    /**
     * VWorld API Key for authentication.
     * @required
     */
    apiKey: string;
    /**
     * Type of the map layer to render.
     * @default 'Base'
     */
    layerType?: VWorldLayerType;
    /**
     * Initial center coordinates of the map [longitude, latitude].
     * @default [127.024612, 37.532600]
     */
    center?: [number, number];
    /**
     * Initial zoom level of the map.
     * @default 12
     */
    zoom?: number;
    /**
     * Minimum zoom level allowed.
     * @default 6
     */
    minZoom?: number;
    /**
     * Maximum zoom level allowed.
     * @default 19
     */
    maxZoom?: number;
    /**
     * Maximum bounds of the map (restrict panning outside this box).
     * Format: [[minLng, minLat], [maxLng, maxLat]]
     */
    maxBounds?: maplibregl.LngLatBoundsLike;
    /**
     * Global threshold for semantic zoom.
     * Markers can use this to simplify themselves when the map is zoomed out below this value.
     */
    semanticZoomThreshold?: number;
    /**
     * Show navigation controls (zoom in/out, compass).
     * @default true
     */
    showNavigationControl?: boolean;
    /**
     * Show geolocate control to track user's current location.
     * @default true
     */
    showGeolocateControl?: boolean;
    /**
     * Show the scale bar control on the bottom right.
     * @default true
     */
    showScaleControl?: boolean;
    /**
     * Custom CSS class name for the map container.
     */
    className?: string;
    /**
     * Custom CSS styles for the map container.
     * @default { width: '100%', height: '100%' }
     */
    style?: React.CSSProperties;
    /**
     * Child elements such as Markers, Clusters, and Lines.
     */
    children?: React.ReactNode;
    /**
     * Callback fired when the map is fully loaded.
     */
    onMapLoad?: (map: maplibregl.Map) => void;
    /**
     * A callback run before the Map makes a request for an external URL.
     * Useful for handling CORS, adding authentication headers, or rewriting URLs to a proxy server.
     */
    transformRequest?: maplibregl.RequestTransformFunction;
}
interface MapContextType {
    map: maplibregl.Map | null;
    zoom: number;
    semanticZoomThreshold?: number;
}
export declare const useMap: () => MapContextType;
/**
 * Custom hook to get the full map context, including global semantic zoom threshold.
 */
export declare const useMapContext: () => MapContextType;
/**
 * Custom hook to get the current map zoom level.
 * Useful for semantic zooming (e.g. degrading marker quality at low zooms).
 */
export declare const useMapZoom: () => number;
/**
 * The base map component that initializes MapLibre GL JS with VWorld maps.
 * It provides a MapContext to all child components.
 *
 * @example
 * <VWorldMap apiKey="YOUR_KEY">
 *   <Marker lngLat={[127.0, 37.0]} />
 * </VWorldMap>
 */
export declare const VWorldMap: React.FC<VWorldMapProps>;
export {};
