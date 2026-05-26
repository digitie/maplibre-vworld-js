'use client';

import React, { useState } from 'react';
import { Marker, type MarkerProps } from './Marker';

export interface PriceItem {
  label?: string;
  price: string | number;
  /** Currency / unit symbol shown before the price. Falls back to the root `currency` prop. */
  currency?: string;
}

export interface PriceMarkerProps extends Omit<MarkerProps, 'children'> {
  /** Single price or an array of price items (e.g., for gas stations with multiple fuels). */
  price: string | number | PriceItem[];
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

  const isArray = Array.isArray(price);

  return (
    <Marker {...props}>
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: isHovered && isHoverable ? '#222' : 'white',
          color: isHovered && isHoverable ? 'white' : '#222',
          border: '1px solid #ddd',
          borderRadius: isArray ? '12px' : '24px',
          padding: isArray ? '8px 12px' : '6px 12px',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: isHovered && isHoverable 
            ? '0 4px 12px rgba(0,0,0,0.3)' 
            : '0 2px 6px rgba(0,0,0,0.15)',
          cursor: isHoverable ? 'pointer' : 'default',
          transition: 'all 0.2s ease-in-out',
          transform: (isHovered && isHoverable) ? 'scale(1.05)' : 'scale(1)',
          display: 'flex',
          flexDirection: isArray ? 'column' : 'row',
          alignItems: isArray ? 'stretch' : 'center',
          gap: isArray ? '4px' : '2px',
          minWidth: isArray ? '120px' : 'auto',
        }}
      >
        {isArray ? (
          (price as PriceItem[]).map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              {p.label && (
                <span style={{ 
                  color: isHovered && isHoverable ? '#aaa' : '#666', 
                  fontSize: '12px', 
                  fontWeight: 'normal' 
                }}>
                  {p.label}
                </span>
              )}
              <span>
                {p.currency !== undefined ? p.currency : currency}
                {formatPrice(p.price)}
              </span>
            </div>
          ))
        ) : (
          <>
            <span>{currency}</span>
            <span>{formatPrice(price as string | number)}</span>
          </>
        )}
      </div>
    </Marker>
  );
};
