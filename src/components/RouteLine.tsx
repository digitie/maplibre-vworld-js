'use client';

import React, { useEffect, useMemo } from 'react';
import type maplibregl from 'maplibre-gl';
import { useMap, useEvent } from '../store/hooks';

type FeatureMouseEvent = maplibregl.MapMouseEvent & {
  features?: maplibregl.MapGeoJSONFeature[];
};

export interface RouteLineProps {
  /** Unique ID — prefixes the MapLibre source and layer IDs. */
  id?: string;
  /**
   * Polyline coordinates as `[longitude, latitude]` tuples. Must be
   * referentially stable: reference changes trigger a `setData` call.
   */
  coordinates: [number, number][];
  /** @default '#2196F3' */
  color?: string;
  /** Width in pixels. @default 4 */
  width?: number;
  /** Dash pattern, e.g. `[4, 4]` for 4-on / 4-off. */
  dashArray?: number[];
  onClick?: (event: FeatureMouseEvent) => void;
  onMouseEnter?: (event: FeatureMouseEvent) => void;
  onMouseLeave?: (event: maplibregl.MapMouseEvent) => void;
}

/**
 * Renders a polyline as a MapLibre line layer, persisting across style
 * swaps. For multi-line or already-built GeoJSON, drop down to the raw
 * MapLibre API via {@link useMap}.
 */
export const RouteLine: React.FC<RouteLineProps> = ({
  id = 'route-line',
  coordinates,
  color = '#2196F3',
  width = 4,
  dashArray,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const map = useMap();
  const sourceId = `${id}-source`;
  const layerId = `${id}-layer`;

  const stableOnClick = useEvent(onClick);
  const stableOnMouseEnter = useEvent(onMouseEnter);
  const stableOnMouseLeave = useEvent(onMouseLeave);

  // Build the Feature once per coordinates reference. Consumers that mutate
  // an array in place will not see updates — this is intentional, matching
  // how React props work everywhere else.
  const feature = useMemo<GeoJSON.Feature<GeoJSON.LineString>>(
    () => ({
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates },
    }),
    [coordinates],
  );

  useEffect(() => {
    if (!map) return;

    const addOrUpdate = () => {
      if (!map.getStyle()) return;

      const source = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
      if (source) {
        source.setData(feature);
      } else {
        map.addSource(sourceId, { type: 'geojson', data: feature });
      }

      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': color,
            'line-width': width,
            ...(dashArray ? { 'line-dasharray': dashArray } : {}),
          },
        });
      } else {
        map.setPaintProperty(layerId, 'line-color', color);
        map.setPaintProperty(layerId, 'line-width', width);
        map.setPaintProperty(layerId, 'line-dasharray', dashArray);
      }
    };

    addOrUpdate();
    map.on('styledata', addOrUpdate);

    return () => {
      map.off('styledata', addOrUpdate);
      if (!map.getStyle()) return;
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, feature, color, width, dashArray, sourceId, layerId]);

  useEffect(() => {
    if (!map) return;

    const handleClick = (event: FeatureMouseEvent) => stableOnClick(event);
    const handleEnter = (event: FeatureMouseEvent) => {
      if (onMouseEnter || onClick) map.getCanvas().style.cursor = 'pointer';
      stableOnMouseEnter(event);
    };
    const handleLeave = (event: maplibregl.MapMouseEvent) => {
      map.getCanvas().style.cursor = '';
      stableOnMouseLeave(event);
    };

    map.on('click', layerId, handleClick);
    map.on('mouseenter', layerId, handleEnter);
    map.on('mouseleave', layerId, handleLeave);

    return () => {
      map.off('click', layerId, handleClick);
      map.off('mouseenter', layerId, handleEnter);
      map.off('mouseleave', layerId, handleLeave);
    };
  }, [map, layerId, onClick, onMouseEnter, stableOnClick, stableOnMouseEnter, stableOnMouseLeave]);

  return null;
};
