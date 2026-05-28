import { default as React } from 'react';
import { default as maplibregl } from 'maplibre-gl';
import { MapInteractionContext } from './VWorldMap';
export interface MarkerProps {
    /** Marker position as `[longitude, latitude]`. */
    lngLat: [number, number];
    /**
     * Color of the built-in pin SVG. Ignored when `children` is provided.
     * @default '#3FB1CE'
     */
    color?: string;
    /**
     * Where the marker element anchors against the `lngLat`. Matches
     * MapLibre's [`MarkerOptions.anchor`](https://maplibre.org/maplibre-gl-js/docs/API/types/MarkerOptions/#anchor).
     *
     * - For pin-shaped content where the tip touches the coordinate, use
     *   `'bottom'`.
     * - For a centered bubble / dot, leave as `'center'` (default).
     */
    anchor?: maplibregl.PositionAnchor;
    /**
     * Pixel offset `[x, y]` applied after `anchor`. Matches MapLibre's
     * `MarkerOptions.offset`.
     */
    offset?: maplibregl.PointLike;
    /** Allow the user to drag the marker. */
    draggable?: boolean;
    /** Fired after a drag ends, with the new `[lng, lat]`. */
    onDragEnd?: (lngLat: [number, number]) => void;
    /** Fired on click of the marker DOM. */
    onClick?: (event: MouseEvent, context: MapInteractionContext, marker: maplibregl.Marker) => void;
    /** Fired on right-click of the marker DOM. */
    onContextMenu?: (event: MouseEvent, context: MapInteractionContext, marker: maplibregl.Marker) => void;
    /** Visual selected state — sets `data-selected="true"` and applies a scale + shadow. */
    selected?: boolean;
    /** Visual highlighted state — sets `data-highlighted="true"` and applies a softer scale + shadow. */
    highlighted?: boolean;
    /** Title text to show in a tooltip on hover. */
    title?: string;
    /** Description text to show in a tooltip on hover. */
    description?: string;
    /** Image URL to show in a tooltip on hover. */
    imageUrl?: string;
    /** Fired when the mouse enters the marker. */
    onMouseEnter?: (event: MouseEvent, context: MapInteractionContext, marker: maplibregl.Marker) => void;
    /** Fired when the mouse leaves the marker. */
    onMouseLeave?: (event: MouseEvent, context: MapInteractionContext, marker: maplibregl.Marker) => void;
    /** Interaction ID used for context differentiation when clicked. */
    interactionId?: string;
    /** Whether this marker is a cluster (used for context source differentiation). */
    isCluster?: boolean;
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
