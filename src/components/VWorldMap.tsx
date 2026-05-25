'use client';

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getVWorldMaxZoom, getVWorldStyle, redactVWorldUrl, VWorldLayerType } from '../vworld';
import { MapStore } from '../store/mapStore';
import { MapStoreProvider, useStableCallback } from '../store/hooks';

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

function renderFallback(
  fallback: VWorldMapProps['fallback'],
  info: VWorldMapFallbackInfo
): React.ReactNode {
  if (fallback === undefined) return null;
  if (typeof fallback === 'function') return fallback(info);
  return fallback;
}

function extractErrorUrl(event: maplibregl.ErrorEvent): string | undefined {
  // MapLibre attaches the failing URL on different shapes depending on origin
  // (tile loader vs style loader vs ajax helper). Try the common paths.
  const candidates: unknown[] = [
    (event as unknown as { error?: { url?: unknown } }).error?.url,
    (event as unknown as { url?: unknown }).url,
    (event as unknown as { source?: { tiles?: unknown[] } }).source?.tiles?.[0],
  ];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.length > 0) return candidate;
  }
  return undefined;
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
export const VWorldMap: React.FC<VWorldMapProps> = ({
  apiKey,
  layerType = 'Base',
  center = [127.024612, 37.532600],
  zoom = 12,
  minZoom = 6,
  maxZoom = 19,
  maxBounds,
  semanticZoomThreshold,
  showNavigationControl = true,
  showGeolocateControl = true,
  showScaleControl = true,
  className = '',
  style = { width: '100%', height: '100%' },
  children,
  onMapLoad,
  onMapClick,
  onMapError,
  tileErrorThreshold = Infinity,
  transformRequest,
  fallback,
  loadingSkeleton,
  animateCameraChanges = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [initError, setInitError] = useState<Error | null>(null);

  // ────────────────────────────────────────────────────────────────────────
  // Map store — created once, lives outside React reconciliation.
  // ────────────────────────────────────────────────────────────────────────
  const storeRef = useRef<MapStore | null>(null);
  if (storeRef.current === null) {
    storeRef.current = new MapStore({
      zoom,
      semanticZoomThreshold,
    });
  }
  const store = storeRef.current;

  // Push semanticZoomThreshold prop changes into the store. Cheap no-op when
  // unchanged thanks to the store's internal equality check.
  useEffect(() => {
    store.setSemanticZoomThreshold(semanticZoomThreshold);
  }, [store, semanticZoomThreshold]);

  // ────────────────────────────────────────────────────────────────────────
  // Stable callbacks — handler identity is fixed for the lifetime of the
  // component, but the body always uses the latest prop value. This is what
  // lets us register MapLibre listeners ONCE per mount without ever needing
  // to re-attach when consumer callbacks change.
  // ────────────────────────────────────────────────────────────────────────
  const stableMapClick = useStableCallback(onMapClick);
  const stableMapError = useStableCallback(onMapError);
  const stableMapLoad = useStableCallback(onMapLoad);
  // tileErrorThreshold is a number, not a callback — but we need the latest
  // value inside the error handler. Use a ref + sync in a layout effect.
  const tileErrorThresholdRef = useRef(tileErrorThreshold);
  useEffect(() => {
    tileErrorThresholdRef.current = tileErrorThreshold;
  }, [tileErrorThreshold]);

  const hasApiKey = typeof apiKey === 'string' && apiKey.trim().length > 0;
  const shouldMountMap = hasApiKey && initError === null;

  // Clear init error on key/layer rotation so the consumer can recover from
  // a transient misconfig without forcing a remount.
  useEffect(() => {
    setInitError(null);
  }, [apiKey, layerType]);

  // ────────────────────────────────────────────────────────────────────────
  // Map lifecycle — mount once per (apiKey × layerType × initError-cleared)
  // window. Lying about deps on purpose: the rest of the props are applied
  // via separate effects (style, camera, bounds) so the map is never torn
  // down for trivial changes.
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!shouldMountMap) return;
    if (!mapContainerRef.current) return;

    const effectiveMaxZoom = Math.min(maxZoom, getVWorldMaxZoom(layerType));

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: getVWorldStyle(apiKey, layerType),
        center,
        zoom,
        minZoom,
        maxZoom: effectiveMaxZoom,
        maxBounds,
        transformRequest,
      });
    } catch (err) {
      setInitError(err instanceof Error ? err : new Error(String(err)));
      return;
    }

    mapRef.current = map;
    store.setMap(map);

    if (showNavigationControl) {
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    }
    if (showGeolocateControl) {
      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        }),
        'top-right'
      );
    }
    if (showScaleControl) {
      map.addControl(new maplibregl.ScaleControl({ maxWidth: 150, unit: 'metric' }), 'bottom-right');
    }

    const handleLoad = () => {
      store.setMapLoaded(true);
      store.setZoom(map.getZoom());
      stableMapLoad(map);
    };
    const handleZoomEnd = () => {
      store.setZoom(map.getZoom());
    };
    const handleClick = (e: maplibregl.MapMouseEvent) => {
      stableMapClick(e);
    };
    let errorCount = 0;
    const handleError = (event: maplibregl.ErrorEvent) => {
      errorCount += 1;
      const threshold = tileErrorThresholdRef.current;
      const thresholdReached = Number.isFinite(threshold) && errorCount === threshold;
      const url = extractErrorUrl(event);
      const redactedUrl = url ? redactVWorldUrl(url) : undefined;
      // Empty-by-default useStableCallback returns a no-op when no handler
      // is provided. So we can't tell "no handler" from "handler present" via
      // identity. Use the prop directly via a ref-style probe — onMapError is
      // captured at this useEffect's lifetime; for "default behavior when
      // unset" we check the latest user handler via stableMapError, which is
      // a no-op for undefined inputs.
      if (onMapError) {
        stableMapError({ event, count: errorCount, thresholdReached, redactedUrl });
      } else {
        const message =
          (event as unknown as { error?: { message?: string } }).error?.message ?? 'unknown error';
        if (thresholdReached) {
          console.warn(`[VWorldMap] error count reached ${errorCount}: ${message}`, redactedUrl ?? '');
        } else if (errorCount === 1) {
          console.warn(`[VWorldMap] map error: ${message}`, redactedUrl ?? '');
        }
      }
    };

    map.on('load', handleLoad);
    map.on('zoomend', handleZoomEnd);
    map.on('click', handleClick);
    map.on('error', handleError);

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.off('load', handleLoad);
      map.off('zoomend', handleZoomEnd);
      map.off('click', handleClick);
      map.off('error', handleError);
      map.remove();
      mapRef.current = null;
      store.setMap(null);
      store.setMapLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldMountMap]);

  // ────────────────────────────────────────────────────────────────────────
  // Style switch — much cheaper than remounting the map.
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !shouldMountMap) return;
    map.setStyle(getVWorldStyle(apiKey, layerType));
  }, [apiKey, layerType, shouldMountMap]);

  // ────────────────────────────────────────────────────────────────────────
  // Camera updates with prev-value gating, so inline array props from the
  // consumer ([127, 37] re-created each render) don't trigger flyTo unless
  // the actual coordinates changed.
  // ────────────────────────────────────────────────────────────────────────
  const prevCenter = useRef(center);
  const prevZoom = useRef(zoom);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const centerChanged =
      !prevCenter.current ||
      prevCenter.current[0] !== center[0] ||
      prevCenter.current[1] !== center[1];
    const zoomChanged = prevZoom.current !== zoom;
    if (centerChanged || zoomChanged) {
      if (animateCameraChanges) {
        map.flyTo({ center, zoom });
      } else {
        map.jumpTo({ center, zoom });
      }
    }
    prevCenter.current = center;
    prevZoom.current = zoom;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], zoom, animateCameraChanges]);

  // ────────────────────────────────────────────────────────────────────────
  // Bounds / zoom limits — cheap maplibre setters, no remount.
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setMinZoom(minZoom);
    map.setMaxZoom(Math.min(maxZoom, getVWorldMaxZoom(layerType)));
    if (maxBounds !== undefined) map.setMaxBounds(maxBounds);
  }, [layerType, minZoom, maxZoom, maxBounds]);

  // ────────────────────────────────────────────────────────────────────────
  // Render.  Container is always in the tree when a map is mounting, so
  // MapLibre can attach to it.  Fallback replaces the container only when
  // we deliberately won't mount.
  // ────────────────────────────────────────────────────────────────────────
  const fallbackInfo: VWorldMapFallbackInfo | null = !hasApiKey
    ? { reason: 'missing-api-key' }
    : initError
    ? { reason: 'map-init-error', error: initError }
    : null;

  // Subscribe to mapLoaded from our own store for the children gate. We
  // can't call useMapLoaded() here — that hook reads context, and *we* are
  // the provider, so subscribing through context would race the first render.
  const mapLoaded = useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot().mapLoaded,
    () => false
  );

  // The provider value is the store itself — its identity is stable for the
  // lifetime of the component (useRef + first-render init). No memoization
  // needed.
  return (
    <MapStoreProvider value={store}>
      {fallbackInfo ? (
        renderFallback(fallback, fallbackInfo)
      ) : (
        <>
          <div
            ref={mapContainerRef}
            className={className}
            style={style}
            data-testid="vworld-map-container"
          />
          {!mapLoaded && loadingSkeleton}
          {mapLoaded && children}
        </>
      )}
    </MapStoreProvider>
  );
};
