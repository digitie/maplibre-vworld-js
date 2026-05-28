import React from 'react';
import { Marker, type MarkerProps } from '../../../src';

export interface NoticeMarkerProps extends Omit<MarkerProps, 'children'> {
  urgency: 'low' | 'high';
  message: string;
}

/**
 * Example of a Consumer Domain Marker (T-037).
 * This component demonstrates using `imageUrl` and tooltips.
 */
export const NoticeMarker: React.FC<NoticeMarkerProps> = ({
  urgency,
  message,
  lngLat,
  ...rest
}) => {
  return (
    <Marker
      lngLat={lngLat}
      title={urgency === 'high' ? '🚨 Urgent Notice' : 'ℹ️ Notice'}
      description={message}
      {...rest}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          backgroundColor: urgency === 'high' ? '#f44336' : '#2196F3',
          color: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        !
      </div>
    </Marker>
  );
};
