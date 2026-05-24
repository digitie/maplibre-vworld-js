import { StyleSpecification } from 'maplibre-gl';
export type VWorldLayerType = 'Base' | 'gray' | 'midnight' | 'Hybrid' | 'Satellite';
export declare function getVWorldTileUrl(apiKey: string, layerType: VWorldLayerType): string;
export declare function getVWorldMaxZoom(layerType: VWorldLayerType): number;
export declare function getVWorldStyle(apiKey: string, layerType: VWorldLayerType): StyleSpecification;
