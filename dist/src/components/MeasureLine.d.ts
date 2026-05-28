import { default as React } from 'react';
export interface MeasureLineProps {
    /** Array of points `[lng, lat]` defining the line segments. */
    points: Array<[number, number]>;
    /** Line color. */
    color?: string;
    /** Line width. */
    width?: number;
    /** Whether to show a total distance marker at the last point. @default true */
    showTotalDistance?: boolean;
    /** Whether to show segment distance markers at the midpoint of each segment. @default true */
    showSegmentDistances?: boolean;
}
/**
 * A line component that measures and displays distances along its segments.
 * Useful for building consumer measuring tools.
 */
export declare const MeasureLine: React.FC<MeasureLineProps>;
