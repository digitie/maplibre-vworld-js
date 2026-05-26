import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import maplibregl from 'maplibre-gl';
import { RouteLine } from '../src/components/RouteLine';
import { VWorldMap } from '../src/components/VWorldMap';

describe('RouteLine Component', () => {
  it('adds source and layer on mount and cleans up on unmount', async () => {
    vi.clearAllMocks();
    
    const { unmount } = render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <RouteLine id="test-route" coordinates={[[127, 37], [128, 38]]} />
      </VWorldMap>
    );

    await waitFor(() => expect(maplibregl.Map).toHaveBeenCalled());
    const mapInstances = vi.mocked(maplibregl.Map).mock.results;
    const mapMock = mapInstances[mapInstances.length - 1]?.value as any;

    await waitFor(() => {
      expect(mapMock.addSource).toHaveBeenCalledWith('test-route-source', expect.objectContaining({ type: 'geojson' }));
      expect(mapMock.addLayer).toHaveBeenCalledWith(expect.objectContaining({ id: 'test-route-layer', type: 'line' }));
    });

    mapMock.getLayer.mockReturnValue({});
    mapMock.getSource.mockReturnValue({});

    unmount();

    expect(mapMock.removeLayer).toHaveBeenCalledWith('test-route-layer');
    expect(mapMock.removeSource).toHaveBeenCalledWith('test-route-source');
  });

  it('binds map events on mount and removes them on unmount', async () => {
    vi.clearAllMocks();
    
    const { unmount } = render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <RouteLine id="test-route" coordinates={[[127, 37], [128, 38]]} onClick={() => {}} />
      </VWorldMap>
    );

    await waitFor(() => expect(maplibregl.Map).toHaveBeenCalled());
    const mapInstances = vi.mocked(maplibregl.Map).mock.results;
    const mapMock = mapInstances[mapInstances.length - 1]?.value as any;

    await waitFor(() => {
      expect(mapMock.on).toHaveBeenCalledWith('click', 'test-route-layer', expect.any(Function));
      expect(mapMock.on).toHaveBeenCalledWith('mouseenter', 'test-route-layer', expect.any(Function));
      expect(mapMock.on).toHaveBeenCalledWith('mouseleave', 'test-route-layer', expect.any(Function));
    });

    unmount();

    expect(mapMock.off).toHaveBeenCalledWith('click', 'test-route-layer', expect.any(Function));
  });
});
