# CHANGELOG

All notable changes to `maplibre-vworld` are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project loosely adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). The 1.0.0 line is the stable baseline shipped after PR #14.

## [Unreleased]

### Changed

- Repository documentation restructured to match `python-kraddr-geo` (T-015): `CLAUDE.md`/`AGENTS.md`/`SKILL.md` at root, `docs/{architecture,decisions,journal,tasks,resume,dev-environment}.md` for the rest. Public API is unchanged.

## [1.0.0] — 2026-05-26

This release consolidates PR #1 through #14 into the stable baseline. From this point on, breaking changes follow semver.

### Added

- External store architecture: `MapStore` + `useSyncExternalStore` (ADR-8). `useMap`, `useMapZoom`, `useMapLoaded`, `useMapSelector`, `useEvent` exposed from the package root.
- `<VWorldMap>` props: `fallback`, `loadingSkeleton`, `animateCameraChanges`, `flyToOptions`, `onClick`, `onContextMenu`, `onMoveEnd`, `onZoomEnd`, `onIdle`, `onError`, `transformRequest`, `semanticZoomThreshold`.
- `<Marker>` state props: `selected`, `highlighted`, `zIndex`, `ariaLabel`, `className`. Anchor/offset construction-time prop on `<Marker>`.
- `<Popup>` with construction-only options snapshot and dedicated setter effects (no remount on inline `offset` change).
- `<ClusterLayer>` (client-side via supercluster) and `<ServerClusterLayer>` (server-grouped clusters).
- Marker variants: `PinMarker`, `MakiMarker`, `PulsingMarker`, `SimpleMarker`, `PlaceMarker`, `PriceMarker`, `WeatherMarker`, `RoutePointMarker`, `ClusterMarker`.
- Layer components: `RouteLine`, `PolygonArea`.
- Schemas: `LngLatSchema`, `BoundsSchema`, `PointSchema`, `RouteCoordinatesSchema`, `makeBoundedLngLatSchema`, `makeBoundedBoundsSchema`, `extendPointSchema`, `formatLngLat`, `serializeBounds`, `parseBoundsParam`.
- VWorld helpers: `getVWorldTileUrl`, `getVWorldStyle`, `getVWorldMaxZoom`, `redactVWorldUrl`, `isVWorldTileError`.
- `'use client'` directive on every DOM-touching module (Next.js App Router safe).
- `dist/` committed for GitHub-URL consumers (ADR-5).
- CI workflow with `git diff --exit-code -- dist/` drift check.

### Changed

- API naming aligned with React ecosystem (PR #12):
  - `onMapClick` → `onClick`, `onMapLoad` → `onLoad`, `onMapError` → `onError`, `onMapContextMenu` → `onContextMenu`
  - `showNavigationControl`/`showGeolocateControl`/`showScaleControl` → `navigation`/`geolocate`/`scale`
  - `MarkerClusterer` → `ClusterLayer`, `MapPopup` → `Popup`
  - `lineWidth`/`lineDasharray` → `width`/`dashArray` on `<RouteLine>`
  - `BasePointDataSchema` → `PointSchema`, `createPointDataSchema` → `extendPointSchema`
- `<VWorldMap center>` is now required — no implicit Seoul default (PR #12).
- Camera prop changes (`center`, `zoom`, `pitch`, `bearing`) now queue with `pendingCameraRef` when the user is mid-gesture and re-apply on `moveend` (PR #14).
- `<RouteLine>` and `<PolygonArea>` listen on `style.load` instead of `styledata` to avoid re-entrancy from our own `setPaintProperty` calls (PR #14).
- `useMapSelector` keeps the selector in a ref so unstable selector identity does not invalidate the cache (PR #14).
- `<Marker>` `className` diffing uses a token-set (`prev - next` remove, `next - prev` add) to avoid CSS-transition flicker on shared tokens (PR #14).
- `<PinMarker>` and `<PlaceMarker>` use `<Marker anchor="bottom" offset={...}>` instead of manual `transform: translate(...)` — eliminates double-transform with MapLibre's anchor (PR #14).
- zod pinned to `^4.4.3` (peer + dev). zod v3 is no longer supported (ADR-6, PR #8). Build artifacts shrunk by ~67% via externalization.

### Removed

- Domain-specific TripMate code (`src/tripmate.ts`, `<TripmateFeatureLayer>`, `TRIPMATE_MARKER_PALETTE`, Korean tourism category enums, `₩` currency hardcode) — ADR-7 (PR #12).
- `KoreaLngLatSchema`, `KoreaBoundsSchema`, `KOREA_LNG_RANGE` constants — replaced by `makeBoundedLngLatSchema` factory (PR #12).
- `VWorldMapErrorInfo`/`VWorldMapContextMenuInfo`/`VWorldViewportInfo` envelopes — raw MapLibre events are exposed directly (PR #12).
- `MakiMarker` aliases `iconName`/`fallbackIcon` — single `icon` prop (PR #12).
- `redactVWorldTileUrl` — subsumed into `redactVWorldUrl` (overload accepts `undefined`) (PR #12).
- Debug artifacts: `analyze_tiles.js`, `generate_html.js`, `test_tiles.js`, `tiles.html`, several PNG screenshots (PR #14).

### Fixed

- `useEvent` pattern (`useLayoutEffect + useRef + useCallback`) prevents stale event handler closures from MapLibre's perspective — prop callbacks can change freely without re-binding listeners (PR #12, refined in PR #13/14).
- `map.isMoving() || map.isEasing()` guard on camera prop application prevents jitter mid-gesture (PR #12, drop fix in PR #14).
- `useMapSelector` referential caching: same snapshot → same selector result reference. `Object.is` value comparison avoids unnecessary re-renders even on new snapshots (PR #13/14).
- `<Marker>` selected/highlighted scale applied to the actual `style.scale` property (Safari fallback via `--vworld-marker-scale` CSS var) (PR #13).
- `<RouteLine>` clears `dashArray` paint property when the prop is removed (PR #13).
- `<VWorldMap>` initial mount no longer replays `center`/`zoom` via redundant `flyTo` after `load` (PR #13).
- `<VWorldMap maxBounds>` removal correctly clears the bound via `setMaxBounds(undefined)` (PR #13).
- `<ClusterMarker>` `onClick` routed through `<Marker onClick>` (no longer bubbles to map click) and stabilized via `useEvent` + `useMemo` (PR #13/14).
- `<Popup>` no longer remounts on inline-object `offset` prop changes — construction-only options snapshotted, mutable options handled via dedicated setter effects (PR #14).
- `<ClusterLayer>` guards against the `load`-before-`map.getBounds()` race with `map.loaded()` check + `map.once('load', update)` fallback (PR #14).
- `isVWorldTileError(event)` handles `error?.message` null-safely (PR #14).
- Removed window global leak (`window.vworldMap`) and debug `console.log` statements (PR #6/7).

### Security

- VWorld API key in `dev/main.tsx` purged from git history; future leaks prevented by `redactVWorldUrl()` and DO NOT rule on plaintext commit (2026-05-24).

## Earlier history

PR #1 through #5 covered the initial library bootstrap (MapLibre integration, React portal markers, supercluster + viewport culling, zod schemas). Detailed entries live in `docs/journal.md`.
