'use client';

import React, { useState } from 'react';
import { Marker, type MarkerProps } from './Marker';

export interface PriceMarkerProps extends Omit<MarkerProps, 'children'> {
  price: string | number;
  /** Currency / unit symbol shown before the price. @default '' */
  currency?: string;
  /** Apply hover styling. @default true */
  isHoverable?: boolean;
}

/**
 * Airbnb-style price chip marker.
 */
export const PriceMarker: React.FC<PriceMarkerProps> = ({
  price,
  currency = '',
  isHoverable = true,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (p: string | number) => {
    if (typeof p === 'number') return p.toLocaleString();
    return p;
  };

  return (
    <Marker {...props}>
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: isHovered && isHoverable ? '#222' : 'white',
          color: isHovered && isHoverable ? 'white' : '#222',
          border: '1px solid #ddd',
          borderRadius: '24px',
          padding: '6px 12px',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: isHovered && isHoverable 
            ? '0 4px 12px rgba(0,0,0,0.3)' 
            : '0 2px 6px rgba(0,0,0,0.15)',
          cursor: isHoverable ? 'pointer' : 'default',
          transition: 'all 0.2s ease-in-out',
          transform: (isHovered && isHoverable) ? 'scale(1.05)' : 'scale(1)',
          display: 'flex',
          alignItems: 'center',
          gap: '2px'
        }}
      >
        <span>{currency}</span>
        <span>{formatPrice(price)}</span>
      </div>
    </Marker>
  );
};
