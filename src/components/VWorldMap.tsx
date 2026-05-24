import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getVWorldStyle, VWorldLayerType } from '../vworld';

/**
 * Props for the VWorldMap component.
 */
export interface VWorldMapProps {
  /** 
   * VWorld API Key for authentication. 
   * @required 
   */
  apiKey: string;
  /** 
   * Type of the map layer to render. 
   * @default 'Base' 
   */
  layerType?: VWorldLayerType;
  /** 
   * Initial center coordinates of the map [longitude, latitude].
   * @default [127.024612, 37.532600] 
   */
  center?: [number, number];
  /** 
   * Initial zoom level of the map. 
   * @default 12 
   */
  zoom?: number;
  /** 
   * Minimum zoom level allowed. 
   * @default 6 
   */
  minZoom?: number;
  /** 
   * Maximum zoom level allowed. 
   * @default 19 
   */
  maxZoom?: number;
  /** 
   * Show navigation controls (zoom in/out, compass). 
   * @default true 
   */
  showNavigationControl?: boolean;
  /** 
   * Show geolocate control to track user's current location. 
   * @default true 
   */
  showGeolocateControl?: boolean;
  /** 
   * Show the scale bar control on the bottom right. 
   * @default true 
   */
  showScaleControl?: boolean;
  /** 
   * Custom CSS class name for the map container. 
   */
  className?: string;
  /** 
   * Custom CSS styles for the map container. 
   * @default { width: '100%', height: '100%' } 
   */
  style?: React.CSSProperties;
  /** 
   * Child elements such as Markers, Clusters, and Lines. 
   */
  children?: React.ReactNode;
  /** 
   * Callback fired when the map is fully loaded. 
   */
  onMapLoad?: (map: maplibregl.Map) => void;
  /**
   * A callback run before the Map makes a request for an external URL. 
   * Useful for handling CORS, adding authentication headers, or rewriting URLs to a proxy server.
   */
  transformRequest?: maplibregl.RequestTransformFunction;
}

interface MapContextType {
  map: maplibregl.Map | null;
}

const MapContext = createContext<MapContextType>({ map: null });

export const useMap = () => useContext(MapContext);

/**
 * The base map component that initializes MapLibre GL JS with VWorld maps.
 * It provides a MapContext to all child components.
 * 
 * @example
 * <VWorldMap apiKey="YOUR_KEY">
 *   <Marker lngLat={[127.0, 37.0]} />
 * </VWorldMap>
 */
export const VWorldMap: React.FC<VWorldMapProps> = ({
  apiKey,
  layerType = 'Base',
  center = [127.024612, 37.532600], // Default center (Seoul)
  zoom = 12,
  minZoom = 6,
  maxZoom = 19,
  showNavigationControl = true,
  showGeolocateControl = true,
  showScaleControl = true,
  className = '',
  style = { width: '100%', height: '100%' },
  children,
  onMapLoad,
  transformRequest,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const effectiveMaxZoom = Math.min(maxZoom, 16);

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getVWorldStyle(apiKey, layerType),
      center,
      zoom,
      minZoom,
      maxZoom: effectiveMaxZoom,
      attributionControl: true,
      transformRequest,
    });

    mapRef.current = map;
    (window as any).vworldMap = map;

    if (showNavigationControl) {
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    }

    if (showGeolocateControl) {
      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        }),
        'top-right'
      );
    }

    if (showScaleControl) {
      map.addControl(
        new maplibregl.ScaleControl({
          maxWidth: 150,
          unit: 'metric',
        }),
        'bottom-right'
      );
    }

    map.on('load', () => {
      setMapLoaded(true);
      if (onMapLoad) {
        onMapLoad(map);
      }
    });

    // Handle resize for mobile responsiveness
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initialize only once

  // Update style when layerType or apiKey changes
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      mapRef.current.setStyle(getVWorldStyle(apiKey, layerType));
    }
  }, [apiKey, layerType, mapLoaded]);

  // Update center and zoom
  const prevCenter = useRef(center);
  const prevZoom = useRef(zoom);

  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      const centerChanged = center && (!prevCenter.current || prevCenter.current[0] !== center[0] || prevCenter.current[1] !== center[1]);
      const zoomChanged = zoom !== undefined && prevZoom.current !== zoom;

      if (centerChanged || zoomChanged) {
        mapRef.current.flyTo({ center, zoom });
      }

      prevCenter.current = center;
      prevZoom.current = zoom;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, zoom]);

  // Update minZoom and maxZoom dynamically
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      if (minZoom !== undefined) mapRef.current.setMinZoom(minZoom);
      if (maxZoom !== undefined) mapRef.current.setMaxZoom(Math.min(maxZoom, 16));
    }
  }, [minZoom, maxZoom, mapLoaded]);

  return (
    <MapContext.Provider value={{ map: mapRef.current }}>
      <div ref={mapContainerRef} className={className} style={style} data-testid="vworld-map-container" />
      {mapLoaded && children}
    </MapContext.Provider>
  );
};
