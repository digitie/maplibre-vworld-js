import { default as React } from 'react';
import { default as maplibregl } from 'maplibre-gl';
export interface PopupProps {
    /** Anchor position as `[longitude, latitude]`. */
    lngLat: [number, number];
    /** Popup body. Rendered into a `<div>` via React portal. */
    children: React.ReactNode;
    /**
     * Offset from the anchor point, see {@link maplibregl.PopupOptions.offset}.
     * Applied via `setOffset` when changed — does not re-create the popup.
     */
    offset?: maplibregl.PopupOptions['offset'];
    /**
     * Maximum CSS width, e.g. `'320px'`. Applied via `setMaxWidth` when
     * changed — does not re-create the popup.
     */
    maxWidth?: string;
    /**
     * Show the built-in close button. Construction-only: changing this after
     * mount has no effect (MapLibre does not expose a setter). @default true
     */
    closeButton?: boolean;
    /**
     * Close on click anywhere on the map. Construction-only. @default true
     */
    closeOnClick?: boolean;
    /**
     * Additional className applied to the popup root. Construction-only.
     */
    className?: string;
    /** Fired when the popup closes (button click, outside click, or unmount). */
    onClose?: () => void;
}
/**
 * MapLibre popup rendered with React children via portal.
 *
 * The MapLibre instance is created once per `(map, container)` and reused.
 * `lngLat`, `offset`, and `maxWidth` are applied via setters on prop
 * changes (cheap). `closeButton`, `closeOnClick`, and `className` are
 * construction-only and are read once at first mount.
 *
 * Snapshotting the construction-only options in a ref means consumers can
 * pass inline literals (e.g. `closeButton={true}`) without re-mounting the
 * popup every render and losing focus / triggering `onClose`.
 */
export declare const Popup: React.FC<PopupProps>;
