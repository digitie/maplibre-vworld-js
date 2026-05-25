import { default as React } from 'react';
import { default as maplibregl } from 'maplibre-gl';
export interface PopupProps {
    /** Anchor position as `[longitude, latitude]`. */
    lngLat: [number, number];
    /** Popup body. Rendered into a `<div>` via React portal. */
    children: React.ReactNode;
    /** Offset from the anchor point, see {@link maplibregl.PopupOptions.offset}. */
    offset?: maplibregl.PopupOptions['offset'];
    /** @default true */
    closeButton?: boolean;
    /** @default true */
    closeOnClick?: boolean;
    /** Constrain the popup width, e.g. `'320px'`. */
    maxWidth?: string;
    /** Additional className applied to the popup root. */
    className?: string;
    /** Fired when the popup closes (button click, outside click, or unmount). */
    onClose?: () => void;
}
/**
 * MapLibre popup rendered with React children via portal. The MapLibre
 * instance is created once per `(map, popup option)` set and reused on
 * position / content changes.
 */
export declare const Popup: React.FC<PopupProps>;
