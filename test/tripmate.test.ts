import { describe, expect, it } from 'vitest';
import {
  BoundsSchema,
  KoreaLngLatSchema,
  formatLngLat,
  parseBoundsParam,
  serializeBounds,
} from '../src/schemas';
import {
  TRIPMATE_MARKER_PALETTE,
  isTripmateMarkerColorKey,
  resolveTripmateMarkerStyle,
} from '../src/tripmate';

describe('TripMate marker helpers', () => {
  it('resolves category defaults and user marker overrides', () => {
    const style = resolveTripmateMarkerStyle({
      category: 'restaurant',
      markerColor: 'P-03',
      markerIcon: 'cafe',
    });

    expect(style).toEqual({
      category: 'restaurant',
      colorKey: 'P-03',
      color: TRIPMATE_MARKER_PALETTE['P-03'].hex,
      labelColor: TRIPMATE_MARKER_PALETTE['P-03'].labelColor,
      icon: 'cafe',
    });
  });

  it('falls back to attraction style for unknown categories', () => {
    const style = resolveTripmateMarkerStyle({ category: 'unknown-category' });
    expect(style.colorKey).toBe('P-11');
    expect(style.icon).toBe('attraction');
  });

  it('guards marker color keys', () => {
    expect(isTripmateMarkerColorKey('P-01')).toBe(true);
    expect(isTripmateMarkerColorKey('P-99')).toBe(false);
  });
});

describe('Korea geo helpers', () => {
  it('validates broad Korea coordinates', () => {
    expect(KoreaLngLatSchema.parse([127, 37])).toEqual([127, 37]);
    expect(() => KoreaLngLatSchema.parse([139, 37])).toThrow();
  });

  it('formats coordinates and serializes bounds', () => {
    expect(formatLngLat([127.123456, 37.987654], 4)).toEqual([127.1235, 37.9877]);
    const bounds = BoundsSchema.parse([126.1234567, 35.9876543, 129.5555555, 38.1111111]);
    expect(serializeBounds(bounds, 4)).toBe('126.1235,35.9877,129.5556,38.1111');
    expect(parseBoundsParam('126,35,129,38')).toEqual([126, 35, 129, 38]);
  });
});
