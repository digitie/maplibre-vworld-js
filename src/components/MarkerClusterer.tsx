'use client';

import React, { useEffect, useMemo, useState } from 'react';
import useSupercluster from 'use-supercluster';
import { useMap } from '../store/hooks';
import { ClusterMarker } from './ClusterMarker';

export interface PointFeature {
  type: 'Feature';
  properties: {
    cluster: boolean;
    cluster_id?: number;
    point_count?: number;
    point_count_abbreviated?: string | number;
    [key: string]: any;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

/**
 * Interface representing a point to be clustered.
 */
export interface ClusterPoint {
  id: string | number;
  lngLat: [number, number];
  [key: string]: any;
}

/**
 * Props for the MarkerClusterer component.
 */
export interface MarkerClustererProps {
  /**
   * Array of point objects to be rendered or clustered.
   */
  points: ClusterPoint[];
  /**
   * Render function for an individual, unclustered marker.
   */
  renderMarker: (point: ClusterPoint) => React.ReactNode;
  /**
   * Optional render function for a cluster marker.
   * If omitted, a default circular cluster marker is used.
   * The third argument is the supercluster instance, useful for
   * `getClusterExpansionZoom(cluster_id)` inside an onClick handler.
   */
  renderCluster?: (cluster: PointFeature, pointCount: number, supercluster: any) => React.ReactNode;
  /**
   * The pixel radius for grouping markers together.
   * @default 50
   */
  radius?: number;
  /**
   * The max zoom level where markers are clustered. Beyond this, all markers dissolve.
   * @default 16
   */
  maxZoom?: number;
}

/**
 * A highly optimized component that groups nearby markers into clusters based on the current zoom level and map bounds.
 * Automatically performs Viewport Culling, meaning off-screen markers are unmounted from the DOM.
 */
export const MarkerClusterer: React.FC<MarkerClustererProps> = ({
  points,
  renderMarker,
  renderCluster,
  radius = 50, // Reduced from 75: points must be closer to cluster, so they break apart easier
  maxZoom = 16 // Reduced from 20: stop clustering entirely when zoomed past 16
}) => {
  const map = useMap();
  const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);
  const [zoom, setZoom] = useState<number>(12);

  // Update bounds and zoom when map moves
  useEffect(() => {
    if (!map) return;

    const updateBoundsAndZoom = () => {
      const mapBounds = map.getBounds();
      setBounds([
        mapBounds.getWest(),
        mapBounds.getSouth(),
        mapBounds.getEast(),
        mapBounds.getNorth()
      ]);
      setZoom(map.getZoom());
    };

    // Initial update
    updateBoundsAndZoom();

    // Listeners
    map.on('moveend', updateBoundsAndZoom);
    map.on('zoomend', updateBoundsAndZoom);

    return () => {
      map.off('moveend', updateBoundsAndZoom);
      map.off('zoomend', updateBoundsAndZoom);
    };
  }, [map]);

  // Convert raw points to GeoJSON features for supercluster. Memoized on
  // `points` identity — consumers should pass a stable / referentially-equal
  // array (typical pattern: useMemo in the parent).
  const features: PointFeature[] = useMemo(
    () =>
      points.map((point) => ({
        type: 'Feature' as const,
        properties: {
          cluster: false,
          ...point,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: point.lngLat,
        },
      })),
    [points]
  );

  const { clusters, supercluster } = useSupercluster({
    points: features,
    bounds: bounds || undefined,
    zoom,
    options: { radius, maxZoom }
  });

  if (!map) return null;

  return (
    <>
      {clusters.map((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count } = cluster.properties;

        if (isCluster) {
          if (renderCluster && supercluster) {
            return renderCluster(cluster as PointFeature, point_count || 0, supercluster);
          }
          
          // Default cluster rendering
          const clusterId = cluster.properties.cluster_id;
          if (clusterId === undefined || !supercluster) {
            return null;
          }

          return (
            <ClusterMarker
              key={`cluster-${clusterId}`}
              lngLat={[lng, lat]}
              count={point_count || 0}
              onClick={() => {
                const expansionZoom = supercluster.getClusterExpansionZoom(clusterId);
                map.flyTo({
                  center: [lng, lat],
                  zoom: expansionZoom,
                  speed: 1.5
                });
              }}
            />
          );
        }

        // Render individual marker
        return renderMarker(cluster.properties as unknown as ClusterPoint);
      })}
    </>
  );
};
