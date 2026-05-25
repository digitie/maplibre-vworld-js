import React, { useMemo } from 'react';
import { PinMarker, PinMarkerProps } from './PinMarker';

export interface MakiMarkerProps extends Omit<PinMarkerProps, 'icon'> {
  iconName?: string;
  icon?: string;
  iconBaseUrl?: string;
  fallbackIcon?: string;
  iconColor?: string;
}

const DEFAULT_MAKI_ICON_BASE_URL = 'https://unpkg.com/@mapbox/maki@8.0.0/icons';

export const MakiMarker: React.FC<MakiMarkerProps> = ({
  iconName,
  icon,
  iconBaseUrl = DEFAULT_MAKI_ICON_BASE_URL,
  fallbackIcon = 'marker',
  color = '#2c3e50',
  iconColor = 'white',
  size = 40,
  ...props
}) => {
  const resolvedIcon = icon ?? iconName ?? fallbackIcon;
  const iconUrl = useMemo(() => {
    const baseUrl = iconBaseUrl.replace(/\/+$/, '');
    return `${baseUrl}/${resolvedIcon}.svg`;
  }, [iconBaseUrl, resolvedIcon]);
  const maskStyle = useMemo<React.CSSProperties>(() => ({
    width: '100%',
    height: '100%',
    backgroundColor: iconColor,
    WebkitMask: `url(${iconUrl}) no-repeat center / contain`,
    mask: `url(${iconUrl}) no-repeat center / contain`,
  }), [iconColor, iconUrl]);

  return (
    <PinMarker 
      color={color}
      size={size}
      showInnerCircle={false} // Sleek solid pin look
      icon={
        // CSS Mask to colorize the SVG dynamically without dealing with raw paths
        <div style={maskStyle} />
      } 
      {...props} 
    />
  );
};
