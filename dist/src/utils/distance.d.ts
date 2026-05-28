/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 *
 * @param a First point as `[longitude, latitude]`
 * @param b Second point as `[longitude, latitude]`
 * @returns Distance in meters
 */
export declare function haversine(a: [number, number], b: [number, number]): number;
/**
 * Formats a distance in meters to a human-readable string (e.g. "1.2 km" or "500 m").
 */
export declare function formatDistance(meters: number): string;
