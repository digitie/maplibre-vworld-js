import React, { useEffect } from 'react';
import { useMap } from './VWorldMap';

/**
 * Props for the RouteLine component.
 */
export interface RouteLineProps {
  /**
   * Unique identifier for the route line. Used as the MapLibre layer and source ID prefix.
   */
  id?: string;
  /**
   * Array of coordinates [longitude, latitude] that form the line.
   * MUST be memoized or defined outside the component to prevent infinite re-renders.
   */
  coordinates?: [number, number][];
  /**
   * GeoJSON data for the route (Feature, FeatureCollection, or URL).
   * If provided, overrides `coordinates`.
   */
  data?: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString> | GeoJSON.FeatureCollection<GeoJSON.LineString | GeoJSON.MultiLineString> | string;
  /**
   * Hex color for the line.
   * @default '#2196F3'
   */
  color?: string;
  /**
   * Width of the line in pixels.
   * @default 4
   */
  lineWidth?: number;
  /**
   * Array of numbers specifying the dash pattern (e.g. [4, 4] for 4px dash, 4px gap).
   * Leave undefined for a solid line.
   */
  lineDasharray?: number[];
  /**
   * Fired when the line is clicked.
   */
  onClick?: (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => void;
  /**
   * Fired when the mouse enters the line.
   */
  onMouseEnter?: (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => void;
  /**
   * Fired when the mouse leaves the line.
   */
  onMouseLeave?: (e: maplibregl.MapMouseEvent) => void;
}

/**
 * Draws a GeoJSON LineString on the map connecting the provided coordinates.
 * Safe to use with dynamic toggling and respects MapLibre's asynchronous style loading.
 */
export const RouteLine: React.FC<RouteLineProps> = ({
  id = 'route-line',
  coordinates,
  data,
  color = '#2196F3',
  lineWidth = 4,
  lineDasharray,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const { map } = useMap();
  const sourceId = `${id}-source`;
  const layerId = `${id}-layer`;

  useEffect(() => {
    if (!map) return;

    const addOrUpdateLayer = () => {
      // Validate style exists
      if (!map.getStyle()) return;

      let sourceData: any = data;

      if (!sourceData && coordinates) {
        sourceData = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates
          }
        };
      }

      if (!sourceData) return;

      const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;

      if (source) {
        if (typeof sourceData !== 'string') {
          source.setData(sourceData);
        }
      } else {
        map.addSource(sourceId, {
          type: 'geojson',
          data: sourceData
        });
      }

      if (!map.getLayer(layerId)) {
        console.log(`Adding layer ${layerId} with dasharray:`, lineDasharray);
        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': color,
            'line-width': lineWidth,
            ...(lineDasharray ? { 'line-dasharray': lineDasharray } : {})
          }
        });
      } else {
        // Update paint properties if they changed
        map.setPaintProperty(layerId, 'line-color', color);
        map.setPaintProperty(layerId, 'line-width', lineWidth);
        if (lineDasharray) {
          map.setPaintProperty(layerId, 'line-dasharray', lineDasharray);
        }
      }
    };

    // Attempt to add immediately
    addOrUpdateLayer();

    // Re-add if the style changes (e.g. from Base to Satellite)
    // 'styledata' event fires when the style is updated or loaded
    map.on('styledata', addOrUpdateLayer);

    return () => {
      console.log(`Removing layer ${layerId}`);
      map.off('styledata', addOrUpdateLayer);
      if (map.getStyle()) {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, JSON.stringify(coordinates), JSON.stringify(data), color, lineWidth, JSON.stringify(lineDasharray), sourceId, layerId]);

  // Event Listeners
  useEffect(() => {
    if (!map) return;

    const clickHandler = (e: any) => {
      if (onClick) onClick(e);
    };

    const mouseEnterHandler = (e: any) => {
      map.getCanvas().style.cursor = 'pointer';
      if (onMouseEnter) onMouseEnter(e);
    };

    const mouseLeaveHandler = (e: any) => {
      map.getCanvas().style.cursor = '';
      if (onMouseLeave) onMouseLeave(e);
    };

    map.on('click', layerId, clickHandler);
    map.on('mouseenter', layerId, mouseEnterHandler);
    map.on('mouseleave', layerId, mouseLeaveHandler);

    return () => {
      map.off('click', layerId, clickHandler);
      map.off('mouseenter', layerId, mouseEnterHandler);
      map.off('mouseleave', layerId, mouseLeaveHandler);
    };
  }, [map, layerId, onClick, onMouseEnter, onMouseLeave]);

  return null;
};
