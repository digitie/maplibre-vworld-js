import { default as React } from 'react';
import { default as maplibregl } from 'maplibre-gl';
type FeatureMouseEvent = maplibregl.MapMouseEvent & {
    features?: maplibregl.MapGeoJSONFeature[];
};
export interface RouteLineProps {
    /** Unique ID — prefixes the MapLibre source and layer IDs. */
    id?: string;
    /**
     * Polyline coordinates as `[longitude, latitude]` tuples. Must be
     * referentially stable: reference changes trigger a `setData` call.
     */
    coordinates?: [number, number][];
    /**
     * GeoJSON LineString / MultiLineString Feature, FeatureCollection, or URL.
     * If provided, overrides `coordinates`. Must be referentially stable.
     */
    data?: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString> | GeoJSON.FeatureCollection | string;
    /** @default '#2196F3' */
    color?: string;
    /** Width in pixels. @default 4 */
    width?: number;
    /** Dash pattern, e.g. `[4, 4]` for 4-on / 4-off. */
    dashArray?: number[];
    onClick?: (event: FeatureMouseEvent) => void;
    onMouseEnter?: (event: FeatureMouseEvent) => void;
    onMouseLeave?: (event: maplibregl.MapMouseEvent) => void;
}
/**
 * Renders a polyline as a MapLibre line layer, persisting across style
 * swaps. For multi-line or already-built GeoJSON, drop down to the raw
 * MapLibre API via {@link useMap}.
 */
export declare const RouteLine: React.FC<RouteLineProps>;
export {};
