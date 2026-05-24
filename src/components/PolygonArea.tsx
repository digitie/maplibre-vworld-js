import React, { useEffect } from 'react';
import { useMap } from './VWorldMap';

/**
 * Props for the PolygonArea component.
 */
export interface PolygonAreaProps {
  /**
   * Unique identifier for the area. Used as the MapLibre layer and source ID prefix.
   */
  id: string;
  /**
   * GeoJSON data for the area (Feature, FeatureCollection, or URL).
   * Usually a Polygon or MultiPolygon.
   */
  data: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon> | string;
  /**
   * Fill color of the area.
   * @default 'rgba(33, 150, 243, 0.4)'
   */
  fillColor?: string;
  /**
   * Outline color of the area.
   * @default '#2196F3'
   */
  outlineColor?: string;
  /**
   * Outline width in pixels.
   * @default 2
   */
  outlineWidth?: number;
  /**
   * Fired when the area is clicked.
   */
  onClick?: (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => void;
  /**
   * Fired when the mouse enters the area.
   */
  onMouseEnter?: (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => void;
  /**
   * Fired when the mouse leaves the area.
   */
  onMouseLeave?: (e: maplibregl.MapMouseEvent) => void;
}

/**
 * Draws a GeoJSON Polygon or MultiPolygon on the map.
 * Useful for displaying national parks, administrative boundaries, etc.
 */
export const PolygonArea: React.FC<PolygonAreaProps> = ({
  id,
  data,
  fillColor = 'rgba(33, 150, 243, 0.4)',
  outlineColor = '#2196F3',
  outlineWidth = 2,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const { map } = useMap();
  const sourceId = `${id}-source`;
  const fillLayerId = `${id}-fill-layer`;
  const lineLayerId = `${id}-line-layer`;

  useEffect(() => {
    if (!map) return;

    const addOrUpdateLayer = () => {
      if (!map.getStyle()) return;

      const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;

      if (source) {
        if (typeof data !== 'string') {
          source.setData(data as GeoJSON.Feature | GeoJSON.FeatureCollection);
        }
      } else {
        map.addSource(sourceId, {
          type: 'geojson',
          data
        });
      }

      // Add Fill Layer
      if (!map.getLayer(fillLayerId)) {
        map.addLayer({
          id: fillLayerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': fillColor,
            // Only apply opacity if fillColor doesn't have alpha, but MapLibre handles rgba automatically.
          }
        });
      } else {
        map.setPaintProperty(fillLayerId, 'fill-color', fillColor);
      }

      // Add Outline Layer
      if (!map.getLayer(lineLayerId)) {
        map.addLayer({
          id: lineLayerId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': outlineColor,
            'line-width': outlineWidth
          }
        });
      } else {
        map.setPaintProperty(lineLayerId, 'line-color', outlineColor);
        map.setPaintProperty(lineLayerId, 'line-width', outlineWidth);
      }
    };

    addOrUpdateLayer();
    map.on('styledata', addOrUpdateLayer);

    return () => {
      map.off('styledata', addOrUpdateLayer);
      if (map.getStyle()) {
        if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
        if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, JSON.stringify(data), fillColor, outlineColor, outlineWidth, sourceId, fillLayerId, lineLayerId]);

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

    // We only attach events to the fill layer since it covers the entire area
    map.on('click', fillLayerId, clickHandler);
    map.on('mouseenter', fillLayerId, mouseEnterHandler);
    map.on('mouseleave', fillLayerId, mouseLeaveHandler);

    return () => {
      map.off('click', fillLayerId, clickHandler);
      map.off('mouseenter', fillLayerId, mouseEnterHandler);
      map.off('mouseleave', fillLayerId, mouseLeaveHandler);
    };
  }, [map, fillLayerId, onClick, onMouseEnter, onMouseLeave]);

  return null;
};
