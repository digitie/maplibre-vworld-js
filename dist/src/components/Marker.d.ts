import { default as React } from 'react';
import { default as maplibregl } from 'maplibre-gl';
export interface MarkerProps {
    /** Marker position as `[longitude, latitude]`. */
    lngLat: [number, number];
    /**
     * Color of the built-in pin SVG. Ignored when `children` is provided.
     * @default '#3FB1CE'
     */
    color?: string;
    /** Allow the user to drag the marker. */
    draggable?: boolean;
    /** Fired after a drag ends, with the new `[lng, lat]`. */
    onDragEnd?: (lngLat: [number, number]) => void;
    /** Fired on click of the marker DOM. */
    onClick?: (event: MouseEvent, marker: maplibregl.Marker) => void;
    /** Fired on right-click of the marker DOM. */
    onContextMenu?: (event: MouseEvent, marker: maplibregl.Marker) => void;
    /** Visual selected state — sets `data-selected="true"` and applies a scale + shadow. */
    selected?: boolean;
    /** Visual highlighted state — sets `data-highlighted="true"` and applies a softer scale + shadow. */
    highlighted?: boolean;
    /** CSS `z-index` for stacking among other markers. */
    zIndex?: number;
    /** `aria-label` for accessibility. When set, the element also gets `role="button"`. */
    ariaLabel?: string;
    /** Additional CSS class names. */
    className?: string;
    /**
     * Custom marker content. When provided, the built-in pin SVG is replaced
     * with the children rendered via React portal into a `<div>` element.
     */
    children?: React.ReactNode;
}
/**
 * Renders a MapLibre marker. With no `children`, MapLibre's default pin SVG
 * is used (color customizable). With `children`, a custom DOM element hosts
 * the children via React portal.
 *
 * The MapLibre marker instance is created once per `(map, hasChildren)`
 * pair and reused across prop changes. Callbacks (`onClick`, `onDragEnd`,
 * `onContextMenu`) can change freely without re-creating the marker.
 */
export declare const Marker: React.FC<MarkerProps>;
