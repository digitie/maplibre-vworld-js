import { default as React } from 'react';
import { MarkerProps } from './Marker';
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
export declare const WeatherMarker: React.FC<WeatherMarkerProps>;
