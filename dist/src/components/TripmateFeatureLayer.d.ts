import { default as React } from 'react';
import { WeatherCondition } from './WeatherMarker';
export type TripmateFeatureKind = 'place' | 'event' | 'notice' | 'price' | 'weather' | 'route' | 'area';
export interface TripmateFeatureLike {
    id: string | number;
    kind: TripmateFeatureKind;
    name?: string;
    category?: string | null;
    lngLat?: [number, number];
    coord?: [number, number];
    centroidLngLat?: [number, number];
    markerColor?: string | null;
    markerIcon?: string | null;
    geometry?: GeoJSON.Geometry;
    routeCoordinates?: [number, number][];
    price?: string | number | null;
    currency?: string;
    weather?: {
        temperature: number;
        condition: WeatherCondition;
    } | null;
}
export interface TripmateFeatureLayerProps<TFeature extends TripmateFeatureLike = TripmateFeatureLike> {
    features: TFeature[];
    iconBaseUrl?: string;
    selectedFeatureId?: string | number | null;
    highlightedFeatureId?: string | number | null;
    renderFeature?: (feature: TFeature) => React.ReactNode;
    onFeatureClick?: (feature: TFeature, event: MouseEvent) => void;
    onFeatureContextMenu?: (feature: TFeature, event: MouseEvent) => void;
}
export declare const TripmateFeatureLayer: <TFeature extends TripmateFeatureLike>({ features, iconBaseUrl, selectedFeatureId, highlightedFeatureId, renderFeature, onFeatureClick, onFeatureContextMenu, }: TripmateFeatureLayerProps<TFeature>) => import("react/jsx-runtime").JSX.Element;
