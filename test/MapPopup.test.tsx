import { render, waitFor } from '@testing-library/react';
import maplibregl from 'maplibre-gl';
import { MapPopup } from '../src/components/MapPopup';
import { VWorldMap } from '../src/components/VWorldMap';

function latestPopupMock() {
  const results = vi.mocked(maplibregl.Popup).mock.results;
  return results[results.length - 1]?.value as maplibregl.Popup & {
    setDOMContent: ReturnType<typeof vi.fn>;
    setLngLat: ReturnType<typeof vi.fn>;
  };
}

describe('MapPopup', () => {
  it('mounts React content into a MapLibre popup container', async () => {
    render(
      <VWorldMap apiKey="test-key">
        <MapPopup lngLat={[127, 37]}>
          <strong>Popup content</strong>
        </MapPopup>
      </VWorldMap>
    );

    await waitFor(() => expect(maplibregl.Popup).toHaveBeenCalled());
    const popup = latestPopupMock();
    const container = popup.setDOMContent.mock.calls[0][0] as HTMLElement;

    expect(popup.setLngLat).toHaveBeenCalledWith([127, 37]);
    expect(container.textContent).toBe('Popup content');
  });
});
