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
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <Marker lngLat={[127, 37]} />
      </VWorldMap>,
    );

    await waitFor(() => {
      expect(maplibregl.Marker).toHaveBeenCalledWith({
        color: '#3FB1CE',
        draggable: false,
      });
    });
  });

  it('uses a custom element when children are provided', async () => {
    render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <Marker lngLat={[127, 37]}>
          <div data-testid="custom-marker">Hello</div>
        </Marker>
      </VWorldMap>,
    );

    await waitFor(() => {
      expect(maplibregl.Marker).toHaveBeenCalledWith(
        expect.objectContaining({ element: expect.any(HTMLDivElement), draggable: false }),
      );
    });
  });

  it('wires marker DOM events through stable callbacks', async () => {
    vi.clearAllMocks();
    const onClick = vi.fn();
    const onContextMenu = vi.fn();
    render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <Marker
          lngLat={[127, 37]}
          onClick={onClick}
          onContextMenu={onContextMenu}
          selected
          zIndex={7}
          ariaLabel="Selected place"
          className="custom-class"
        >
          <div data-testid="custom-marker">Hello</div>
        </Marker>
      </VWorldMap>,
    );

    await waitFor(() => expect(maplibregl.Marker).toHaveBeenCalled());
    const marker = latestMarkerMock();
    const element = marker.getElement() as HTMLElement;

    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));

    expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent), marker);
    expect(onContextMenu).toHaveBeenCalledWith(expect.any(MouseEvent), marker);
    expect(element.dataset.selected).toBe('true');
    expect(element.style.zIndex).toBe('1001'); // clicked -> dynamic zIndex
    expect(element.style.getPropertyValue('scale')).toBe('1.18');
    expect(element).toHaveAttribute('aria-label', 'Selected place');
    expect(element).toHaveClass('custom-class');
  });

  it('passes anchor and offset through to the MapLibre Marker constructor', async () => {
    vi.clearAllMocks();
    render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <Marker lngLat={[127, 37]} anchor="bottom" offset={[0, -8]}>
          <div>pin</div>
        </Marker>
      </VWorldMap>,
    );

    await waitFor(() => {
      expect(maplibregl.Marker).toHaveBeenCalledWith(
        expect.objectContaining({ anchor: 'bottom', offset: [0, -8] }),
      );
    });
  });

  it('updates className with a token-set diff (no flicker on shared tokens)', async () => {
    vi.clearAllMocks();
    const { rerender } = render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <Marker lngLat={[127, 37]} className="alpha shared">
          <div>x</div>
        </Marker>
      </VWorldMap>,
    );

    await waitFor(() => expect(maplibregl.Marker).toHaveBeenCalled());
    const marker = latestMarkerMock();
    const element = marker.getElement() as HTMLElement;
    const removeSpy = vi.spyOn(element.classList, 'remove');

    rerender(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <Marker lngLat={[127, 37]} className="beta shared">
          <div>x</div>
        </Marker>
      </VWorldMap>,
    );

    // `shared` should NOT be removed — only `alpha` should.
    expect(removeSpy).toHaveBeenCalledWith('alpha');
    expect(removeSpy).not.toHaveBeenCalledWith('shared');
    expect(element).toHaveClass('beta');
    expect(element).toHaveClass('shared');
  });

  it('uses event handlers added after the marker instance was created', async () => {
    vi.clearAllMocks();
    const onClick = vi.fn();
    const { rerender } = render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <Marker lngLat={[127, 37]}>
          <div>Dynamic handler</div>
        </Marker>
      </VWorldMap>,
    );

    await waitFor(() => expect(maplibregl.Marker).toHaveBeenCalledTimes(1));
    const marker = latestMarkerMock();

    rerender(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <Marker lngLat={[127, 37]} onClick={onClick}>
          <div>Dynamic handler</div>
        </Marker>
      </VWorldMap>,
    );

    marker.getElement().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent), marker);
    expect(maplibregl.Marker).toHaveBeenCalledTimes(1);
  });
});
