<div align="center">
  <img src="https://img.shields.io/badge/MapLibre-0081F2?style=for-the-badge&logo=maplibre&logoColor=white" alt="MapLibre" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/VWorld-Korea-blue?style=for-the-badge" alt="VWorld" />

  <h1>🗺️ maplibre-vworld-js</h1>
  <p><strong>React bindings for MapLibre GL JS rendering Korean VWorld tiles.</strong></p>
</div>

<br />

A small, focused React wrapper around MapLibre GL JS for VWorld basemaps. The library is **just the map primitives** — markers, popups, layers, clustering — and stays out of the way of application concerns like data fetching, state management, and routing.

## Features

- **Native WebGL rendering** via MapLibre GL JS v5 — fractional zoom, vector & raster sources, 60 fps interactions.
- **Declarative React API** — props in, raw MapLibre events out. No two-way binding wrappers.
- **External store** based on `useSyncExternalStore` — children subscribe to the slices they care about, and zoom/pan does **not** re-render the whole tree.
- **Stable callbacks** through a built-in `useEvent` hook — your handlers always run the latest closure without re-mounting MapLibre.
- **Built-in clustering** with `supercluster` — viewport-culled, only visible markers render.
- **SSR-safe** — every DOM-touching module is marked `'use client'`; runs cleanly in Next.js App Router.
- **Zod schemas** with a factory for region-bounded coordinates (Korea preset included).

## Install

```bash
npm install maplibre-vworld maplibre-gl 'zod@^4.4.3'
```

`react`, `react-dom`, `maplibre-gl`, `zod` are peer dependencies.

> The `apiKey` prop is trimmed of surrounding whitespace and URL-encoded automatically. zod v4 is required (v3 is not supported).

## Quick start

```tsx
import { VWorldMap, Marker } from 'maplibre-vworld';
import 'maplibre-vworld/style.css';

export function App() {
  return (
    <VWorldMap apiKey={process.env.VWORLD_API_KEY!} center={[127.024, 37.532]} zoom={12}>
      <Marker lngLat={[127.024, 37.532]} color="#ff0000" />
    </VWorldMap>
  );
}
```

## `<VWorldMap>` props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `apiKey` | `string` | **required** | Empty / whitespace → `fallback` renders, no MapLibre instance. |
| `center` | `[lng, lat]` | **required** | No implicit Seoul default — pick a center appropriate for your app. |
| `zoom` | `number` | `12` | |
| `pitch` / `bearing` | `number` | `0` / `0` | |
| `layerType` | `'Base' \| 'gray' \| 'midnight' \| 'Hybrid' \| 'Satellite'` | `'Base'` | |
| `minZoom` / `maxZoom` | `number` | `6` / `19` | `Satellite`/`Hybrid` are clamped to z18 automatically. |
| `maxBounds` | `LngLatBoundsLike` | — | |
| `navigation` / `geolocate` / `scale` | `boolean` | `true` | Built-in MapLibre controls. |
| `semanticZoomThreshold` | `number` | — | Global zoom below which markers may simplify (`SimpleMarker`, `PlaceMarker`, `WeatherMarker`). |
| `onLoad` | `(map) => void` | — | Fires once after MapLibre `load`. |
| `onClick` | `(MapMouseEvent) => void` | — | Raw MapLibre click — read `e.lngLat.lng/lat`. |
| `onContextMenu` | `(MapMouseEvent) => void` | — | Raw right-click. |
| `onMoveEnd` / `onZoomEnd` / `onIdle` | `(MapLibreEvent) => void` | — | Raw camera events — split so consumers only pay for what they use. |
| `onError` | `(ErrorEvent) => void` | console.warn | Raw MapLibre `error` event. Combine with `isVWorldTileError()` and `redactVWorldUrl()`. |
| `transformRequest` | `RequestTransformFunction` | — | CORS / auth / proxy hook. |
| `fallback` | `ReactNode \| (info) => ReactNode` | — | Rendered instead of the map for `'missing-api-key'` or `'map-init-error'`. |
| `loadingSkeleton` | `ReactNode` | — | Overlay until `load` fires. |
| `animateCameraChanges` | `boolean` | `true` | `false` → camera prop changes use `jumpTo`. |
| `flyToOptions` | `Omit<FlyToOptions, 'center' \| 'zoom' \| 'pitch' \| 'bearing'>` | — | Tune flyTo duration / easing; camera coordinates come from props. |
| `className` / `style` | — | — | Container styling. |

### Event handler example

```tsx
<VWorldMap
  apiKey={key}
  center={[127.024, 37.532]}
  onClick={(e) => setPicked([e.lngLat.lng, e.lngLat.lat])}
  onError={(e) => {
    if (isVWorldTileError(e)) {
      const url = (e.error as VWorldResourceError)?.url;
      logger.warn('tile fetch failed', redactVWorldUrl(url));
    }
  }}
  fallback={({ reason }) => <div>map unavailable: {reason}</div>}
/>
```

## Hooks

All hooks must be used inside `<VWorldMap>`.

```tsx
import { useMap, useMapZoom, useMapLoaded, useMapSelector, useEvent } from 'maplibre-vworld';

useMap();          // MapLibre instance, or null until mounted. Stable identity.
useMapZoom();      // current zoom; re-renders on zoomend
useMapLoaded();    // true once load fired
useMapSelector(s => s.zoom < 12);  // arbitrary slice with referential caching
useEvent(handler); // stable callback that always invokes the latest version
```

The selector pattern is the recommended way to react to threshold crossings:

```tsx
const simplified = useMapSelector(
  useCallback((s) => s.zoom < (s.semanticZoomThreshold ?? 12), []),
);
```

This re-renders the consumer only when the boolean flips — not on every zoom event.

## Markers

| Component | Use case |
| --- | --- |
| `Marker` | Built-in pin (color customizable) or arbitrary React children via portal. |
| `PinMarker` | Teardrop pin with optional icon, label, tooltip. |
| `MakiMarker` | Pin with a [Maki](https://labs.mapbox.com/maki-icons/) icon (loaded as CSS mask). |
| `PulsingMarker` | Animated ripple dot — good for "user here" indicators. |
| `SimpleMarker` | Label pill with optional zoom simplification. |
| `PlaceMarker` | Card with title / description / photo. |
| `PriceMarker` | Airbnb-style price chip. |
| `WeatherMarker` | Condition badge with optional hourly forecast popover. |
| `RoutePointMarker` | Numbered/lettered route point. |
| `ClusterMarker` | Default cluster bubble rendered by `<ClusterLayer>`. |

Markers accept `selected`, `highlighted`, `zIndex`, `ariaLabel`, `className` for state styling. The element exposes `data-selected` / `data-highlighted` attributes for CSS hooks.

## Layers

```tsx
<RouteLine id="route" coordinates={[[127, 37], [127.1, 37.1]]} color="#2196F3" width={4} />

<PolygonArea id="park" data={geojsonFeature} fillColor="..." outlineColor="..." />
```

`RouteLine` and `PolygonArea` persist across `setStyle()` (layer swap) — they re-register on `styledata`.

## Popup

```tsx
import { Popup } from 'maplibre-vworld';

<Popup lngLat={[127, 37]} onClose={() => setOpen(false)}>
  <h3>Hello</h3>
</Popup>
```

## Clustering

Client-side via supercluster:

```tsx
<ClusterLayer
  points={points}
  radius={50}
  maxZoom={16}
  renderMarker={(p) => <Marker key={p.id} lngLat={p.lngLat} />}
/>
```

Server-side (your backend already grouped points by zoom):

```tsx
<ServerClusterLayer
  clusters={serverClusters}
  onClusterClick={(c) => console.log(c.id)}
/>
```

`ServerClusterPoint.bounds` triggers `fitBounds`; otherwise `flyTo` is used.

## VWorld utilities

```tsx
import {
  getVWorldTileUrl,
  getVWorldStyle,
  getVWorldMaxZoom,
  redactVWorldUrl,
  isVWorldTileError,
} from 'maplibre-vworld';

const style = getVWorldStyle(apiKey, 'Hybrid');
// → MapLibre StyleSpecification with the Hybrid (Satellite + label) raster sources

const safeForLog = redactVWorldUrl(error.url);
// → 'https://api.vworld.kr/req/wmts/1.0.0/***/Base/14/8000/12000.png'

if (isVWorldTileError(event)) { /* … */ }
```

## Zod schemas

```tsx
import {
  LngLatSchema,
  BoundsSchema,
  PointSchema,
  extendPointSchema,
  makeBoundedLngLatSchema,
  formatLngLat,
} from 'maplibre-vworld';

// Generic, WGS84-bounded:
LngLatSchema.parse([127.024, 37.532]); // ✓

// Region-bounded factory (e.g. Korea preset):
const KoreaLngLat = makeBoundedLngLatSchema([124, 132], [33, 43]);

// Extend the point shape with your own properties:
const PlaceSchema = extendPointSchema({ name: z.string(), rating: z.number() });
```

## Bundle / SSR

- ESM (`.mjs`) and UMD (`.umd.js`) builds, with declaration files.
- `react`, `react-dom`, `maplibre-gl`, `zod` externalized.
- All DOM-touching files carry `'use client'` — safe to import from a Next.js React Server Component, the directive boundary moves the work to the client bundle.

## License

MIT.
