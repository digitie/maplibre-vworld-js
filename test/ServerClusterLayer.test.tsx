import { render, waitFor } from '@testing-library/react';
import maplibregl from 'maplibre-gl';
import { ServerClusterLayer } from '../src/components/ServerClusterLayer';
import { VWorldMap } from '../src/components/VWorldMap';

function latestMarkerElement(): HTMLElement {
  const results = vi.mocked(maplibregl.Marker).mock.results;
  const marker = results[results.length - 1]?.value as maplibregl.Marker & {
    getElement: ReturnType<typeof vi.fn>;
  };
  return marker.getElement() as HTMLElement;
}

describe('ServerClusterLayer', () => {
  it('renders server clusters and fits their bounds on click', async () => {
    vi.clearAllMocks();
    render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <ServerClusterLayer
          clusters={[
            {
              id: 'cluster-1',
              lngLat: [127, 37],
              count: 12,
              bounds: [126, 36, 128, 38],
            },
          ]}
        />
      </VWorldMap>
    );

    await waitFor(() => expect(maplibregl.Marker).toHaveBeenCalled());
    const element = latestMarkerElement();
    await waitFor(() => expect(element.textContent).toBe('12'));

    (element.firstElementChild as HTMLElement).click();

    const map = vi.mocked(maplibregl.Map).mock.results[0].value as maplibregl.Map & {
      fitBounds: ReturnType<typeof vi.fn>;
    };
    expect(map.fitBounds).toHaveBeenCalledWith(
      [[126, 36], [128, 38]],
      expect.objectContaining({ padding: 48 })
    );
  });
});
