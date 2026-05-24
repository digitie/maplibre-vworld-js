import React, { useState } from 'react';
import { Marker, MarkerProps } from './Marker';
import { PinMarker } from './PinMarker';
import { useMapZoom } from './VWorldMap';

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: WeatherCondition;
}

export interface WeatherMarkerProps extends Omit<MarkerProps, 'children'> {
  temperature: number;
  condition: WeatherCondition;
  hourlyForecast?: HourlyForecast[];
  simplifyAtZoom?: number;
}

const conditionIcons: Record<WeatherCondition, string> = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧️',
  snowy: '❄️'
};

const conditionColors: Record<WeatherCondition, string> = {
  sunny: '#FFA500',
  cloudy: '#808080',
  rainy: '#4169E1',
  snowy: '#ADD8E6'
};

export const WeatherMarker: React.FC<WeatherMarkerProps> = ({
  temperature,
  condition,
  hourlyForecast,
  simplifyAtZoom,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const zoom = useMapZoom();
  
  const shouldSimplify = simplifyAtZoom !== undefined && zoom < simplifyAtZoom;
  if (shouldSimplify) {
    return <PinMarker lngLat={props.lngLat} color={conditionColors[condition]} size={24} showInnerCircle={true} />;
  }

  return (
    <Marker {...props}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Main Badge */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            if (hourlyForecast && hourlyForecast.length > 0) {
              setIsExpanded(!isExpanded);
            }
          }}
          style={{
            background: 'white',
            border: `2px solid ${conditionColors[condition]}`,
            borderRadius: '20px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: isExpanded ? '0 4px 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.2)',
            fontWeight: 'bold',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            cursor: (hourlyForecast && hourlyForecast.length > 0) ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
            transform: isExpanded ? 'scale(1.05)' : 'scale(1)',
            zIndex: isExpanded ? 10 : 1
        }}>
          <span style={{ fontSize: '16px' }}>{conditionIcons[condition]}</span>
          <span>{temperature}°C</span>
          {hourlyForecast && hourlyForecast.length > 0 && (
            <span style={{ fontSize: '10px', color: '#999', marginLeft: '2px' }}>
              {isExpanded ? '▲' : '▼'}
            </span>
          )}
        </div>

        {/* Expanded Panel */}
        {isExpanded && hourlyForecast && hourlyForecast.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            marginTop: '8px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            padding: '12px',
            display: 'flex',
            gap: '12px',
            zIndex: 10,
            cursor: 'default',
            animation: 'fadeIn 0.2s ease'
          }}>
            {/* Simple CSS animation injected for the popover */}
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            
            {hourlyForecast.map((forecast, index) => (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '40px'
              }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                  {forecast.time}
                </div>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                  {conditionIcons[forecast.condition]}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
                  {forecast.temperature}°
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </Marker>
  );
};
