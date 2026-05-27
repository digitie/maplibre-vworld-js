import { ErrorEvent, StyleSpecification } from 'maplibre-gl';
/**
 * Registers the `vworld://` custom protocol handler with MapLibre.
 * This enables rendering a fallback image when a tile fails to load.
 */
export declare function registerVWorldProtocol(): void;
/**
 * VWorld layer identifier. `gray` is a synonym for the VWorld "white" basemap.
 */
export type VWorldLayerType = 'Base' | 'gray' | 'midnight' | 'Hybrid' | 'Satellite';
/**
 * MapLibre `error.error` value shape when the failure comes from a resource
 * loader (tile fetch, style fetch, image fetch). MapLibre attaches `status` /
 * `url` / `statusText` on those errors but does not type them.
 */
export interface VWorldResourceError extends Error {
    status?: number;
    statusText?: string;
    url?: string;
}
/**
 * Build a VWorld WMTS tile URL template for a layer. The returned string
 * contains MapLibre placeholders `{z}/{y}/{x}` so it can be passed directly
 * to a raster source's `tiles` array.
 *
 * The API key is `encodeURIComponent`-encoded after trimming surrounding
 * whitespace, so accidental newlines / spaces in environment variables do not
 * break the URL.
 */
export declare function getVWorldTileUrl(apiKey: string, layerType: VWorldLayerType): string;
/**
 * Maximum zoom level the VWorld tile service serves for a given layer.
 * Satellite / Hybrid stop at z18; Base / gray / midnight go to z19.
 */
export declare function getVWorldMaxZoom(layerType: VWorldLayerType): number;
/**
 * Replace the API-key segment of a VWorld WMTS tile URL with `***` so the URL
 * can be safely logged, shown in error banners, or sent to monitoring.
 *
 * The VWorld WMTS path format is:
 *   `https://api.vworld.kr/req/wmts/1.0.0/{key}/{layer}/{z}/{y}/{x}.{ext}`
 *
 * Inputs that do not match the WMTS path are returned unchanged, so this is
 * safe to call on arbitrary URLs (e.g. logging error messages of unknown
 * origin). `undefined` is passed through as `undefined`.
 */
export declare function redactVWorldUrl(url: string): string;
export declare function redactVWorldUrl(url: string | undefined): string | undefined;
/**
 * Heuristic: did this MapLibre `error` event originate from a VWorld tile
 * fetch? Useful for differentiating tile-level transient failures from style
 * / WebGL errors when deciding whether to surface a banner or retry.
 */
export declare function isVWorldTileError(event: ErrorEvent): boolean;
/**
 * Build a MapLibre {@link StyleSpecification} that renders the requested
 * VWorld layer. For `Hybrid`, the satellite imagery is laid down first and
 * the hybrid label tiles are stacked on top.
 */
export declare function getVWorldStyle(apiKey: string, layerType: VWorldLayerType): StyleSpecification;
