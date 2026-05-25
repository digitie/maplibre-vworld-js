import { default as React } from 'react';
import { PinMarkerProps } from './PinMarker';
export interface MakiMarkerProps extends Omit<PinMarkerProps, 'icon'> {
    /** Maki icon name (without `.svg`), e.g. `'restaurant'`, `'park'`. */
    icon: string;
    /** Override the CDN base URL serving the icon SVGs. */
    iconBaseUrl?: string;
    /** CSS color of the icon glyph. @default 'white' */
    iconColor?: string;
}
/**
 * Pin marker that displays a Mapbox Maki icon. The SVG is loaded as a CSS
 * mask so it can be colorized dynamically without parsing paths.
 */
export declare const MakiMarker: React.FC<MakiMarkerProps>;
