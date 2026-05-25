'use client';

import React from 'react';
import { Marker, type MarkerProps } from './Marker';

export interface PinMarkerProps extends Omit<MarkerProps, 'children' | 'anchor'> {
  color?: string;
  icon?: React.ReactNode;
  size?: number;
  showInnerCircle?: boolean;
  label?: string;
  tooltip?: string;
}

/**
 * Teardrop-shaped pin with an optional icon centered in the head and an
 * optional label below the tip. Anchors at the tip (bottom-center) so the
 * coordinate refers to the pointed-to location, not the bubble center.
 */
export const PinMarker: React.FC<PinMarkerProps> = ({
  color = '#DB4437',
  icon,
  size = 40,
  showInnerCircle = true,
  label,
  tooltip,
  ...props
}) => {
  // Total visual height = SVG (size * 1.5) + label (if any).
  const teardropHeight = size * 1.5;

  return (
    <Marker {...props} anchor="bottom">
      <div
        title={tooltip}
        style={{
          width: size,
          height: teardropHeight,
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <svg
          viewBox="0 0 24 36"
          width={size}
          height={teardropHeight}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))',
          }}
        >
          <path
            fill={color}
            d="M12,0 C5.372583,0 0,5.372583 0,12 C0,21 12,36 12,36 C12,36 24,21 24,12 C24,5.372583 18.627417,0 12,0 Z"
          />
          {showInnerCircle && <circle cx="12" cy="12" r="8" fill="white" />}
        </svg>

        {/* Icon centered in the teardrop head (cx=12, cy=12 of viewBox 24x36). */}
        <div
          style={{
            position: 'absolute',
            top: teardropHeight * (12 / 36),
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: size * 0.55,
            height: size * 0.55,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          {icon}
        </div>

        {label && (
          <div
            style={{
              position: 'absolute',
              top: teardropHeight + 4,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#333',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              pointerEvents: 'none',
              textShadow: '0 0 2px white',
            }}
          >
            {label}
          </div>
        )}
      </div>
    </Marker>
  );
};
