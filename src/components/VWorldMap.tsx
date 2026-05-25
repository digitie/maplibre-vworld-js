'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  getVWorldMaxZoom,
  getVWorldStyle,
  redactVWorldUrl,
  type VWorldLayerType,
} from '../vworld';
import { MapStore } from '../store/mapStore';
import { MapStoreContext, useEvent, useMapLoaded } from '../store/hooks';

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
}

function renderFallback(
  fallback: VWorldMapProps['fallback'],
  info: VWorldMapFallbackInfo,
): React.ReactNode {
  if (fallback === undefined) return null;
  if (typeof fallback === 'function') return fallback(info);
  return fallback;
}

function extractErrorUrl(event: maplibregl.ErrorEvent): string | undefined {
  const candidates: Array<unknown> = [
    (event as { error?: { url?: unknown } }).error?.url,
    (event as { url?: unknown }).url,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.length > 0) return candidate;
  }
  return undefined;
}

interface CameraSnapshot {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
}

function sameCamera(a: CameraSnapshot, b: CameraSnapshot): boolean {
  return a.center[0] === b.center[0] &&
    a.center[1] === b.center[1] &&
    a.zoom === b.zoom &&
    a.pitch === b.pitch &&
    a.bearing === b.bearing;
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
export const VWorldMap: React.FC<VWorldMapProps> = ({
  apiKey,
  layerType = 'Base',
  center,
  zoom = 12,
  pitch = 0,
  bearing = 0,
  minZoom = 6,
  maxZoom = 19,
  maxBounds,
  semanticZoomThreshold,
  navigation = true,
  geolocate = true,
  scale = true,
  className = '',
  style = { width: '100%', height: '100%' },
  children,
  onLoad,
  onClick,
  onContextMenu,
  onMoveEnd,
  onZoomEnd,
  onIdle,
  onError,
  transformRequest,
  fallback,
  loadingSkeleton,
  animateCameraChanges = true,
  flyToOptions,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [store] = useState(() => new MapStore());
  const [initError, setInitError] = useState<Error | null>(null);
  const [mapLoadedForEffects, setMapLoadedForEffects] = useState(false);
  const hasOnErrorRef = useRef(onError !== undefined);
  const lastCameraRef = useRef<CameraSnapshot>({ center, zoom, pitch, bearing });
  const appliedStyleRef = useRef({ apiKey, layerType });

  // Stable callbacks: handler identity never changes, but the latest version
  // is always invoked. Lets us bind to MapLibre once and not re-bind when
  // the consumer passes new closures.
  const stableOnLoad = useEvent(onLoad);
  const stableOnClick = useEvent(onClick);
  const stableOnContextMenu = useEvent(onContextMenu);
  const stableOnMoveEnd = useEvent(onMoveEnd);
  const stableOnZoomEnd = useEvent(onZoomEnd);
  const stableOnIdle = useEvent(onIdle);
  const stableOnError = useEvent(onError);

  useLayoutEffect(() => {
    hasOnErrorRef.current = onError !== undefined;
  }, [onError]);

  const hasApiKey = typeof apiKey === 'string' && apiKey.trim().length > 0;
  const shouldMountMap = hasApiKey && initError === null;

  // Clear init error when the consumer rotates the key or switches layers —
  // a terminal failure will re-trip immediately, so this is safe.
  useEffect(() => {
    setInitError(null);
  }, [apiKey, layerType]);

  // Keep store's semanticZoomThreshold in sync with the prop.
  useEffect(() => {
    store.setSemanticZoomThreshold(semanticZoomThreshold);
  }, [store, semanticZoomThreshold]);

  // Mount / unmount the MapLibre instance.
  useEffect(() => {
    if (!shouldMountMap) return;
    if (!containerRef.current) return;

    const effectiveMaxZoom = Math.min(maxZoom, getVWorldMaxZoom(layerType));

    let map: MapLibreMap;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: getVWorldStyle(apiKey, layerType),
        center,
        zoom,
        pitch,
        bearing,
        minZoom,
        maxZoom: effectiveMaxZoom,
        maxBounds,
        transformRequest,
      });
    } catch (err) {
      setInitError(err instanceof Error ? err : new Error(String(err)));
      return;
    }

    setMapLoadedForEffects(false);
    appliedStyleRef.current = { apiKey, layerType };
    store.setMap(map);
    store.setZoom(map.getZoom());

    if (navigation) {
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    }
    if (geolocate) {
      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        }),
        'top-right',
      );
    }
    if (scale) {
      map.addControl(
        new maplibregl.ScaleControl({ maxWidth: 150, unit: 'metric' }),
        'bottom-right',
      );
    }

    const handleLoad = () => {
      store.setLoaded(true);
      store.setZoom(map.getZoom());
      setMapLoadedForEffects(true);
      stableOnLoad(map);
    };
    const handleZoomEnd = (event: maplibregl.MapLibreEvent) => {
      store.setZoom(map.getZoom());
      stableOnZoomEnd(event);
    };
    const handleMoveEnd = (event: maplibregl.MapLibreEvent) => {
      stableOnMoveEnd(event);
    };
    const handleIdle = (event: maplibregl.MapLibreEvent) => {
      stableOnIdle(event);
    };
    const handleClick = (event: maplibregl.MapMouseEvent) => {
      stableOnClick(event);
    };
    const handleContextMenu = (event: maplibregl.MapMouseEvent) => {
      stableOnContextMenu(event);
    };
    const handleError = (event: maplibregl.ErrorEvent) => {
      if (hasOnErrorRef.current) {
        stableOnError(event);
      } else {
        const url = extractErrorUrl(event);
        const redacted = url ? redactVWorldUrl(url) : '';
        const message =
          (event as { error?: { message?: string } }).error?.message ?? 'unknown error';
        // eslint-disable-next-line no-console
        console.warn(`[VWorldMap] ${message}`, redacted);
      }
    };

    map.on('load', handleLoad);
    map.on('zoomend', handleZoomEnd);
    map.on('moveend', handleMoveEnd);
    map.on('idle', handleIdle);
    map.on('click', handleClick);
    map.on('contextmenu', handleContextMenu);
    map.on('error', handleError);

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => map.resize())
        : null;
    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver?.disconnect();
      map.off('load', handleLoad);
      map.off('zoomend', handleZoomEnd);
      map.off('moveend', handleMoveEnd);
      map.off('idle', handleIdle);
      map.off('click', handleClick);
      map.off('contextmenu', handleContextMenu);
      map.off('error', handleError);
      map.remove();
      setMapLoadedForEffects(false);
      store.setMap(null);
    };
    // The map is mount-only; subsequent prop changes are applied via the
    // dedicated effects below. Listing every option here would force a full
    // re-mount on every prop change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldMountMap]);

  // Apply style changes (apiKey / layerType) to the existing map.
  useEffect(() => {
    const map = store.getSnapshot().map;
    if (!map) return;
    if (!mapLoadedForEffects) return;
    if (
      appliedStyleRef.current.apiKey === apiKey &&
      appliedStyleRef.current.layerType === layerType
    ) {
      return;
    }
    map.setStyle(getVWorldStyle(apiKey, layerType));
    appliedStyleRef.current = { apiKey, layerType };
  }, [apiKey, layerType, mapLoadedForEffects, store]);

  // Apply camera changes. Skip if the map is currently moving from a user
  // gesture so we do not interrupt them.
  useEffect(() => {
    const map = store.getSnapshot().map;
    if (!map) return;
    if (!mapLoadedForEffects) return;
    if (map.isMoving() || map.isEasing()) return;

    const nextCamera = { center, zoom, pitch, bearing };
    if (sameCamera(lastCameraRef.current, nextCamera)) return;

    if (animateCameraChanges) {
      map.flyTo({ ...flyToOptions, ...nextCamera });
    } else {
      map.jumpTo(nextCamera);
    }
    lastCameraRef.current = nextCamera;
    // We intentionally exclude `flyToOptions` from deps — passing a fresh
    // object every render would re-animate on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], zoom, pitch, bearing, animateCameraChanges, mapLoadedForEffects, store]);

  // Apply min/max zoom and bounds.
  useEffect(() => {
    const map = store.getSnapshot().map;
    if (!map) return;
    map.setMinZoom(minZoom);
    map.setMaxZoom(Math.min(maxZoom, getVWorldMaxZoom(layerType)));
    map.setMaxBounds(maxBounds);
  }, [minZoom, maxZoom, layerType, maxBounds, store]);

  const fallbackInfo: VWorldMapFallbackInfo | null = !hasApiKey
    ? { reason: 'missing-api-key' }
    : initError
      ? { reason: 'map-init-error', error: initError }
      : null;

  return (
    <MapStoreContext.Provider value={store}>
      {fallbackInfo ? (
        renderFallback(fallback, fallbackInfo)
      ) : (
        <>
          <div
            ref={containerRef}
            className={className}
            style={style}
            data-testid="vworld-map-container"
          />
          <MapChildren loadingSkeleton={loadingSkeleton}>{children}</MapChildren>
        </>
      )}
    </MapStoreContext.Provider>
  );
};

/**
 * Gates children mounting on the `loaded` slice of the store. Renders the
 * skeleton (if any) until then.
 */
const MapChildren: React.FC<{
  children: React.ReactNode;
  loadingSkeleton: React.ReactNode;
}> = ({ children, loadingSkeleton }) => {
  const loaded = useMapLoaded();
  return <>{loaded ? children : loadingSkeleton}</>;
};
