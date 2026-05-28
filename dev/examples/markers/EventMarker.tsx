import React from 'react';
import { Marker, type MarkerProps } from '../../../src';

export interface EventMarkerProps extends Omit<MarkerProps, 'children'> {
  eventName: string;
  endDate: string;
  isPremium?: boolean;
}

/**
 * Example of a Consumer Domain Marker (T-037).
 * This component wraps the primitive `Marker` from the library
 * to inject consumer-specific logic and styling.
 */
export const EventMarker: React.FC<EventMarkerProps> = ({
  eventName,
  endDate,
  isPremium,
  lngLat,
  ...rest
}) => {
  return (
    <Marker
      lngLat={lngLat}
      title={eventName}
      description={`Valid until: ${endDate}`}
      {...rest}
    >
      <div
        style={{
          padding: '4px 8px',
          backgroundColor: isPremium ? '#FFD700' : '#4CAF50',
          color: isPremium ? '#000' : '#FFF',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '12px',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          cursor: 'pointer',
        }}
      >
        🎉 Event
      </div>
    </Marker>
  );
};
