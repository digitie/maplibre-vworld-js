import { StyleSpecification } from 'maplibre-gl';

export type VWorldLayerType = 'Base' | 'gray' | 'midnight' | 'Hybrid' | 'Satellite';

const LIMITED_ZOOM_LAYER_TYPES = new Set<VWorldLayerType>(['Hybrid', 'Satellite']);
const VWORLD_ATTRIBUTION = '공간정보 오픈플랫폼 브이월드';

export function getVWorldTileUrl(apiKey: string, layerType: VWorldLayerType): string {
  const ext = layerType === 'Satellite' ? 'jpeg' : 'png';
  const apiLayer = layerType === 'gray' ? 'white' : layerType;
  return `https://api.vworld.kr/req/wmts/1.0.0/${encodeURIComponent(apiKey.trim())}/${apiLayer}/{z}/{y}/{x}.${ext}`;
}

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
 * This function returns the input unchanged if the path does not look like a
 * VWorld WMTS URL, so it is safe to call on arbitrary error strings.
 */
export function redactVWorldUrl(url: string): string {
  return url.replace(/(\/req\/wmts\/1\.0\.0\/)([^/?#]+)(\/)/, '$1***$3');
}

export function getVWorldStyle(apiKey: string, layerType: VWorldLayerType): StyleSpecification {
  const sources: StyleSpecification['sources'] = {};
  const layers: StyleSpecification['layers'] = [];
  const maxzoom = getVWorldMaxZoom(layerType);

  // Always add Satellite as a base if Hybrid is selected
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
