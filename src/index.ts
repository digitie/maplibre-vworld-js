// VWorld tile / style helpers + redactor
export {
  getVWorldTileUrl,
  getVWorldStyle,
  getVWorldMaxZoom,
  redactVWorldUrl,
  isVWorldTileError,
  type VWorldLayerType,
  type VWorldResourceError,
} from './vworld';

// Map store + React hooks
export {
  MapStore,
  type MapStoreSnapshot,
  MapStoreContext,
  useMap,
  useMapZoom,
  useMapLoaded,
  useMapSelector,
  useEvent,
} from './store';

// Top-level map container
export {
  VWorldMap,
  type VWorldMapProps,
  type VWorldMapFallbackInfo,
  type VWorldMapFallbackReason,
} from './components/VWorldMap';

// Marker primitives
export { Marker, type MarkerProps } from './components/Marker';
export { PinMarker, type PinMarkerProps } from './components/PinMarker';
export { MakiMarker, type MakiMarkerProps } from './components/MakiMarker';
export { PulsingMarker, type PulsingMarkerProps } from './components/PulsingMarker';
export { SimpleMarker, type SimpleMarkerProps } from './components/SimpleMarker';
export { PlaceMarker, type PlaceMarkerProps } from './components/PlaceMarker';
export { PriceMarker, type PriceMarkerProps } from './components/PriceMarker';
export {
  WeatherMarker,
  type WeatherMarkerProps,
  type WeatherCondition,
  type HourlyForecast,
} from './components/WeatherMarker';
export { RoutePointMarker, type RoutePointMarkerProps } from './components/RoutePointMarker';
export { ClusterMarker, type ClusterMarkerProps } from './components/ClusterMarker';

// Layer primitives
export {
  ClusterLayer,
  type ClusterLayerProps,
  type ClusterPoint,
  type ClusterPointFeature,
} from './components/ClusterLayer';
export {
  ServerClusterLayer,
  type ServerClusterLayerProps,
  type ServerClusterPoint,
} from './components/ServerClusterLayer';
export { RouteLine, type RouteLineProps } from './components/RouteLine';
export { PolygonArea, type PolygonAreaProps, type PolygonAreaInput } from './components/PolygonArea';

// Popup
export { Popup, type PopupProps } from './components/Popup';

// Zod schemas + helpers
export {
  LngLatSchema,
  BoundsSchema,
  PointSchema,
  RouteCoordinatesSchema,
  type LngLat,
  type Bounds,
  type Point,
  type RouteCoordinates,
  makeBoundedLngLatSchema,
  makeBoundedBoundsSchema,
  extendPointSchema,
  formatLngLat,
  serializeBounds,
  parseBoundsParam,
} from './schemas';
