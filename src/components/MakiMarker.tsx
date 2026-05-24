import React from 'react';
import { PinMarker, PinMarkerProps } from './PinMarker';

export interface MakiMarkerProps extends Omit<PinMarkerProps, 'icon'> {
  iconName: string;
  iconColor?: string;
}

export const MakiMarker: React.FC<MakiMarkerProps> = ({
  iconName,
  color = '#2c3e50',
  iconColor = 'white',
  size = 40,
  ...props
}) => {
  // Use mapbox unpkg cdn for maki icons
  const iconUrl = `https://unpkg.com/@mapbox/maki@8.0.0/icons/${iconName}.svg`;

  return (
    <PinMarker 
      color={color}
      size={size}
      showInnerCircle={false} // Sleek solid pin look
      icon={
        // CSS Mask to colorize the SVG dynamically without dealing with raw paths
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: iconColor,
          WebkitMask: `url(${iconUrl}) no-repeat center / contain`,
          mask: `url(${iconUrl}) no-repeat center / contain`
        }} />
      } 
      {...props} 
    />
  );
};
