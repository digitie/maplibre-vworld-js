import React from 'react';
import { Marker, MarkerProps } from './Marker';
import { PinMarker } from './PinMarker';
import { useMapZoom } from './VWorldMap';

export interface SimpleMarkerProps extends Omit<MarkerProps, 'children'> {
  label: string;
  bgColor?: string;
  textColor?: string;
  simplifyAtZoom?: number;
}

export const SimpleMarker: React.FC<SimpleMarkerProps> = ({
  label,
  bgColor = '#222',
  textColor = 'white',
  simplifyAtZoom,
  ...props
}) => {
  const zoom = useMapZoom();
  const shouldSimplify = simplifyAtZoom !== undefined && zoom < simplifyAtZoom;

  if (shouldSimplify) {
    return <PinMarker lngLat={props.lngLat} color={bgColor} size={20} showInnerCircle={false} />;
  }

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
