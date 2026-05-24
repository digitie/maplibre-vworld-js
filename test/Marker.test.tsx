import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Marker } from '../src/components/Marker';
import { VWorldMap } from '../src/components/VWorldMap';
import maplibregl from 'maplibre-gl';

describe('Marker', () => {
  it('creates and adds a marker to the map', async () => {
    render(
      <VWorldMap apiKey="test-key">
        <Marker lngLat={[127, 37]} />
      </VWorldMap>
    );
    
    await waitFor(() => {
      expect(maplibregl.Marker).toHaveBeenCalledWith({
        color: '#3FB1CE',
        draggable: false,
      });
    });
  });

  it('supports custom child elements', async () => {
    render(
      <VWorldMap apiKey="test-key">
        <Marker lngLat={[127, 37]}>
          <div data-testid="custom-marker">Hello</div>
        </Marker>
      </VWorldMap>
    );
    
    await waitFor(() => {
      // It creates an HTML element to pass to Marker options
      expect(maplibregl.Marker).toHaveBeenCalledWith(expect.objectContaining({
        element: expect.any(HTMLDivElement),
        draggable: false,
      }));
    });
  });
});
