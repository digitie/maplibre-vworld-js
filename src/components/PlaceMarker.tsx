import React from 'react';
import { Marker, MarkerProps } from './Marker';

export interface PlaceMarkerProps extends Omit<MarkerProps, 'children'> {
  title: string;
  description: string;
  category: string;
  photoUrl?: string;
  link?: string;
}

export const PlaceMarker: React.FC<PlaceMarkerProps> = ({
  title,
  description,
  category,
  photoUrl,
  link,
  ...props
}) => {
  return (
    <Marker {...props}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        width: '200px',
        fontFamily: 'sans-serif',
        cursor: 'default',
        transform: 'translate(-50%, -100%)', // align bottom center to lngLat
        marginTop: '-10px' // small offset
      }}>
        {/* Custom arrow pointing down */}
        <div style={{
          position: 'absolute',
          bottom: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '8px 8px 0',
          borderStyle: 'solid',
          borderColor: 'white transparent transparent transparent',
          display: 'block',
          width: 0,
        }} />
        
        {photoUrl && (
          <img src={photoUrl} alt={title} style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }} />
        )}
        <div style={{ padding: '12px' }}>
          <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            {category}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>
            {title}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', lineHeight: '1.4' }}>
            {description}
          </div>
          {link && (
            <a href={link} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}>
              더 보기 →
            </a>
          )}
        </div>
      </div>
    </Marker>
  );
};
