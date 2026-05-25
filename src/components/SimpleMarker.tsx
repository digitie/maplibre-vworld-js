'use client';

import React, { useCallback } from 'react';
import { Marker, MarkerProps } from './Marker';
import { PinMarker } from './PinMarker';
import { useMapSelector } from '../store/hooks';

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
  // Selector computes the boolean directly — the component re-renders only
  // when crossing the threshold, NOT on every zoomend. With N markers and M
  // zoom events, this is N*M wasted renders avoided.
  const shouldSimplify = useMapSelector(
    useCallback(
      (s) => {
        const threshold = simplifyAtZoom ?? s.semanticZoomThreshold;
        return threshold !== undefined && s.zoom < threshold;
      },
      [simplifyAtZoom]
    )
  );

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
