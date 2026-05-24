import React from 'react';
import { Marker, MarkerProps } from './Marker';

export interface SimpleMarkerProps extends Omit<MarkerProps, 'children'> {
  label: string;
  bgColor?: string;
  textColor?: string;
}

export const SimpleMarker: React.FC<SimpleMarkerProps> = ({
  label,
  bgColor = '#222',
  textColor = 'white',
  ...props
}) => {
  return (
    <Marker {...props}>
      <div style={{
        background: bgColor,
        color: textColor,
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        pointerEvents: 'none'
      }}>
        {label}
      </div>
    </Marker>
  );
};
