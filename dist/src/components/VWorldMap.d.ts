import { default as React } from 'react';
import { default as maplibregl, Map as MapLibreMap } from 'maplibre-gl';
import { VWorldLayerType } from '../vworld';
/**
 * Reason the map cannot be initialized.
 *
 * - `missing-api-key` — `apiKey` is empty or whitespace-only. The MapLibre
 *   instance is never created.
 * - `map-init-error` — the MapLibre constructor threw (typically no WebGL
 *   support). The accompanying `error` is the raw exception.
 */
export type VWorldMapFallbackReason = 'missing-api-key' | 'map-init-error';
export interface VWorldMapFallbackInfo {
    reason: VWorldMapFallbackReason;
    /** Present when `reason === 'map-init-error'`. */
    error?: Error;
}
/**
 * Props for the {@link VWorldMap} component.
 *
 * Event-callback props (`onClick`, `onMoveEnd`, …) follow MapLibre's native
 * event names without the `on*Map*` prefix, matching the convention of
 * `react-map-gl` and other React map wrappers. Raw MapLibre event objects
 * are passed through unchanged so consumers can read MapLibre-typed fields
 * without unwrapping a custom envelope.
 */
export interface VWorldMapProps {
    /**
     * VWorld API Key. If empty or whitespace-only, {@link VWorldMapProps.fallback}
     * is rendered instead of mounting MapLibre.
     */
    apiKey: string;
    /**
     * VWorld layer to render.
     * @default 'Base'
     */
    layerType?: VWorldLayerType;
    /**
     * Initial map center, `[longitude, latitude]`. Required: there is no
     * implicit default, since a sensible center depends on the consuming app.
     */
    center: [number, number];
    /**
     * Initial zoom level.
     * @default 12
     */
    zoom?: number;
    /**
     * Pitch angle (degrees, 0–60).
     * @default 0
     */
    pitch?: number;
    /**
     * Bearing (degrees clockwise from north).
     * @default 0
     */
    bearing?: number;
    /** Minimum allowed zoom. @default 6 */
    minZoom?: number;
    /** Maximum allowed zoom. @default 19 (layer-clamped at runtime). */
    maxZoom?: number;
    /** Restrict panning to this LngLatBounds. */
    maxBounds?: maplibregl.LngLatBoundsLike;
    /**
     * Global zoom threshold below which markers may simplify themselves.
     * Consumed via {@link useMapSelector}.
     */
    semanticZoomThreshold?: number;
    /** Render the built-in navigation control. @default true */
    navigation?: boolean;
    /** Render the built-in geolocate control. @default true */
    geolocate?: boolean;
    /** Render the built-in scale control. @default true */
    scale?: boolean;
    /** Container className. */
    className?: string;
    /**
     * Container style.
     * @default { width: '100%', height: '100%' }
     */
    style?: React.CSSProperties;
    /** Marker / layer / popup children. Mounted after the map fires `load`. */
    children?: React.ReactNode;
    /** Fired once after the MapLibre `load` event. */
    onLoad?: (map: MapLibreMap) => void;
    /** Raw MapLibre `click` event. */
    onClick?: (event: maplibregl.MapMouseEvent) => void;
    /** Raw MapLibre `contextmenu` event (right-click). */
    onContextMenu?: (event: maplibregl.MapMouseEvent) => void;
    /** Raw MapLibre `moveend` event — camera came to rest after a pan/zoom. */
    onMoveEnd?: (event: maplibregl.MapLibreEvent) => void;
    /** Raw MapLibre `zoomend` event. */
    onZoomEnd?: (event: maplibregl.MapLibreEvent) => void;
    /** Raw MapLibre `idle` event — rendering finished, queue drained. */
    onIdle?: (event: maplibregl.MapLibreEvent) => void;
    /**
     * Raw MapLibre `error` event. If omitted, errors are logged via
     * `console.warn` with the API key in the URL redacted.
     *
     * Inspect tile-vs-style origin with {@link isVWorldTileError} and redact
     * URLs for logging with {@link redactVWorldUrl}.
     */
    onError?: (event: maplibregl.ErrorEvent) => void;
    /** Pre-request hook (CORS, auth headers, proxy rewrites). */
    transformRequest?: maplibregl.RequestTransformFunction;
    /**
     * Rendered instead of the map when the map cannot be initialized — see
     * {@link VWorldMapFallbackReason} for the cases. Accepts a node or a render
     * function.
     */
    fallback?: React.ReactNode | ((info: VWorldMapFallbackInfo) => React.ReactNode);
    /** Overlay shown until the map fires `load`. */
    loadingSkeleton?: React.ReactNode;
    /**
     * `false` → programmatic `center`/`zoom` prop changes use `jumpTo`
     * (instant). `true` (default) uses `flyTo` (animated).
     */
    animateCameraChanges?: boolean;
    /**
     * Extra options forwarded to `flyTo` when `animateCameraChanges` is true.
     * `center`, `zoom`, `pitch`, and `bearing` are always taken from the
     * corresponding props.
     */
    flyToOptions?: Omit<maplibregl.FlyToOptions, 'center' | 'zoom' | 'pitch' | 'bearing'>;
    /**
     * If `true`, uses `IntersectionObserver` to defer map initialization until the
     * container enters the viewport. If `'manual'`, waits until `lazyEnabled` is true.
     * @default false
     */
    lazy?: boolean | 'manual';
    /**
     * When `lazy="manual"`, controls whether the map should start loading.
     * Ignored if `lazy` is true or false.
     */
    lazyEnabled?: boolean;
    /**
     * Root margin for the IntersectionObserver when `lazy=true`.
     * @default '0px'
     */
    lazyRootMargin?: string;
}
/**
 * VWorld + MapLibre map container.
 *
 * Maintains a long-lived MapLibre instance: prop changes update the existing
 * map (style swap, camera animation, control toggles) rather than tearing
 * it down. Children consume the instance through hooks exported from
 * `./store` — for example `useMap()` to register sources/layers, or
 * `useMapSelector()` to subscribe to a derived slice of state.
 */
export declare const VWorldMap: React.FC<VWorldMapProps>;
