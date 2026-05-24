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
  coordinates: [number, number][];
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
}

/**
 * Draws a GeoJSON LineString on the map connecting the provided coordinates.
 * Safe to use with dynamic toggling and respects MapLibre's asynchronous style loading.
 */
export const RouteLine: React.FC<RouteLineProps> = ({
  id = 'route-line',
  coordinates,
  color = '#2196F3',
  lineWidth = 4,
  lineDasharray
}) => {
  const { map } = useMap();
  const sourceId = `${id}-source`;
  const layerId = `${id}-layer`;

  useEffect(() => {
    if (!map) return;

    const addOrUpdateLayer = () => {
      // Validate style exists
      if (!map.getStyle()) return;

      const data: GeoJSON.Feature<GeoJSON.LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      };

      const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;

      if (source) {
        source.setData(data);
      } else {
        map.addSource(sourceId, {
          type: 'geojson',
          data
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
  }, [map, JSON.stringify(coordinates), color, lineWidth, JSON.stringify(lineDasharray), sourceId, layerId]);

  return null;
};
