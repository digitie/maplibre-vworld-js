# AI agent guide: maplibre-vworld-js

Context for AI coding assistants generating code that consumes this library.

## What this library is

- React (18+) bindings for MapLibre GL JS v5, configured for Korea's VWorld basemap tiles.
- Map primitives only: markers, popups, layers, clustering, region-bounded zod schemas.
- **Not** a place to add application concerns: data fetching, state management, audit logs, server APIs, business categories, design palettes, etc. Keep those in the consuming app.

## Architecture rules

- Every DOM-touching module carries `'use client'`. Safe to import from Next.js App Router server components — the directive moves the work to the client bundle. There is no need to `next/dynamic({ ssr: false })` wrap.
- The map exposes state via an external store (`MapStore` + `useSyncExternalStore`). Children subscribe only to the slice they need; camera changes do not force a global re-render.
- Event handlers go through `useEvent` internally so prop callbacks can change freely without re-creating the MapLibre instance or re-binding listeners.
- `dist/` is committed for GitHub-dep consumers. `tsconfig.build.json` restricts declaration emission to `src/` so `dev/` and `test/` type errors do not leak into the package.
- Push to `main` only via PR. CI runs type-check + test + build + `git diff --exit-code dist/`.

## Component surface

### `<VWorldMap>`

```ts
interface VWorldMapProps {
  apiKey: string;                       // required
  center: [number, number];             // required, [lng, lat]
  zoom?: number;                        // default 12
  pitch?: number;
  bearing?: number;
  layerType?: 'Base' | 'gray' | 'midnight' | 'Hybrid' | 'Satellite';
  minZoom?: number; maxZoom?: number;
  maxBounds?: maplibregl.LngLatBoundsLike;
  semanticZoomThreshold?: number;
  navigation?: boolean; geolocate?: boolean; scale?: boolean;
  onLoad?: (map) => void;
  onClick?: (MapMouseEvent) => void;
  onContextMenu?: (MapMouseEvent) => void;
  onMoveEnd?: (MapLibreEvent) => void;
  onZoomEnd?: (MapLibreEvent) => void;
  onIdle?: (MapLibreEvent) => void;
  onError?: (ErrorEvent) => void;
  transformRequest?: maplibregl.RequestTransformFunction;
  fallback?: ReactNode | ((info: { reason: 'missing-api-key' | 'map-init-error'; error?: Error }) => ReactNode);
  loadingSkeleton?: ReactNode;
  animateCameraChanges?: boolean;       // default true
  flyToOptions?: Omit<FlyToOptions, 'center' | 'zoom' | 'pitch' | 'bearing'>;
}
```

Rules for AI:
- **No implicit center.** `center` is required. Pick a sensible value for the app.
- Event callbacks receive **raw** MapLibre events. No `VWorldMap*Info` envelope.
- Camera prop changes (`center`, `zoom`, `pitch`, `bearing`) are applied with `flyTo` (animated) or `jumpTo` (instant) and skip when the user is mid-gesture (`map.isMoving()`).
- `Satellite`/`Hybrid` cap at z18; `Base`/`gray`/`midnight` cap at z19. The component clamps automatically — don't pass `maxZoom` higher than `getVWorldMaxZoom(layerType)`.
- For CORS / proxy needs, use `transformRequest`. Don't fork the library to add headers.

### Hooks (`maplibre-vworld`)

```ts
useMap(): MapLibreMap | null         // stable; only re-renders on mount/unmount
useMapZoom(): number                 // re-renders on zoomend
useMapLoaded(): boolean
useMapSelector(selector): T          // arbitrary slice with referential caching
useEvent(handler): T                 // stable callback that calls latest
```

Use `useMapSelector` for threshold tests (`zoom < N`) — the consumer re-renders only when the boolean flips, not on every zoom step.

### Markers

`Marker`, `PinMarker`, `MakiMarker`, `PulsingMarker`, `SimpleMarker`, `PlaceMarker`, `PriceMarker`, `WeatherMarker`, `RoutePointMarker`, `ClusterMarker`.

State props common to most markers: `selected`, `highlighted`, `zIndex`, `ariaLabel`, `className`. The DOM exposes `data-selected` / `data-highlighted` attributes.

`MakiMarker`: a single `icon: string` prop (e.g. `'restaurant'`, `'park'`). No `iconName`/`fallbackIcon` aliases.

### Layers

- `RouteLine` — polyline; `coordinates: [number, number][]`, `color`, `width`, `dashArray`. Memoize the `coordinates` array.
- `PolygonArea` — fill+line for Polygon/MultiPolygon GeoJSON.
- `ClusterLayer` — client-side clustering via `supercluster`.
- `ServerClusterLayer` — server-grouped clusters; `cluster.bounds` triggers `fitBounds`, else `flyTo`.

### Popup

```tsx
<Popup lngLat={[lng, lat]} onClose={…}>{children}</Popup>
```

### Schemas

```ts
LngLatSchema, BoundsSchema, PointSchema, RouteCoordinatesSchema
makeBoundedLngLatSchema(lngRange, latRange)
makeBoundedBoundsSchema(lngRange, latRange)
extendPointSchema({ … })
formatLngLat(lngLat, precision)
serializeBounds(bounds, precision)
parseBoundsParam(string)
```

No Korea-only constants live in the core. If you need a Korean preset, build it locally:

```ts
const KoreaLngLat = makeBoundedLngLatSchema([124, 132], [33, 43]);
```

### VWorld utilities

```ts
getVWorldTileUrl(apiKey, layerType)   // WMTS URL template with {z}/{y}/{x}
getVWorldStyle(apiKey, layerType)     // MapLibre StyleSpecification
getVWorldMaxZoom(layerType)           // 18 (Sat/Hybrid) or 19
redactVWorldUrl(url)                  // mask the API key segment for logs
isVWorldTileError(errorEvent)         // tile-vs-style classifier
```

## Things to avoid

- Don't import from `./components/VWorldMap` for hooks — use the package root or `./store/hooks`.
- Don't inline complex objects in props that get diffed (`coordinates`, GeoJSON `data`, `flyToOptions`). Either memoize or store in a ref.
- Don't add domain-specific code (TripMate, kraddr, etc.) to this repo. The library should stay generic.
- Don't call `map.setTerrain()` against VWorld — VWorld does not serve Terrain-RGB.
- Don't use `'use client' { ssr: false }` dynamic imports unless the consumer has a specific reason — the library is already SSR-safe.

## Push policy

Branch + PR only. `main` is protected — never direct-push, never `--no-verify`.
