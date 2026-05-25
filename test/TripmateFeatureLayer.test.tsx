import { render, waitFor } from '@testing-library/react';
import maplibregl from 'maplibre-gl';
import { TripmateFeatureLayer } from '../src/components/TripmateFeatureLayer';
import { VWorldMap } from '../src/components/VWorldMap';

describe('TripmateFeatureLayer', () => {
  it('renders point features with TripMate marker defaults', async () => {
    vi.clearAllMocks();
    render(
      <VWorldMap apiKey="test-key">
        <TripmateFeatureLayer
          iconBaseUrl="/maki"
          selectedFeatureId="restaurant-1"
          features={[
            {
              id: 'restaurant-1',
              kind: 'place',
              name: 'Lunch',
              category: 'restaurant',
              lngLat: [127, 37],
            },
          ]}
        />
      </VWorldMap>
    );

    await waitFor(() => expect(maplibregl.Marker).toHaveBeenCalled());
    expect(maplibregl.Marker).toHaveBeenCalledWith(
      expect.objectContaining({
        element: expect.any(HTMLDivElement),
        draggable: false,
      })
    );
  });

  it('renders route geometries as MapLibre line layers', async () => {
    vi.clearAllMocks();
    render(
      <VWorldMap apiKey="test-key">
        <TripmateFeatureLayer
          features={[
            {
              id: 'route-1',
              kind: 'route',
              category: 'route',
              geometry: {
                type: 'LineString',
                coordinates: [[127, 37], [128, 38]],
              },
            },
          ]}
        />
      </VWorldMap>
    );

    await waitFor(() => {
      const map = vi.mocked(maplibregl.Map).mock.results[0].value as any;
      expect(map.addSource).toHaveBeenCalledWith(
        'route-route-1-source',
        expect.objectContaining({ type: 'geojson' })
      );
    });
  });
});
