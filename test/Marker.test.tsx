import { render, waitFor } from '@testing-library/react';
import { Marker } from '../src/components/Marker';
import { VWorldMap } from '../src/components/VWorldMap';
import maplibregl from 'maplibre-gl';

function latestMarkerMock() {
  const results = vi.mocked(maplibregl.Marker).mock.results;
  return results[results.length - 1]?.value as maplibregl.Marker & {
    getElement: ReturnType<typeof vi.fn>;
  };
}

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

  it('wires marker DOM events through stable callbacks', async () => {
    vi.clearAllMocks();
    const onClick = vi.fn();
    const onContextMenu = vi.fn();
    render(
      <VWorldMap apiKey="test-key">
        <Marker
          lngLat={[127, 37]}
          onClick={onClick}
          onContextMenu={onContextMenu}
          selected
          zIndex={7}
          ariaLabel="Selected place"
          className="tripmate-marker"
        >
          <div data-testid="custom-marker">Hello</div>
        </Marker>
      </VWorldMap>
    );

    await waitFor(() => expect(maplibregl.Marker).toHaveBeenCalled());
    const marker = latestMarkerMock();
    const element = marker.getElement() as HTMLElement;

    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));

    expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent), marker);
    expect(onContextMenu).toHaveBeenCalledWith(expect.any(MouseEvent), marker);
    expect(element.dataset.selected).toBe('true');
    expect(element.style.zIndex).toBe('7');
    expect(element).toHaveAttribute('aria-label', 'Selected place');
    expect(element).toHaveClass('tripmate-marker');
  });
});
