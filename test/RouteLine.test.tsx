import { render, waitFor } from '@testing-library/react';
import maplibregl from 'maplibre-gl';
import { RouteLine } from '../src/components/RouteLine';
import { VWorldMap } from '../src/components/VWorldMap';

type MapMockInstance = maplibregl.Map & {
  addLayer: ReturnType<typeof vi.fn>;
  getLayer: ReturnType<typeof vi.fn>;
  setPaintProperty: ReturnType<typeof vi.fn>;
};

function latestMapMock(): MapMockInstance {
  const results = vi.mocked(maplibregl.Map).mock.results;
  return results[results.length - 1]?.value as unknown as MapMockInstance;
}

const coordinates: [number, number][] = [[127, 37], [128, 38]];

describe('RouteLine', () => {
  it('clears a previous dashArray when the prop is removed', async () => {
    vi.clearAllMocks();
    const { rerender } = render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <RouteLine id="test-route" coordinates={coordinates} dashArray={[4, 4]} />
      </VWorldMap>,
    );

    const map = latestMapMock();
    await waitFor(() => expect(map.addLayer).toHaveBeenCalled());
    map.getLayer.mockReturnValue({});

    rerender(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <RouteLine id="test-route" coordinates={coordinates} />
      </VWorldMap>,
    );

    await waitFor(() => {
      expect(map.setPaintProperty).toHaveBeenCalledWith(
        'test-route-layer',
        'line-dasharray',
        undefined,
      );
    });
  });
});
