import { default as React } from 'react';
export interface MapContextMenuProps {
    /** The screen X coordinate of the context menu. */
    x: number;
    /** The screen Y coordinate of the context menu. */
    y: number;
    /** Callback fired when the user clicks outside the menu or presses Escape. */
    onClose: () => void;
    /** Content of the context menu. */
    children?: React.ReactNode;
    /** Custom inline styles for the container. */
    style?: React.CSSProperties;
    /** Custom class name for the container. */
    className?: string;
    /** If true, the component will not render via portal. @default false */
    disablePortal?: boolean;
}
/**
 * A generic context menu component for map interactions.
 * Automatically closes on outside click or 'Escape' key press.
 */
export declare const MapContextMenu: React.FC<MapContextMenuProps>;
