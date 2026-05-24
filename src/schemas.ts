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
