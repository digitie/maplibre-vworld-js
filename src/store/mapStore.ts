'use client';

import type { Map as MapLibreMap } from 'maplibre-gl';

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
export class MapStore {
  private snapshot: MapStoreSnapshot;
  private listeners = new Set<() => void>();

  constructor(initial: Partial<MapStoreSnapshot> = {}) {
    this.snapshot = {
      map: null,
      mapLoaded: false,
      zoom: 12,
      semanticZoomThreshold: undefined,
      ...initial,
    };
  }

  /** Subscribe to ANY snapshot change. Returns an unsubscribe function. */
  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /** Current snapshot. Reference is stable until a setter mutates it. */
  readonly getSnapshot = (): MapStoreSnapshot => this.snapshot;

  setMap(map: MapLibreMap | null): void {
    if (this.snapshot.map === map) return;
    this.snapshot = { ...this.snapshot, map };
    this.emit();
  }

  setMapLoaded(loaded: boolean): void {
    if (this.snapshot.mapLoaded === loaded) return;
    this.snapshot = { ...this.snapshot, mapLoaded: loaded };
    this.emit();
  }

  setZoom(zoom: number): void {
    if (this.snapshot.zoom === zoom) return;
    this.snapshot = { ...this.snapshot, zoom };
    this.emit();
  }

  setSemanticZoomThreshold(threshold: number | undefined): void {
    if (this.snapshot.semanticZoomThreshold === threshold) return;
    this.snapshot = { ...this.snapshot, semanticZoomThreshold: threshold };
    this.emit();
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}
