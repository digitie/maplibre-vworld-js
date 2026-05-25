import { Map as MapLibreMap } from 'maplibre-gl';
/**
 * Snapshot of map state exposed to React via {@link useSyncExternalStore}.
 *
 * The store is a vanilla JS event emitter — it lives outside React's render
 * cycle so map events do not force the entire component tree to re-render.
 * Components opt in to the slice they need through {@link useMap},
 * {@link useMapZoom}, or {@link useMapSelector}.
 */
export interface MapStoreSnapshot {
    /** The MapLibre instance, or `null` before mount / after unmount. */
    map: MapLibreMap | null;
    /** Whether the map has emitted its `load` event. */
    loaded: boolean;
    /** Current zoom level. Updates on `zoomend`. */
    zoom: number;
    /** Optional global semantic zoom threshold for marker simplification. */
    semanticZoomThreshold: number | undefined;
}
/**
 * External store for map state. Use through the hooks in `./hooks`; consumers
 * should not touch the store directly.
 */
export declare class MapStore {
    private snapshot;
    private listeners;
    readonly subscribe: (listener: () => void) => (() => void);
    readonly getSnapshot: () => MapStoreSnapshot;
    setMap(map: MapLibreMap | null): void;
    setLoaded(loaded: boolean): void;
    setZoom(zoom: number): void;
    setSemanticZoomThreshold(threshold: number | undefined): void;
    private emit;
}
