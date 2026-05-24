import { default as React } from 'react';
/**
 * Props for the PolygonArea component.
 */
export interface PolygonAreaProps {
    /**
     * Unique identifier for the area. Used as the MapLibre layer and source ID prefix.
     */
    id: string;
    /**
     * GeoJSON data for the area (Feature, FeatureCollection, or URL).
     * Usually a Polygon or MultiPolygon.
     */
    data: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon> | string;
    /**
     * Fill color of the area.
     * @default 'rgba(33, 150, 243, 0.4)'
     */
    fillColor?: string;
    /**
     * Outline color of the area.
     * @default '#2196F3'
     */
    outlineColor?: string;
    /**
     * Outline width in pixels.
     * @default 2
     */
    outlineWidth?: number;
    /**
     * Fired when the area is clicked.
     */
    onClick?: (e: maplibregl.MapMouseEvent & {
        features?: maplibregl.MapGeoJSONFeature[];
    }) => void;
    /**
     * Fired when the mouse enters the area.
     */
    onMouseEnter?: (e: maplibregl.MapMouseEvent & {
        features?: maplibregl.MapGeoJSONFeature[];
    }) => void;
    /**
     * Fired when the mouse leaves the area.
     */
    onMouseLeave?: (e: maplibregl.MapMouseEvent) => void;
}
/**
 * Draws a GeoJSON Polygon or MultiPolygon on the map.
 * Useful for displaying national parks, administrative boundaries, etc.
 */
export declare const PolygonArea: React.FC<PolygonAreaProps>;
