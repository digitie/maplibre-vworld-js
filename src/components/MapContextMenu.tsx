'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

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
export const MapContextMenu: React.FC<MapContextMenuProps> = ({
  x,
  y,
  onClose,
  children,
  style,
  className,
  disablePortal = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Ensure the click was outside the menu container
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Use a slight delay to prevent the initial right-click or click from immediately closing it
    const timerId = setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
      window.addEventListener('contextmenu', handleOutsideClick);
      window.addEventListener('keydown', handleKeyDown);
    }, 0);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('contextmenu', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const menuElement = (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'fixed',
        top: y,
        left: x,
        zIndex: 9999, // Should be above the map and other map controls
        background: 'white',
        border: '1px solid #ccc',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        borderRadius: '4px',
        padding: '4px 0',
        minWidth: '160px',
        fontFamily: 'sans-serif',
        ...style,
      }}
    >
      {children}
    </div>
  );

  if (disablePortal || typeof document === 'undefined') {
    return menuElement;
  }

  return createPortal(menuElement, document.body);
};
