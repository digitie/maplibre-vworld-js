import { Map as MapLibreMap } from 'maplibre-gl';
/**
 * Immutable snapshot of the map's reactive state. New instance is created
 * on every mutation, so consumers can use `Object.is` to detect changes.
 */
export interface MapStoreSnapshot {
    /** The MapLibre instance. `null` before mount, until `load` fires. */
    map: MapLibreMap | null;
    /** True once MapLibre has fired its `load` event. */
    mapLoaded: boolean;
    /** Current zoom level, updated on every `zoomend`. */
    zoom: number;
    /** Global threshold for semantic-zoom-aware markers. */
    semanticZoomThreshold: number | undefined;
}
/**
 * Tiny store that holds the map's mutable state outside React.
 *
 * Consumers subscribe via {@link useSyncExternalStore} with a selector, so
 * each marker only re-renders when its specific slice of state changes —
 * not on every `zoomend`. This is the canonical React 18+ pattern for
 * high-frequency external state (see Zustand, TanStack Query).
 *
 * The class is intentionally not exported from the package surface; consumers
 * interact with it exclusively through the {@link useMap}, {@link useMapZoom},
 * and {@link useMapSelector} hooks.
 */
export declare class MapStore {
    private snapshot;
    private listeners;
    constructor(initial?: Partial<MapStoreSnapshot>);
    /** Subscribe to ANY snapshot change. Returns an unsubscribe function. */
    readonly subscribe: (listener: () => void) => (() => void);
    /** Current snapshot. Reference is stable until a setter mutates it. */
    readonly getSnapshot: () => MapStoreSnapshot;
    setMap(map: MapLibreMap | null): void;
    setMapLoaded(loaded: boolean): void;
    setZoom(zoom: number): void;
    setSemanticZoomThreshold(threshold: number | undefined): void;
    private emit;
}
