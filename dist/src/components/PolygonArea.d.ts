import { default as React } from 'react';
import { default as maplibregl } from 'maplibre-gl';
type PolygonGeoJSON = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
export type PolygonAreaInput = PolygonGeoJSON | string;
type FeatureMouseEvent = maplibregl.MapMouseEvent & {
    features?: maplibregl.MapGeoJSONFeature[];
};
export interface PolygonAreaProps {
    /** Unique ID — used as prefix for the MapLibre source and layer IDs. */
    id: string;
    /**
     * GeoJSON Polygon / MultiPolygon Feature, FeatureCollection, or a URL
     * MapLibre can fetch. Must be referentially stable — pass a memoized value
     * or store the GeoJSON in a ref. Reference changes trigger `setData`.
     */
    data: PolygonAreaInput;
    /** @default 'rgba(33, 150, 243, 0.4)' */
    fillColor?: string;
    /** @default '#2196F3' */
    outlineColor?: string;
    /** @default 2 */
    outlineWidth?: number;
    onClick?: (event: FeatureMouseEvent) => void;
    onMouseEnter?: (event: FeatureMouseEvent) => void;
    onMouseLeave?: (event: maplibregl.MapMouseEvent) => void;
}
/**
 * Renders a GeoJSON Polygon / MultiPolygon as a MapLibre fill+line layer
 * pair, persisting across style swaps. Suitable for administrative
 * boundaries, parks, building footprints, etc.
 */
export declare const PolygonArea: React.FC<PolygonAreaProps>;
export {};
