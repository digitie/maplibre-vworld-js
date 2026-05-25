'use client';

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { MapStore, type MapStoreSnapshot } from './mapStore';

/**
 * Context that carries the per-mount {@link MapStore} instance. Internal —
 * consumers should use the exported hooks rather than reading this directly.
 */
export const MapStoreContext = createContext<MapStore | null>(null);

function useStore(): MapStore {
  const store = useContext(MapStoreContext);
  if (!store) {
    throw new Error(
      'useMap / useMapZoom / useMapLoaded / useMapSelector must be used inside <VWorldMap>.'
    );
  }
  return store;
}

const selectMap = (s: MapStoreSnapshot) => s.map;
const selectZoom = (s: MapStoreSnapshot) => s.zoom;
const selectLoaded = (s: MapStoreSnapshot) => s.loaded;

/**
 * Returns the MapLibre instance, or `null` until the map mounts.
 *
 * Re-renders the consumer **only** when the instance identity changes
 * (mount/unmount). Camera changes do not trigger a re-render.
 */
export function useMap(): MapLibreMap | null {
  const store = useStore();
  return useSyncExternalStore(
    store.subscribe,
    () => selectMap(store.getSnapshot()),
    () => null
  );
}

/**
 * Returns the current zoom level. Re-renders on `zoomend`.
 *
 * For zoom-threshold tests (e.g. "simplify when zoom < 10"), prefer
 * {@link useMapSelector} with a boolean selector — that only re-renders when
 * the boolean flips, not on every zoom change.
 */
export function useMapZoom(): number {
  const store = useStore();
  return useSyncExternalStore(
    store.subscribe,
    () => selectZoom(store.getSnapshot()),
    () => 0
  );
}

/**
 * Returns `true` once the map has fired its `load` event.
 */
export function useMapLoaded(): boolean {
  const store = useStore();
  return useSyncExternalStore(
    store.subscribe,
    () => selectLoaded(store.getSnapshot()),
    () => false
  );
}

/**
 * Subscribe to a derived slice of map state with referential-equality
 * caching. The consumer re-renders only when the selected value changes.
 *
 * The selector must be referentially stable (wrap with `useCallback` if it
 * closes over props).
 *
 * @example
 * const isSimplified = useMapSelector(
 *   useCallback((s) => s.zoom < (threshold ?? s.semanticZoomThreshold ?? 0), [threshold])
 * );
 */
export function useMapSelector<T>(selector: (snapshot: MapStoreSnapshot) => T): T {
  const store = useStore();
  const cacheRef = useRef<{
    selector: (snapshot: MapStoreSnapshot) => T;
    snapshot: MapStoreSnapshot;
    value: T;
  } | undefined>(undefined);
  const get = useCallback(() => {
    const snapshot = store.getSnapshot();
    const cached = cacheRef.current;
    if (cached && cached.selector === selector && cached.snapshot === snapshot) {
      return cached.value;
    }
    const nextValue = selector(snapshot);
    if (cached && cached.selector === selector && Object.is(cached.value, nextValue)) {
      cacheRef.current = { selector, snapshot, value: cached.value };
      return cached.value;
    }
    cacheRef.current = { selector, snapshot, value: nextValue };
    return nextValue;
  }, [selector, store]);
  return useSyncExternalStore(store.subscribe, get, get);
}

/**
 * Returns a stable callback that always invokes the latest version of
 * `handler`. Useful for binding event handlers to long-lived resources (like
 * the MapLibre instance) without re-creating the resource on every prop
 * change.
 *
 * Implementation is the canonical `useEvent` pattern: a ref synced inside
 * `useLayoutEffect` so the latest handler is observable before paint, and a
 * stable `useCallback` wrapper.
 */
export function useEvent<T extends (...args: never[]) => unknown>(handler: T | undefined): T {
  const ref = useRef(handler);
  useLayoutEffect(() => {
    ref.current = handler;
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args) => ref.current?.(...args)) as T, []);
}
