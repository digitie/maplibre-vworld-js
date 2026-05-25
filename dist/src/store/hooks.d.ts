import { Map as MapLibreMap } from 'maplibre-gl';
import { MapStore, MapStoreSnapshot } from './mapStore';
/**
 * Context that carries the per-mount {@link MapStore} instance. Internal —
 * consumers should use the exported hooks rather than reading this directly.
 */
export declare const MapStoreContext: import('react').Context<MapStore | null>;
/**
 * Returns the MapLibre instance, or `null` until the map mounts.
 *
 * Re-renders the consumer **only** when the instance identity changes
 * (mount/unmount). Camera changes do not trigger a re-render.
 */
export declare function useMap(): MapLibreMap | null;
/**
 * Returns the current zoom level. Re-renders on `zoomend`.
 *
 * For zoom-threshold tests (e.g. "simplify when zoom < 10"), prefer
 * {@link useMapSelector} with a boolean selector — that only re-renders when
 * the boolean flips, not on every zoom change.
 */
export declare function useMapZoom(): number;
/**
 * Returns `true` once the map has fired its `load` event.
 */
export declare function useMapLoaded(): boolean;
/**
 * Subscribe to a derived slice of map state with referential-equality
 * caching. The consumer re-renders only when the selected value changes.
 *
 * The selector is wrapped through a ref so identity changes do not force
 * `useSyncExternalStore` to re-subscribe — passing a fresh arrow function
 * on every render is safe. Returned values are stabilized with `Object.is`
 * so unchanged primitives / referentially-stable objects do not cascade
 * re-renders.
 *
 * @example
 * const isSimplified = useMapSelector(
 *   (s) => s.zoom < (threshold ?? s.semanticZoomThreshold ?? 0)
 * );
 */
export declare function useMapSelector<T>(selector: (snapshot: MapStoreSnapshot) => T): T;
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
export declare function useEvent<T extends (...args: never[]) => unknown>(handler: T | undefined): T;
