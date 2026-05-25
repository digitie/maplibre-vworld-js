'use client';

import { createContext, useCallback, useContext, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { MapStore, MapStoreSnapshot } from './mapStore';

const MapStoreContext = createContext<MapStore | null>(null);

/** @internal — providers only */
export const MapStoreProvider = MapStoreContext.Provider;

function useStore(): MapStore {
  const store = useContext(MapStoreContext);
  if (!store) {
    throw new Error(
      '[maplibre-vworld] hook used outside <VWorldMap>. Wrap your map-dependent components in <VWorldMap>.'
    );
  }
  return store;
}

/**
 * Returns the MapLibre instance. Subscribes via {@link useSyncExternalStore}
 * so consumers re-render ONLY when the map handle itself changes (mount /
 * unmount / style replace). Camera changes, zoom, etc. do NOT trigger
 * re-renders here.
 */
export function useMap(): MapLibreMap | null {
  const store = useStore();
  return useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot().map,
    () => null
  );
}

/**
 * Returns the current map zoom level. Re-renders the consumer on every
 * `zoomend` (semantic zoom thresholds use {@link useMapSelector} instead
 * to avoid that).
 */
export function useMapZoom(): number {
  const store = useStore();
  return useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot().zoom,
    () => 12
  );
}

/**
 * Returns true once the map has fired its `load` event. Useful for gating
 * source/layer registration. Re-renders only when the loaded state flips.
 */
export function useMapLoaded(): boolean {
  const store = useStore();
  return useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot().mapLoaded,
    () => false
  );
}

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
export function useMapSelector<T>(selector: (snapshot: MapStoreSnapshot) => T): T {
  const store = useStore();
  // The selector identity drives the cached getSnapshot; wrap in useCallback
  // upstream for hot paths. React handles equality with `Object.is`.
  const getSelected = useCallback(() => selector(store.getSnapshot()), [selector, store]);
  return useSyncExternalStore(store.subscribe, getSelected, getSelected);
}

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
export function useStableCallback<T extends (...args: never[]) => unknown>(
  handler: T | undefined
): T {
  const ref = useRef(handler);
  // useLayoutEffect runs before any event handlers fire after commit.
  useLayoutEffect(() => {
    ref.current = handler;
  });
  return useCallback(
    ((...args: Parameters<T>) => ref.current?.(...args)) as T,
    []
  );
}
