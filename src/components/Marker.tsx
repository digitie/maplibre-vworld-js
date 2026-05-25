'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import maplibregl from 'maplibre-gl';
import { useMap } from '../store/hooks';

export interface MarkerProps {
  lngLat: [number, number];
  color?: string;
  draggable?: boolean;
  onDragEnd?: (lngLat: [number, number]) => void;
  children?: React.ReactNode;
}

export const Marker: React.FC<MarkerProps> = ({
  lngLat,
  color = '#3FB1CE',
  draggable = false,
  onDragEnd,
  children,
}) => {
  const map = useMap();
  const markerRef = useRef<maplibregl.Marker | null>(null);

  // Create a container element for the portal
  const container = useMemo(() => {
    const div = document.createElement('div');
    // Ensure the container doesn't have default pointer events that might block dragging 
    // unless necessary, but we'll leave it default for interaction.
    return div;
  }, []);

  useEffect(() => {
    if (!map) return;

    let markerOptions: maplibregl.MarkerOptions = { color, draggable };
    
    // If children are provided, use the portal container
    if (children) {
      markerOptions = { element: container, draggable };
    }

    const marker = new maplibregl.Marker(markerOptions)
      .setLngLat(lngLat)
      .addTo(map);

    if (draggable && onDragEnd) {
      marker.on('dragend', () => {
        const newLngLat = marker.getLngLat();
        onDragEnd([newLngLat.lng, newLngLat.lat]);
      });
    }

    markerRef.current = marker;

    return () => {
      marker.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, children ? container : null]); // Re-create if switching between default and custom

  // Update position if lngLat changes
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat(lngLat);
    }
  }, [lngLat]);

  // If using custom children, render them into the container using a portal
  if (children) {
    return createPortal(children, container);
  }

  return null;
};
