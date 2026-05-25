import { ErrorEvent, StyleSpecification } from 'maplibre-gl';
export type VWorldLayerType = 'Base' | 'gray' | 'midnight' | 'Hybrid' | 'Satellite';
export type VWorldMapResourceError = Error & {
    status?: number;
    statusText?: string;
    url?: string;
};
export declare function getVWorldTileUrl(apiKey: string, layerType: VWorldLayerType): string;
export declare function getVWorldMaxZoom(layerType: VWorldLayerType): number;
export declare function getVWorldStyle(apiKey: string, layerType: VWorldLayerType): StyleSpecification;
export declare function isVWorldTileError(event: ErrorEvent): boolean;
export declare function redactVWorldTileUrl(url: string | undefined): string | undefined;
