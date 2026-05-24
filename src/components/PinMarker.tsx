import React from 'react';
import { Marker, MarkerProps } from './Marker';

export interface PinMarkerProps extends Omit<MarkerProps, 'children'> {
  color?: string;
  icon?: React.ReactNode;
  size?: number;
  showInnerCircle?: boolean;
  label?: string;
  tooltip?: string;
}

export const PinMarker: React.FC<PinMarkerProps> = ({
  color = '#DB4437',
  icon,
  size = 40, // Increased default size so it's easier to see
  showInnerCircle = true,
  label,
  tooltip,
  ...props
}) => {
  return (
    <Marker {...props}>
      <div 
        title={tooltip}
        style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transform: 'translate(-50%, -100%)', // Anchor at bottom center
        marginTop: size / 2, // offset for anchor
      }}>
        {/* SVG Teardrop shape */}
        <svg
          viewBox="0 0 24 36"
          width={size}
          height={size * 1.5}
          style={{ position: 'absolute', top: 0, left: 0, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }}
        >
          <path
            fill={color}
            d="M12,0 C5.372583,0 0,5.372583 0,12 C0,21 12,36 12,36 C12,36 24,21 24,12 C24,5.372583 18.627417,0 12,0 Z"
          />
          {/* Inner white circle for icon */}
          {showInnerCircle && <circle cx="12" cy="12" r="8" fill="white" />}
        </svg>

        {/* Icon container */}
        <div style={{
          position: 'absolute',
          top: size * 1.5 * (12 / 36), // Center of the teardrop's top circle
          left: '50%',
          transform: 'translate(-50%, -50%)', // Perfectly center the icon itself
          width: size * 0.55, // Increased size significantly (about 1.5x larger relative to previous proportion)
          height: size * 0.55,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}>
          {icon}
        </div>

        {/* Label below the pin */}
        {label && (
          <div style={{
            position: 'absolute',
            top: size * 1.5 + 4, // Just below the bottom tip of the pin
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
            textShadow: '0 0 2px white'
          }}>
            {label}
          </div>
        )}
      </div>
    </Marker>
  );
};
