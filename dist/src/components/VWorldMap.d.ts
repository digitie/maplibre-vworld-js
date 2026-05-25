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
/**
 * Props for the VWorldMap component.
 */
export interface VWorldMapProps {
    /**
     * VWorld API Key for authentication. If empty/missing, the `fallback` is
     * rendered instead of attempting to initialize MapLibre.
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
     * Click handler for the map. Receives the native MapLibre `MapMouseEvent`.
     * Read `e.lngLat.lng` / `e.lngLat.lat` for coordinates. The latest version
     * of the handler is always invoked even if `onMapClick` changes between
     * renders (the map is not re-created).
     */
    onMapClick?: (e: maplibregl.MapMouseEvent) => void;
    /**
     * Handler for MapLibre `error` events (failed tile fetches, style errors,
     * WebGL warnings). The event is wrapped with a running count, a
     * `thresholdReached` flag, and a redacted URL so it can be logged safely.
     *
     * If omitted, errors are logged via `console.warn` (also with the URL
     * redacted) so the page does not spam the network panel silently.
     */
    onMapError?: (e: VWorldMapErrorInfo) => void;
    /**
     * Number of MapLibre `error` events after which `onMapError` is called with
     * `thresholdReached: true`. Useful for debug UIs that want to swap to a
     * fallback or surface a warning banner only after sustained failure.
     * @default Infinity
     */
    tileErrorThreshold?: number;
    /**
     * A callback run before the Map makes a request for an external URL.
     * Useful for handling CORS, adding authentication headers, or rewriting URLs to a proxy server.
     */
    transformRequest?: maplibregl.RequestTransformFunction;
    /**
     * Rendered instead of the map when the map cannot be initialized:
     * - `apiKey` is empty/whitespace-only (`reason: 'missing-api-key'`)
     * - the MapLibre constructor throws, e.g. no WebGL (`reason: 'map-init-error'`)
     *
     * Accepts a React node or a render function that receives a
     * {@link VWorldMapFallbackInfo}. Useful for keeping the page layout intact
     * when the VWorld API key is missing in CI / on-prem environments.
     */
    fallback?: React.ReactNode | ((info: VWorldMapFallbackInfo) => React.ReactNode);
    /**
     * Rendered as an overlay while the map is initializing (before MapLibre
     * fires its `load` event). Defaults to nothing.
     */
    loadingSkeleton?: React.ReactNode;
    /**
     * If `false`, programmatic `center`/`zoom` prop changes use `jumpTo`
     * (instant) instead of `flyTo` (animated). Useful for "click to recenter"
     * debug UIs where animation would disorient the user.
     * @default true
     */
    animateCameraChanges?: boolean;
}
/**
 * Stable per-mount context: the MapLibre instance handle and configuration
 * that only changes on map mount/unmount. Markers that just need to register
 * sources/layers subscribe here and DO NOT re-render on zoom changes.
 */
interface MapInstanceContextType {
    map: maplibregl.Map | null;
    semanticZoomThreshold?: number;
}
/**
 * Returns the map instance + global semantic zoom threshold.
 *
 * Subscribes to the STABLE instance context only — components using only
 * `useMap()` will NOT re-render on `zoomend`. If you need the live zoom,
 * use {@link useMapZoom} or {@link useMapContext}.
 *
 * NOTE (breaking from <1.0): `useMap()` no longer returns a `zoom` field.
 * Read zoom from `useMapZoom()` instead. This split lets markers that only
 * need the map handle (e.g. the bundled <Marker>, <PolygonArea>,
 * <RouteLine>, <MarkerClusterer>) skip re-rendering on every camera change.
 */
export declare const useMap: () => MapInstanceContextType;
/**
 * Returns the current map zoom level. Re-renders the consumer on `zoomend`.
 * Useful for semantic zooming (e.g. degrading marker quality at low zooms).
 */
export declare const useMapZoom: () => number;
/**
 * Returns the merged shape `{ map, zoom, semanticZoomThreshold }`. Consumes
 * BOTH contexts and therefore re-renders on every `zoomend`. Use only when
 * the component genuinely needs zoom — otherwise prefer `useMap()`.
 */
export declare const useMapContext: () => {
    zoom: number;
    map: maplibregl.Map | null;
    semanticZoomThreshold?: number;
};
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
