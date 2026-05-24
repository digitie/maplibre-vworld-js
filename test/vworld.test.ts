import { describe, it, expect } from 'vitest';
import { getVWorldMaxZoom, getVWorldTileUrl, getVWorldStyle } from '../src/vworld';

describe('VWorld Utilities', () => {
  const API_KEY = 'TEST_KEY';

  describe('getVWorldTileUrl', () => {
    it('returns png url for Base layer', () => {
      const url = getVWorldTileUrl(API_KEY, 'Base');
      expect(url).toBe('https://api.vworld.kr/req/wmts/1.0.0/TEST_KEY/Base/{z}/{y}/{x}.png');
    });

    it('returns jpeg url for Satellite layer', () => {
      const url = getVWorldTileUrl(API_KEY, 'Satellite');
      expect(url).toBe('https://api.vworld.kr/req/wmts/1.0.0/TEST_KEY/Satellite/{z}/{y}/{x}.jpeg');
    });

    it('returns png url for Hybrid layer', () => {
      const url = getVWorldTileUrl(API_KEY, 'Hybrid');
      expect(url).toBe('https://api.vworld.kr/req/wmts/1.0.0/TEST_KEY/Hybrid/{z}/{y}/{x}.png');
    });
  });

  describe('getVWorldStyle', () => {
    it('returns valid MapLibre style specification for Base', () => {
      const style = getVWorldStyle(API_KEY, 'Base');
      
      expect(style.version).toBe(8);
      expect(style.sources).toHaveProperty('vworld-Base');
      expect(style.sources['vworld-Base'].type).toBe('raster');
      expect((style.sources['vworld-Base'] as any).attribution).toBe('공간정보 오픈플랫폼 브이월드');
      expect((style.sources['vworld-Base'] as any).maxzoom).toBe(19);
      expect((style.sources['vworld-Base'] as any).tiles[0]).toContain('/Base/');
      
      expect(style.layers).toHaveLength(1);
      expect(style.layers[0].id).toBe('vworld-Base-layer');
    });

    it('returns Satellite as base layer and Hybrid on top when layerType is Hybrid', () => {
      const style = getVWorldStyle(API_KEY, 'Hybrid');
      
      expect(style.sources).toHaveProperty('vworld-satellite');
      expect(style.sources).toHaveProperty('vworld-Hybrid');
      
      expect(style.layers).toHaveLength(2);
      expect(style.layers[0].id).toBe('vworld-satellite-layer');
      expect(style.layers[1].id).toBe('vworld-Hybrid-layer');
      expect((style.sources['vworld-satellite'] as any).maxzoom).toBe(18);
      expect((style.sources['vworld-Hybrid'] as any).maxzoom).toBe(18);
    });

    it('returns layer-specific max zoom values', () => {
      expect(getVWorldMaxZoom('Base')).toBe(19);
      expect(getVWorldMaxZoom('Satellite')).toBe(18);
      expect(getVWorldMaxZoom('Hybrid')).toBe(18);
    });
  });
});
