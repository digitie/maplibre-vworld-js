import { render, waitFor } from '@testing-library/react';
import maplibregl from 'maplibre-gl';
import { Popup } from '../src/components/Popup';
import { VWorldMap } from '../src/components/VWorldMap';

type PopupMock = maplibregl.Popup & {
  setLngLat: ReturnType<typeof vi.fn>;
  setDOMContent: ReturnType<typeof vi.fn>;
  setOffset: ReturnType<typeof vi.fn>;
  setMaxWidth: ReturnType<typeof vi.fn>;
  addTo: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
};

function latestPopupMock(): PopupMock {
  const results = vi.mocked(maplibregl.Popup).mock.results;
  return results[results.length - 1]?.value as PopupMock;
}

describe('Popup', () => {
  it('creates a MapLibre popup once and keeps it across prop changes', async () => {
    vi.clearAllMocks();
    const { rerender } = render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <Popup lngLat={[127, 37]}>hello</Popup>
      </VWorldMap>,
    );

    await waitFor(() => expect(maplibregl.Popup).toHaveBeenCalledTimes(1));

    rerender(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <Popup lngLat={[128, 38]} offset={[0, -8]} maxWidth="320px">
          world
        </Popup>
      </VWorldMap>,
    );

    // No remount — same Popup instance.
    expect(maplibregl.Popup).toHaveBeenCalledTimes(1);
    const popup = latestPopupMock();
    await waitFor(() => expect(popup.setLngLat).toHaveBeenCalledWith([128, 38]));
    expect(popup.setOffset).toHaveBeenCalledWith([0, -8]);
    expect(popup.setMaxWidth).toHaveBeenCalledWith('320px');
  });

  it('does not remount the popup when an inline `offset` object identity changes', async () => {
    vi.clearAllMocks();
    const { rerender } = render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <Popup lngLat={[127, 37]} offset={[0, -8]}>
          hello
        </Popup>
      </VWorldMap>,
    );

    await waitFor(() => expect(maplibregl.Popup).toHaveBeenCalledTimes(1));

    rerender(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <Popup lngLat={[127, 37]} offset={[0, -8]}>
          hello
        </Popup>
      </VWorldMap>,
    );

    // Still one popup instance — `offset` is applied via setOffset, not by
    // recreating the popup.
    expect(maplibregl.Popup).toHaveBeenCalledTimes(1);
  });
});
