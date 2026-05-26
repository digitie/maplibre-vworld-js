import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import maplibregl from 'maplibre-gl';
import { Marker } from '../src/components/Marker';
import { VWorldMap } from '../src/components/VWorldMap';

describe('Marker Teardown (T-020)', () => {
  it('removes marker from map and clears portal when unmounted', async () => {
    vi.clearAllMocks();
    const { unmount } = render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <Marker lngLat={[127, 37]} />
      </VWorldMap>
    );

    await waitFor(() => expect(maplibregl.Marker).toHaveBeenCalled());
    const results = vi.mocked(maplibregl.Marker).mock.results;
    const mockMarkerInstance = results[results.length - 1]?.value as maplibregl.Marker & { remove: ReturnType<typeof vi.fn> };
    expect(mockMarkerInstance.addTo).toHaveBeenCalled();

    // Unmount the component
    unmount();

    // Verify cleanup
    expect(mockMarkerInstance.remove).toHaveBeenCalled();
  });
});
