import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getVWorldMaxZoom, getVWorldStyle, redactVWorldUrl, VWorldLayerType } from '../vworld';

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
 * Volatile context: the current map zoom level, updated on every `zoomend`.
 * Kept separate so that semantic-zoom-aware markers can subscribe without
 * forcing the entire marker tree to re-render on zoom.
 */
const MapInstanceContext = createContext<MapInstanceContextType>({ map: null });
const MapZoomContext = createContext<number>(12);

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
export const useMap = () => useContext(MapInstanceContext);

/**
 * Returns the current map zoom level. Re-renders the consumer on `zoomend`.
 * Useful for semantic zooming (e.g. degrading marker quality at low zooms).
 */
export const useMapZoom = () => useContext(MapZoomContext);

/**
 * Returns the merged shape `{ map, zoom, semanticZoomThreshold }`. Consumes
 * BOTH contexts and therefore re-renders on every `zoomend`. Use only when
 * the component genuinely needs zoom — otherwise prefer `useMap()`.
 */
export const useMapContext = () => {
  const instance = useContext(MapInstanceContext);
  const zoom = useContext(MapZoomContext);
  return { ...instance, zoom };
};

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
  // (tile loader vs style loader vs ajax helper). Check the common paths.
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
 * The base map component that initializes MapLibre GL JS with VWorld maps.
 * It provides a MapContext to all child components.
 *
 * @example
 * <VWorldMap apiKey="YOUR_KEY">
 *   <Marker lngLat={[127.0, 37.0]} />
 * </VWorldMap>
 */
export const VWorldMap: React.FC<VWorldMapProps> = ({
  apiKey,
  layerType = 'Base',
  center = [127.024612, 37.532600], // Default center (Seoul)
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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [initError, setInitError] = useState<Error | null>(null);

  // Stable refs for handlers so prop changes don't tear down the map.
  // Collapsed into a single effect — three writes are cheaper than three
  // useEffect bookkeeping entries, and the refs are read together at click /
  // error time anyway.
  const onMapClickRef = useRef(onMapClick);
  const onMapErrorRef = useRef(onMapError);
  const tileErrorThresholdRef = useRef(tileErrorThreshold);
  useEffect(() => {
    onMapClickRef.current = onMapClick;
    onMapErrorRef.current = onMapError;
    tileErrorThresholdRef.current = tileErrorThreshold;
  }, [onMapClick, onMapError, tileErrorThreshold]);

  const hasApiKey = typeof apiKey === 'string' && apiKey.trim().length > 0;
  const shouldMountMap = hasApiKey && initError === null;

  // Give the map another shot when the consumer rotates the key or switches
  // layers. A terminal failure (e.g. no WebGL) will re-trip immediately, so
  // this is safe — at worst it costs one re-render. Without this, a brief
  // misconfiguration sticks the component in fallback until full remount.
  useEffect(() => {
    setInitError(null);
  }, [apiKey, layerType]);

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
      map.addControl(
        new maplibregl.ScaleControl({
          maxWidth: 150,
          unit: 'metric',
        }),
        'bottom-right'
      );
    }

    const handleLoad = () => {
      setMapLoaded(true);
      setCurrentZoom(map.getZoom());
      if (onMapLoad) {
        onMapLoad(map);
      }
    };
    const handleZoomEnd = () => {
      setCurrentZoom(map.getZoom());
    };
    const handleClick = (e: maplibregl.MapMouseEvent) => {
      onMapClickRef.current?.(e);
    };
    let errorCount = 0;
    const handleError = (event: maplibregl.ErrorEvent) => {
      errorCount += 1;
      const threshold = tileErrorThresholdRef.current;
      const thresholdReached =
        Number.isFinite(threshold) && errorCount === threshold;
      const url = extractErrorUrl(event);
      const redactedUrl = url ? redactVWorldUrl(url) : undefined;
      const handler = onMapErrorRef.current;
      if (handler) {
        handler({ event, count: errorCount, thresholdReached, redactedUrl });
      } else {
        // Default: log without leaking the API key. Throttle the message at
        // the threshold so consumers still notice sustained failure.
        const message =
          (event as unknown as { error?: { message?: string } }).error?.message ??
          'unknown error';
        if (thresholdReached) {
          console.warn(
            `[VWorldMap] map error count reached ${errorCount}: ${message}`,
            redactedUrl ?? ''
          );
        } else if (errorCount === 1) {
          console.warn(`[VWorldMap] map error: ${message}`, redactedUrl ?? '');
        }
      }
    };

    map.on('load', handleLoad);
    map.on('zoomend', handleZoomEnd);
    map.on('click', handleClick);
    map.on('error', handleError);

    // Handle resize for mobile responsiveness
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.off('load', handleLoad);
      map.off('zoomend', handleZoomEnd);
      map.off('click', handleClick);
      map.off('error', handleError);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldMountMap]); // Initialize only once per mount session

  // Update style when layerType or apiKey changes
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      mapRef.current.setStyle(getVWorldStyle(apiKey, layerType));
    }
  }, [apiKey, layerType, mapLoaded]);

  // Update center and zoom
  const prevCenter = useRef(center);
  const prevZoom = useRef(zoom);

  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      const centerChanged = center && (!prevCenter.current || prevCenter.current[0] !== center[0] || prevCenter.current[1] !== center[1]);
      const zoomChanged = zoom !== undefined && prevZoom.current !== zoom;

      if (centerChanged || zoomChanged) {
        if (animateCameraChanges) {
          mapRef.current.flyTo({ center, zoom });
        } else {
          mapRef.current.jumpTo({ center, zoom });
        }
      }

      prevCenter.current = center;
      prevZoom.current = zoom;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, zoom, animateCameraChanges]);

  // Update minZoom, maxZoom, and maxBounds dynamically
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      if (minZoom !== undefined) mapRef.current.setMinZoom(minZoom);
      if (maxZoom !== undefined) mapRef.current.setMaxZoom(Math.min(maxZoom, getVWorldMaxZoom(layerType)));
      if (maxBounds !== undefined) mapRef.current.setMaxBounds(maxBounds);
    }
  }, [layerType, minZoom, maxZoom, maxBounds, mapLoaded]);

  // Compute fallback info from current state.
  const fallbackInfo: VWorldMapFallbackInfo | null = !hasApiKey
    ? { reason: 'missing-api-key' }
    : initError
    ? { reason: 'map-init-error', error: initError }
    : null;

  // Memoize the stable instance context so parent re-renders don't churn
  // every consumer. `mapRef.current` flips from null to a real instance once
  // `mapLoaded` becomes true, and stays stable afterwards — so we depend on
  // mapLoaded (a state proxy for "mapRef is populated") plus the threshold
  // prop. Zoom changes do NOT rebuild this object.
  const mapInstanceValue = useMemo<MapInstanceContextType>(
    () => ({ map: mapRef.current, semanticZoomThreshold }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapLoaded, semanticZoomThreshold]
  );

  return (
    <MapInstanceContext.Provider value={mapInstanceValue}>
      <MapZoomContext.Provider value={currentZoom}>
        {fallbackInfo ? (
          renderFallback(fallback, fallbackInfo)
        ) : (
          <>
            <div ref={mapContainerRef} className={className} style={style} data-testid="vworld-map-container" />
            {!mapLoaded && loadingSkeleton}
            {mapLoaded && children}
          </>
        )}
      </MapZoomContext.Provider>
    </MapInstanceContext.Provider>
  );
};
