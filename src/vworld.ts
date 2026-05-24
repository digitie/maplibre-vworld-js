import { StyleSpecification } from 'maplibre-gl';

export type VWorldLayerType = 'Base' | 'gray' | 'midnight' | 'Hybrid' | 'Satellite';

export function getVWorldTileUrl(apiKey: string, layerType: VWorldLayerType): string {
  const ext = layerType === 'Satellite' ? 'jpeg' : 'png';
  const apiLayer = layerType === 'gray' ? 'white' : layerType;
  return `https://api.vworld.kr/req/wmts/1.0.0/${apiKey}/${apiLayer}/{z}/{y}/{x}.${ext}`;
}

export function getVWorldStyle(apiKey: string, layerType: VWorldLayerType): StyleSpecification {
  const sources: StyleSpecification['sources'] = {};
  const layers: StyleSpecification['layers'] = [];

  // Always add Satellite as a base if Hybrid is selected
  if (layerType === 'Hybrid') {
    sources['vworld-satellite'] = {
      type: 'raster',
      tiles: [getVWorldTileUrl(apiKey, 'Satellite')],
      tileSize: 256,
      attribution: '© VWorld',
    };
    layers.push({
      id: 'vworld-satellite-layer',
      type: 'raster',
      source: 'vworld-satellite',
      minzoom: 0,
      maxzoom: 19,
    });
  }

  sources[`vworld-${layerType}`] = {
    type: 'raster',
    tiles: [getVWorldTileUrl(apiKey, layerType)],
    tileSize: 256,
    attribution: '© VWorld',
  };

  layers.push({
    id: `vworld-${layerType}-layer`,
    type: 'raster',
    source: `vworld-${layerType}`,
    minzoom: 0,
    maxzoom: 19,
  });

  return {
    version: 8,
    sources,
    layers,
  };
}
