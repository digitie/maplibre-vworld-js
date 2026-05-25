import { StyleSpecification } from 'maplibre-gl';
export type VWorldLayerType = 'Base' | 'gray' | 'midnight' | 'Hybrid' | 'Satellite';
export declare function getVWorldTileUrl(apiKey: string, layerType: VWorldLayerType): string;
export declare function getVWorldMaxZoom(layerType: VWorldLayerType): number;
/**
 * Replace the API-key segment of a VWorld WMTS tile URL with `***` so the URL
 * can be safely logged, shown in error banners, or sent to monitoring.
 *
 * The VWorld WMTS path format is:
 *   `https://api.vworld.kr/req/wmts/1.0.0/{key}/{layer}/{z}/{y}/{x}.{ext}`
 *
 * This function returns the input unchanged if the path does not look like a
 * VWorld WMTS URL, so it is safe to call on arbitrary error strings.
 */
export declare function redactVWorldUrl(url: string): string;
export declare function getVWorldStyle(apiKey: string, layerType: VWorldLayerType): StyleSpecification;
