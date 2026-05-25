import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getVWorldMaxZoom, getVWorldStyle, VWorldLayerType } from '../vworld';

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
   * Maximum bounds of the map (restrict panning outside this box).
   * Format: [[minLng, minLat], [maxLng, maxLat]]
   */
  maxBounds?: maplibregl.LngLatBoundsLike;
  /**
   * Global threshold for semantic zoom. 
   * Markers can use this to simplify themselves when the map is zoomed out below this value.
   */
  semanticZoomThreshold?: number;
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
   * Callback fired when the user clicks the map canvas.
   */
  onMapClick?: (event: maplibregl.MapMouseEvent) => void;
  /**
   * Callback fired for MapLibre error events.
   */
  onMapError?: (event: maplibregl.ErrorEvent) => void;
  /**
   * Additional options used when center or zoom props change and the map calls `flyTo`.
   * The `center` and `zoom` values always come from the corresponding props.
   */
  flyToOptions?: Omit<maplibregl.FlyToOptions, 'center' | 'zoom'>;
  /**
   * A callback run before the Map makes a request for an external URL. 
   * Useful for handling CORS, adding authentication headers, or rewriting URLs to a proxy server.
   */
  transformRequest?: maplibregl.RequestTransformFunction;
}

interface MapContextType {
  map: maplibregl.Map | null;
  zoom: number;
  semanticZoomThreshold?: number;
}

const MapContext = createContext<MapContextType>({ map: null, zoom: 12 });

export const useMap = () => useContext(MapContext);

/**
 * Custom hook to get the full map context, including global semantic zoom threshold.
 */
export const useMapContext = () => {
  return useContext(MapContext);
};

/**
 * Custom hook to get the current map zoom level.
 * Useful for semantic zooming (e.g. degrading marker quality at low zooms).
 */
export const useMapZoom = () => {
  return useContext(MapContext).zoom;
};

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
  maxBounds,
  semanticZoomThreshold,
  showNavigationControl = true,
  showGeolocateControl = true,
  showScaleControl = true,
  className = '',
  style = { width: '100%', height: '100%' },
  children,
  onMapLoad,
  onMapClick,
  onMapError,
  flyToOptions,
  transformRequest,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const onMapClickRef = useRef(onMapClick);
  const onMapErrorRef = useRef(onMapError);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  useEffect(() => {
    onMapErrorRef.current = onMapError;
  }, [onMapError]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const effectiveMaxZoom = Math.min(maxZoom, getVWorldMaxZoom(layerType));

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getVWorldStyle(apiKey, layerType),
      center,
      zoom,
      minZoom,
      maxZoom: effectiveMaxZoom,
      maxBounds,
      transformRequest,
    });

    mapRef.current = map;

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

    const handleLoad = () => {
      setMapLoaded(true);
      setCurrentZoom(map.getZoom());
      if (onMapLoad) {
        onMapLoad(map);
      }
    };
    const handleZoomEnd = () => {
      setCurrentZoom(map.getZoom());
    };
    const handleClick = (event: maplibregl.MapMouseEvent) => {
      onMapClickRef.current?.(event);
    };
    const handleError = (event: maplibregl.ErrorEvent) => {
      onMapErrorRef.current?.(event);
    };

    map.on('load', handleLoad);
    map.on('zoomend', handleZoomEnd);
    map.on('click', handleClick);
    map.on('error', handleError);

    // Handle resize for mobile responsiveness
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.off('error', handleError);
      map.off('click', handleClick);
      map.off('zoomend', handleZoomEnd);
      map.off('load', handleLoad);
      map.remove();
      mapRef.current = null;
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
        mapRef.current.flyTo({ ...flyToOptions, center, zoom });
      }

      prevCenter.current = center;
      prevZoom.current = zoom;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, zoom, flyToOptions]);

  // Update minZoom, maxZoom, and maxBounds dynamically
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      if (minZoom !== undefined) mapRef.current.setMinZoom(minZoom);
      if (maxZoom !== undefined) mapRef.current.setMaxZoom(Math.min(maxZoom, getVWorldMaxZoom(layerType)));
      if (maxBounds !== undefined) mapRef.current.setMaxBounds(maxBounds);
    }
  }, [layerType, minZoom, maxZoom, maxBounds, mapLoaded]);

  return (
    <MapContext.Provider value={{ map: mapRef.current, zoom: currentZoom, semanticZoomThreshold }}>
      <div ref={mapContainerRef} className={className} style={style} data-testid="vworld-map-container" />
      {mapLoaded && children}
    </MapContext.Provider>
  );
};
