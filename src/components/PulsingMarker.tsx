import React from 'react';
import { Marker, MarkerProps } from './Marker';

export interface PulsingMarkerProps extends Omit<MarkerProps, 'children'> {
  color?: string;
  size?: number;
}

export const PulsingMarker: React.FC<PulsingMarkerProps> = ({
  color = '#4285F4',
  size = 14,
  ...props
}) => {
  return (
    <Marker {...props}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Core Dot */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: color,
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          zIndex: 2,
          boxSizing: 'border-box'
        }} />
        
        {/* Pulsing Ring */}
        <div style={{
          position: 'absolute',
          top: '-100%', left: '-100%',
          width: '300%', height: '300%',
          backgroundColor: color,
          borderRadius: '50%',
          zIndex: 1,
          animation: 'pulsing-ripple 2s infinite ease-out'
        }} />

        <style>{`
          @keyframes pulsing-ripple {
            0% {
              transform: scale(0.3);
              opacity: 0.8;
            }
            80% {
              transform: scale(1);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </Marker>
  );
};
