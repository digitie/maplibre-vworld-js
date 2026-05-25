import { Map as MapLibreMap } from 'maplibre-gl';
import { MapStore, MapStoreSnapshot } from './mapStore';
/** @internal — providers only */
export declare const MapStoreProvider: import('react').Provider<MapStore | null>;
/**
 * Returns the MapLibre instance. Subscribes via {@link useSyncExternalStore}
 * so consumers re-render ONLY when the map handle itself changes (mount /
 * unmount / style replace). Camera changes, zoom, etc. do NOT trigger
 * re-renders here.
 */
export declare function useMap(): MapLibreMap | null;
/**
 * Returns the current map zoom level. Re-renders the consumer on every
 * `zoomend` (semantic zoom thresholds use {@link useMapSelector} instead
 * to avoid that).
 */
export declare function useMapZoom(): number;
/**
 * Returns true once the map has fired its `load` event. Useful for gating
 * source/layer registration. Re-renders only when the loaded state flips.
 */
export declare function useMapLoaded(): boolean;
/**
 * Subscribe to a derived slice of map state. The consumer re-renders only
 * when the SELECTOR's return value changes (compared with `Object.is`).
 *
 * This is the high-performance primitive — markers that only care about
 * "am I above zoom 12?" should select that boolean directly, so 60 zoom
 * events per drag turn into 0 re-renders unless the threshold is crossed.
 *
 * @example
 *   const isHighZoom = useMapSelector(s => s.zoom >= 12);
 *   // Re-renders only when crossing zoom 12, not on every zoomend.
 *
 * @example
 *   // Stable selector for hot paths — wrap in useCallback so the
 *   // subscription doesn't re-create per render.
 *   const shouldSimplify = useMapSelector(
 *     useCallback(s => s.zoom < (myThreshold ?? s.semanticZoomThreshold ?? 0), [myThreshold])
 *   );
 */
export declare function useMapSelector<T>(selector: (snapshot: MapStoreSnapshot) => T): T;
/**
 * Stable callback wrapper (the "useEvent" pattern). Returns a function whose
 * identity NEVER changes, but whose body always uses the latest `handler`.
 *
 * Lets us register event listeners with MapLibre ONCE per mount, while still
 * picking up prop changes without tearing down the map. This is the pattern
 * React Hook docs now recommend; once `useEffectEvent` ships in stable React,
 * we can swap this trivially.
 *
 * @internal — exposed for advanced use only.
 */
export declare function useStableCallback<T extends (...args: never[]) => unknown>(handler: T | undefined): T;
