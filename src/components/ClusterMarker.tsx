import React from 'react';
import { Marker, MarkerProps } from './Marker';

export interface ClusterMarkerProps extends Omit<MarkerProps, 'children' | 'onClick'> {
  count: number;
  color?: string;
  size?: number;
  onClick?: () => void;
}

export const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  count,
  color,
  size,
  onClick,
  ...props
}) => {
  // Dynamic sizing and color based on count if not provided
  let clusterSize = size || 30;
  let clusterColor = color || '#51bbd6';
  
  if (count > 100) {
    clusterSize = size || 40;
    clusterColor = color || '#f1f075';
  }
  if (count > 500) {
    clusterSize = size || 50;
    clusterColor = color || '#f28cb1';
  }

  return (
    <Marker {...props}>
      <div 
        onClick={onClick}
        style={{
          width: clusterSize,
          height: clusterSize,
          backgroundColor: clusterColor,
          color: count > 100 ? '#333' : 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: clusterSize * 0.4,
          boxShadow: '0 0 0 4px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.3)',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {count > 999 ? '999+' : count}
      </div>
    </Marker>
  );
};
