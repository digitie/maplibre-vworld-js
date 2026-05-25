import type { ErrorEvent, StyleSpecification } from 'maplibre-gl';

/**
 * VWorld layer identifier. `gray` is a synonym for the VWorld "white" basemap.
 */
export type VWorldLayerType = 'Base' | 'gray' | 'midnight' | 'Hybrid' | 'Satellite';

const LIMITED_ZOOM_LAYER_TYPES = new Set<VWorldLayerType>(['Hybrid', 'Satellite']);
const VWORLD_ATTRIBUTION = '공간정보 오픈플랫폼 브이월드';
const TRANSIENT_TILE_ERROR_STATUSES = new Set([404, 408, 429, 500, 502, 503, 504]);
const VWORLD_WMTS_PATH = /(\/req\/wmts\/1\.0\.0\/)([^/?#]+)(\/)/;

/**
 * MapLibre `error.error` value shape when the failure comes from a resource
 * loader (tile fetch, style fetch, image fetch). MapLibre attaches `status` /
 * `url` / `statusText` on those errors but does not type them.
 */
export interface VWorldResourceError extends Error {
  status?: number;
  statusText?: string;
  url?: string;
}

/**
 * Build a VWorld WMTS tile URL template for a layer. The returned string
 * contains MapLibre placeholders `{z}/{y}/{x}` so it can be passed directly
 * to a raster source's `tiles` array.
 *
 * The API key is `encodeURIComponent`-encoded after trimming surrounding
 * whitespace, so accidental newlines / spaces in environment variables do not
 * break the URL.
 */
export function getVWorldTileUrl(apiKey: string, layerType: VWorldLayerType): string {
  const ext = layerType === 'Satellite' ? 'jpeg' : 'png';
  const apiLayer = layerType === 'gray' ? 'white' : layerType;
  return `https://api.vworld.kr/req/wmts/1.0.0/${encodeURIComponent(apiKey.trim())}/${apiLayer}/{z}/{y}/{x}.${ext}`;
}

/**
 * Maximum zoom level the VWorld tile service serves for a given layer.
 * Satellite / Hybrid stop at z18; Base / gray / midnight go to z19.
 */
export function getVWorldMaxZoom(layerType: VWorldLayerType): number {
  return LIMITED_ZOOM_LAYER_TYPES.has(layerType) ? 18 : 19;
}

/**
 * Replace the API-key segment of a VWorld WMTS tile URL with `***` so the URL
 * can be safely logged, shown in error banners, or sent to monitoring.
 *
 * The VWorld WMTS path format is:
 *   `https://api.vworld.kr/req/wmts/1.0.0/{key}/{layer}/{z}/{y}/{x}.{ext}`
 *
 * Inputs that do not match the WMTS path are returned unchanged, so this is
 * safe to call on arbitrary URLs (e.g. logging error messages of unknown
 * origin). `undefined` is passed through as `undefined`.
 */
export function redactVWorldUrl(url: string): string;
export function redactVWorldUrl(url: string | undefined): string | undefined;
export function redactVWorldUrl(url: string | undefined): string | undefined {
  if (url === undefined) return undefined;
  return url.replace(VWORLD_WMTS_PATH, '$1***$3');
}

/**
 * Heuristic: did this MapLibre `error` event originate from a VWorld tile
 * fetch? Useful for differentiating tile-level transient failures from style
 * / WebGL errors when deciding whether to surface a banner or retry.
 */
export function isVWorldTileError(event: ErrorEvent): boolean {
  const error = event.error as VWorldResourceError | undefined;
  const message = error?.message?.toLowerCase() ?? '';
  const sourceId = (event as { sourceId?: unknown }).sourceId;
  const url = error?.url ?? '';

  return (
    (typeof sourceId === 'string' && sourceId.startsWith('vworld')) ||
    url.includes('/req/wmts/') ||
    message.includes('tile') ||
    message.includes('failed to fetch') ||
    TRANSIENT_TILE_ERROR_STATUSES.has(error?.status ?? 0)
  );
}

/**
 * Build a MapLibre {@link StyleSpecification} that renders the requested
 * VWorld layer. For `Hybrid`, the satellite imagery is laid down first and
 * the hybrid label tiles are stacked on top.
 */
export function getVWorldStyle(apiKey: string, layerType: VWorldLayerType): StyleSpecification {
  const sources: StyleSpecification['sources'] = {};
  const layers: StyleSpecification['layers'] = [];
  const maxzoom = getVWorldMaxZoom(layerType);

  if (layerType === 'Hybrid') {
    sources['vworld-satellite'] = {
      type: 'raster',
      tiles: [getVWorldTileUrl(apiKey, 'Satellite')],
      tileSize: 256,
      attribution: VWORLD_ATTRIBUTION,
      maxzoom,
    };
    layers.push({
      id: 'vworld-satellite-layer',
      type: 'raster',
      source: 'vworld-satellite',
      minzoom: 0,
    });
  }

  sources[`vworld-${layerType}`] = {
    type: 'raster',
    tiles: [getVWorldTileUrl(apiKey, layerType)],
    tileSize: 256,
    attribution: VWORLD_ATTRIBUTION,
    maxzoom,
  };

  layers.push({
    id: `vworld-${layerType}-layer`,
    type: 'raster',
    source: `vworld-${layerType}`,
    minzoom: 0,
  });

  return {
    version: 8,
    sources,
    layers,
  };
}
