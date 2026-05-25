import { z } from 'zod';
/**
 * `[longitude, latitude]` tuple validated against the full WGS84 range.
 */
export declare const LngLatSchema: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
export type LngLat = z.infer<typeof LngLatSchema>;
/**
 * Map bounds tuple `[westLng, southLat, eastLng, northLat]` validated
 * against the full WGS84 range.
 */
export declare const BoundsSchema: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
export type Bounds = z.infer<typeof BoundsSchema>;
/**
 * Build a bounded `[lng, lat]` schema. Useful when the application only
 * cares about coordinates in a specific country / region and wants to reject
 * obviously-wrong inputs (mis-typed latitude/longitude order, default zero,
 * etc.) earlier than the map render.
 *
 * @example
 * const SeoulLngLat = makeBoundedLngLatSchema([126, 128], [37, 38]);
 */
export declare function makeBoundedLngLatSchema(lngRange: readonly [number, number], latRange: readonly [number, number]): z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
/**
 * Build a bounded `[westLng, southLat, eastLng, northLat]` schema.
 */
export declare function makeBoundedBoundsSchema(lngRange: readonly [number, number], latRange: readonly [number, number]): z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
/**
 * Round a `[lng, lat]` tuple to `precision` decimal places. Default 4 digits
 * (~11m resolution) is appropriate for URL params and analytics.
 */
export declare function formatLngLat(lngLat: LngLat, precision?: number): LngLat;
/**
 * Serialize a bounds tuple to a comma-separated string suitable for URL
 * query params. Default 6 digits (~10cm) preserves enough precision for
 * round-trip without bloating the URL.
 */
export declare function serializeBounds(bounds: Bounds, precision?: number): string;
/**
 * Parse a comma-separated bounds string. Throws a `ZodError` if the result
 * is not a valid `[W, S, E, N]` tuple.
 */
export declare function parseBoundsParam(value: string): Bounds;
/**
 * Minimum point schema used by the clustering / marker APIs: an `id`
 * (string or number) and an `lngLat`. Extend this with `extendPointSchema`
 * when you need additional properties.
 */
export declare const PointSchema: z.ZodObject<{
    id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    lngLat: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>;
export type Point = z.infer<typeof PointSchema>;
/**
 * Extend the {@link PointSchema} with custom properties.
 *
 * @example
 * const PlaceSchema = extendPointSchema({ name: z.string(), category: z.string() });
 */
export declare function extendPointSchema<T extends z.ZodRawShape>(properties: T): z.ZodObject<(("lngLat" | "id") & keyof T extends never ? {
    id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    lngLat: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
} & { -readonly [P in keyof T]: T[P]; } : ({
    id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    lngLat: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
} extends infer T_2 extends z.core.util.SomeObject ? { [K in keyof T_2 as K extends keyof T ? never : K]: T_2[K]; } : never) & { [K_1 in keyof { -readonly [P in keyof T]: T[P]; }]: { -readonly [P in keyof T]: T[P]; }[K_1]; }) extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never, z.core.$strip>;
/**
 * Route coordinates: at least 2 points. Each point is validated against the
 * full WGS84 range.
 */
export declare const RouteCoordinatesSchema: z.ZodArray<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
export type RouteCoordinates = z.infer<typeof RouteCoordinatesSchema>;
