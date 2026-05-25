import { z } from 'zod';

/**
 * Zod schema for validating [longitude, latitude] coordinates.
 * - Longitude must be between -180 and 180.
 * - Latitude must be between -90 and 90.
 */
export const LngLatSchema = z.tuple([
  z.number().min(-180).max(180),
  z.number().min(-90).max(90),
]);

export type LngLat = z.infer<typeof LngLatSchema>;

/**
 * Zod schema for Map Bounds [WestLng, SouthLat, EastLng, NorthLat].
 */
export const BoundsSchema = z.tuple([
  z.number().min(-180).max(180),
  z.number().min(-90).max(90),
  z.number().min(-180).max(180),
  z.number().min(-90).max(90),
]);

export type Bounds = z.infer<typeof BoundsSchema>;

export const KOREA_LNG_RANGE = [124, 132] as const;
export const KOREA_LAT_RANGE = [33, 43] as const;

/**
 * Zod schema for validating [longitude, latitude] coordinates in Korea.
 * This is intentionally a broad web-map guard, not a cadastral/CRS validator.
 */
export const KoreaLngLatSchema = z.tuple([
  z.number().min(KOREA_LNG_RANGE[0]).max(KOREA_LNG_RANGE[1]),
  z.number().min(KOREA_LAT_RANGE[0]).max(KOREA_LAT_RANGE[1]),
]);

export type KoreaLngLat = z.infer<typeof KoreaLngLatSchema>;

/**
 * Zod schema for Map Bounds [WestLng, SouthLat, EastLng, NorthLat] in Korea.
 */
export const KoreaBoundsSchema = z.tuple([
  z.number().min(KOREA_LNG_RANGE[0]).max(KOREA_LNG_RANGE[1]),
  z.number().min(KOREA_LAT_RANGE[0]).max(KOREA_LAT_RANGE[1]),
  z.number().min(KOREA_LNG_RANGE[0]).max(KOREA_LNG_RANGE[1]),
  z.number().min(KOREA_LAT_RANGE[0]).max(KOREA_LAT_RANGE[1]),
]);

export type KoreaBounds = z.infer<typeof KoreaBoundsSchema>;

function roundCoordinate(value: number, precision: number): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function formatLngLat(lngLat: LngLat, precision = 4): LngLat {
  return [
    roundCoordinate(lngLat[0], precision),
    roundCoordinate(lngLat[1], precision),
  ];
}

export function serializeBounds(bounds: Bounds, precision = 6): string {
  return bounds.map((value) => roundCoordinate(value, precision)).join(',');
}

export function parseBoundsParam(value: string): Bounds {
  const parts = value.split(',').map((part) => Number(part.trim()));
  return BoundsSchema.parse(parts);
}

/**
 * Basic Point Data schema for clustering and markers.
 */
export const BasePointDataSchema = z.object({
  id: z.union([z.string(), z.number()]),
  lngLat: LngLatSchema,
});

export type BasePointData = z.infer<typeof BasePointDataSchema>;

/**
 * Generic Point Data schema constructor to validate custom properties.
 */
export const createPointDataSchema = <T extends z.ZodRawShape>(properties: T) => {
  return BasePointDataSchema.extend(properties);
};

/**
 * Route coordinates validation schema.
 */
export const RouteCoordinatesSchema = z.array(LngLatSchema).min(2, "Route must have at least 2 points");

export type RouteCoordinates = z.infer<typeof RouteCoordinatesSchema>;
