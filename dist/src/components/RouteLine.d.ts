import { default as React } from 'react';
/**
 * Props for the RouteLine component.
 */
export interface RouteLineProps {
    /**
     * Unique identifier for the route line. Used as the MapLibre layer and source ID prefix.
     */
    id?: string;
    /**
     * Array of coordinates [longitude, latitude] that form the line.
     * MUST be memoized or defined outside the component to prevent infinite re-renders.
     */
    coordinates?: [number, number][];
    /**
     * GeoJSON data for the route (Feature, FeatureCollection, or URL).
     * If provided, overrides `coordinates`.
     */
    data?: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString> | GeoJSON.FeatureCollection<GeoJSON.LineString | GeoJSON.MultiLineString> | string;
    /**
     * Hex color for the line.
     * @default '#2196F3'
     */
    color?: string;
    /**
     * Width of the line in pixels.
     * @default 4
     */
    lineWidth?: number;
    /**
     * Array of numbers specifying the dash pattern (e.g. [4, 4] for 4px dash, 4px gap).
     * Leave undefined for a solid line.
     */
    lineDasharray?: number[];
    /**
     * Fired when the line is clicked.
     */
    onClick?: (e: maplibregl.MapMouseEvent & {
        features?: maplibregl.MapGeoJSONFeature[];
    }) => void;
    /**
     * Fired when the mouse enters the line.
     */
    onMouseEnter?: (e: maplibregl.MapMouseEvent & {
        features?: maplibregl.MapGeoJSONFeature[];
    }) => void;
    /**
     * Fired when the mouse leaves the line.
     */
    onMouseLeave?: (e: maplibregl.MapMouseEvent) => void;
}
/**
 * Draws a GeoJSON LineString on the map connecting the provided coordinates.
 * Safe to use with dynamic toggling and respects MapLibre's asynchronous style loading.
 */
export declare const RouteLine: React.FC<RouteLineProps>;
