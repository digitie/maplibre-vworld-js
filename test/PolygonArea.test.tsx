import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import maplibregl from 'maplibre-gl';
import { PolygonArea } from '../src/components/PolygonArea';
import { VWorldMap } from '../src/components/VWorldMap';

describe('PolygonArea Component', () => {
  const dummyGeoJSON: any = { type: 'FeatureCollection', features: [] };

  it('adds source and both fill/line layers on mount, cleans up on unmount', async () => {
    vi.clearAllMocks();
    const { unmount } = render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <PolygonArea id="test-poly" data={dummyGeoJSON} />
      </VWorldMap>
    );

    await waitFor(() => expect(maplibregl.Map).toHaveBeenCalled());
    const mapInstances = vi.mocked(maplibregl.Map).mock.results;
    const mapMock = mapInstances[mapInstances.length - 1]?.value as any;

    await waitFor(() => {
      expect(mapMock.addSource).toHaveBeenCalledWith('test-poly-source', expect.objectContaining({ type: 'geojson', data: dummyGeoJSON }));
      expect(mapMock.addLayer).toHaveBeenCalledWith(expect.objectContaining({ id: 'test-poly-fill-layer', type: 'fill' }));
      expect(mapMock.addLayer).toHaveBeenCalledWith(expect.objectContaining({ id: 'test-poly-line-layer', type: 'line' }));
    });

    mapMock.getLayer.mockReturnValue({});
    mapMock.getSource.mockReturnValue({});

    unmount();

    expect(mapMock.removeLayer).toHaveBeenCalledWith('test-poly-fill-layer');
    expect(mapMock.removeLayer).toHaveBeenCalledWith('test-poly-line-layer');
    expect(mapMock.removeSource).toHaveBeenCalledWith('test-poly-source');
  });

  it('binds events on mount', async () => {
    vi.clearAllMocks();
    const { unmount } = render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <PolygonArea id="test-poly" data={dummyGeoJSON} onClick={() => {}} />
      </VWorldMap>
    );

    await waitFor(() => expect(maplibregl.Map).toHaveBeenCalled());
    const mapInstances = vi.mocked(maplibregl.Map).mock.results;
    const mapMock = mapInstances[mapInstances.length - 1]?.value as any;

    await waitFor(() => {
      expect(mapMock.on).toHaveBeenCalledWith('click', 'test-poly-fill-layer', expect.any(Function));
      expect(mapMock.on).toHaveBeenCalledWith('mouseenter', 'test-poly-fill-layer', expect.any(Function));
      expect(mapMock.on).toHaveBeenCalledWith('mouseleave', 'test-poly-fill-layer', expect.any(Function));
    });

    unmount();

    expect(mapMock.off).toHaveBeenCalledWith('click', 'test-poly-fill-layer', expect.any(Function));
  });
});
