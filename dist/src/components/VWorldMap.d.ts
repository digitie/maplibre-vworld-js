import { default as React } from 'react';
import { default as maplibregl } from 'maplibre-gl';
import { VWorldLayerType } from '../vworld';
/**
 * Reason the map could not be initialized, passed to the `fallback` render prop.
 */
export interface VWorldMapFallbackInfo {
    reason: 'missing-api-key' | 'map-init-error';
    /** Present when `reason === 'map-init-error'`. */
    error?: Error;
}
/**
 * Wrapped MapLibre error event. The URL of the failing resource (typically a
 * VWorld tile) has its API key segment masked so the value can be logged or
 * surfaced in the UI without leaking the key.
 */
export interface VWorldMapErrorInfo {
    /** The original MapLibre `error` event. */
    event: maplibregl.ErrorEvent;
    /** Number of errors observed since the map mounted. Starts at 1. */
    count: number;
    /** True for the single event that pushes `count` past `tileErrorThreshold`. */
    thresholdReached: boolean;
    /** Tile URL with the API key redacted, when one can be extracted. */
    redactedUrl?: string;
}
/** Props for the VWorldMap component. */
export interface VWorldMapProps {
    /**
     * VWorld API Key. Empty / whitespace renders the `fallback` instead of
     * initializing MapLibre. @required
     */
    apiKey: string;
    /** Map theme. @default 'Base' */
    layerType?: VWorldLayerType;
    /** Initial center [lng, lat]. @default [127.024612, 37.5326] */
    center?: [number, number];
    /** Initial zoom. @default 12 */
    zoom?: number;
    /** @default 6 */
    minZoom?: number;
    /** @default 19 (Satellite/Hybrid auto-capped at 18) */
    maxZoom?: number;
    /** Max pan box `[[minLng, minLat], [maxLng, maxLat]]`. */
    maxBounds?: maplibregl.LngLatBoundsLike;
    /**
     * Global zoom threshold for semantic-zoom markers (SimpleMarker etc.).
     * Markers re-render only when crossing this threshold, not on every zoomend.
     */
    semanticZoomThreshold?: number;
    /** @default true */
    showNavigationControl?: boolean;
    /** @default true */
    showGeolocateControl?: boolean;
    /** @default true */
    showScaleControl?: boolean;
    className?: string;
    /** @default { width: '100%', height: '100%' } */
    style?: React.CSSProperties;
    children?: React.ReactNode;
    /** Called once with the MapLibre instance after `load`. */
    onMapLoad?: (map: maplibregl.Map) => void;
    /**
     * Map background click. Read `e.lngLat.lng` / `.lat` for coordinates.
     * Registered with a stable identity (useStableCallback) — prop changes
     * never re-create the map.
     */
    onMapClick?: (e: maplibregl.MapMouseEvent) => void;
    /**
     * Wrapped MapLibre `error` handler. Receives running `count`,
     * `thresholdReached` flag, and a **redacted** tile URL. Default logs to
     * `console.warn` with the key already masked.
     */
    onMapError?: (e: VWorldMapErrorInfo) => void;
    /** Error count that flips `onMapError.thresholdReached` to true. @default Infinity */
    tileErrorThreshold?: number;
    /** MapLibre `transformRequest` for proxies / auth headers. */
    transformRequest?: maplibregl.RequestTransformFunction;
    /**
     * Replaces the map when init fails (missing key or no WebGL). Accepts a
     * ReactNode or a render fn receiving `{ reason, error? }`.
     */
    fallback?: React.ReactNode | ((info: VWorldMapFallbackInfo) => React.ReactNode);
    /** Rendered as overlay until MapLibre fires `load`. */
    loadingSkeleton?: React.ReactNode;
    /**
     * When `false`, programmatic `center`/`zoom` prop changes use `jumpTo`
     * (instant). @default true
     */
    animateCameraChanges?: boolean;
}
/**
 * Top-level MapLibre + VWorld map. Provides a MapStore that child components
 * subscribe to via fine-grained selectors (`useMap`, `useMapZoom`,
 * `useMapSelector`) — only consumers whose selected slice changed re-render.
 *
 * @example
 *   <VWorldMap apiKey={KEY}>
 *     <Marker lngLat={[127, 37]} />
 *   </VWorldMap>
 */
export declare const VWorldMap: React.FC<VWorldMapProps>;
