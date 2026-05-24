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
/**
 * Basic Point Data schema for clustering and markers.
 */
export declare const BasePointDataSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    lngLat: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, "strip", z.ZodTypeAny, {
    lngLat: [number, number];
    id: string | number;
}, {
    lngLat: [number, number];
    id: string | number;
}>;
export type BasePointData = z.infer<typeof BasePointDataSchema>;
/**
 * Generic Point Data schema constructor to validate custom properties.
 */
export declare const createPointDataSchema: <T extends z.ZodRawShape>(properties: T) => z.ZodObject<z.objectUtil.extendShape<{
    id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    lngLat: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, T>, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<z.objectUtil.extendShape<{
    id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    lngLat: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, T>>, any> extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never, z.baseObjectInputType<z.objectUtil.extendShape<{
    id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    lngLat: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, T>> extends infer T_2 ? { [k_1 in keyof T_2]: T_2[k_1]; } : never>;
/**
 * Route coordinates validation schema.
 */
export declare const RouteCoordinatesSchema: z.ZodArray<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, "many">;
export type RouteCoordinates = z.infer<typeof RouteCoordinatesSchema>;
