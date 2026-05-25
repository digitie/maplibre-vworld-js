import { z } from 'zod';
/**
 * Zod schema for validating [longitude, latitude] coordinates.
 * - Longitude must be between -180 and 180.
 * - Latitude must be between -90 and 90.
 */
export declare const LngLatSchema: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
export type LngLat = z.infer<typeof LngLatSchema>;
/**
 * Zod schema for Map Bounds [WestLng, SouthLat, EastLng, NorthLat].
 */
export declare const BoundsSchema: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
export type Bounds = z.infer<typeof BoundsSchema>;
export declare const KOREA_LNG_RANGE: readonly [124, 132];
export declare const KOREA_LAT_RANGE: readonly [33, 43];
/**
 * Zod schema for validating [longitude, latitude] coordinates in Korea.
 * This is intentionally a broad web-map guard, not a cadastral/CRS validator.
 */
export declare const KoreaLngLatSchema: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
export type KoreaLngLat = z.infer<typeof KoreaLngLatSchema>;
/**
 * Zod schema for Map Bounds [WestLng, SouthLat, EastLng, NorthLat] in Korea.
 */
export declare const KoreaBoundsSchema: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
export type KoreaBounds = z.infer<typeof KoreaBoundsSchema>;
export declare function formatLngLat(lngLat: LngLat, precision?: number): LngLat;
export declare function serializeBounds(bounds: Bounds, precision?: number): string;
export declare function parseBoundsParam(value: string): Bounds;
/**
 * Basic Point Data schema for clustering and markers.
 */
export declare const BasePointDataSchema: z.ZodObject<{
    id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    lngLat: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>;
export type BasePointData = z.infer<typeof BasePointDataSchema>;
/**
 * Generic Point Data schema constructor to validate custom properties.
 */
export declare const createPointDataSchema: <T extends z.ZodRawShape>(properties: T) => z.ZodObject<(("lngLat" | "id") & keyof T extends never ? {
    id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    lngLat: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
} & { -readonly [P in keyof T]: T[P]; } : ({
    id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    lngLat: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
} extends infer T_2 extends z.core.util.SomeObject ? { [K in keyof T_2 as K extends keyof T ? never : K]: T_2[K]; } : never) & { [K_1 in keyof { -readonly [P in keyof T]: T[P]; }]: { -readonly [P in keyof T]: T[P]; }[K_1]; }) extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never, z.core.$strip>;
/**
 * Route coordinates validation schema.
 */
export declare const RouteCoordinatesSchema: z.ZodArray<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
export type RouteCoordinates = z.infer<typeof RouteCoordinatesSchema>;
