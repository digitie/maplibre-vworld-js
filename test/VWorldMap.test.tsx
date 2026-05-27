import { render, waitFor, act } from '@testing-library/react';
import { VWorldMap } from '../src/components/VWorldMap';
import maplibregl from 'maplibre-gl';

type MapMockInstance = maplibregl.Map & {
  on: ReturnType<typeof vi.fn>;
  flyTo: ReturnType<typeof vi.fn>;
  jumpTo: ReturnType<typeof vi.fn>;
  setMaxBounds: ReturnType<typeof vi.fn>;
  getZoom: ReturnType<typeof vi.fn>;
  getCenter: ReturnType<typeof vi.fn>;
  isMoving: ReturnType<typeof vi.fn>;
  isEasing: ReturnType<typeof vi.fn>;
};

function latestMapMock(): MapMockInstance {
  const results = vi.mocked(maplibregl.Map).mock.results;
  return results[results.length - 1]?.value as unknown as MapMockInstance;
}

function mapHandler<TEvent>(map: MapMockInstance, eventName: string): (event: TEvent) => void {
  const call = map.on.mock.calls.find(([event]) => event === eventName);
  if (!call) throw new Error(`Missing ${eventName} handler`);
  return call[1] as (event: TEvent) => void;
}

describe('VWorldMap', () => {
  it('renders a map container', () => {
    const { getByTestId } = render(<VWorldMap apiKey="test-key" center={[127, 37]} />);
    expect(getByTestId('vworld-map-container')).toBeInTheDocument();
  });

  it('initializes maplibre-gl map with correct options', () => {
    render(<VWorldMap apiKey="test-key" center={[127, 37]} zoom={10} layerType="Satellite" />);

    expect(maplibregl.Map).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [127, 37],
        zoom: 10,
        style: expect.objectContaining({ version: 8 }),
      }),
    );
  });

  it('adds NavigationControl and GeolocateControl by default', () => {
    render(<VWorldMap apiKey="test-key" center={[127, 37]} />);

    expect(maplibregl.NavigationControl).toHaveBeenCalled();
    expect(maplibregl.GeolocateControl).toHaveBeenCalled();
  });

  it('can disable controls via props', () => {
    vi.clearAllMocks();
    render(
      <VWorldMap apiKey="test-key" center={[127, 37]} navigation={false} geolocate={false} />,
    );

    expect(maplibregl.NavigationControl).not.toHaveBeenCalled();
    expect(maplibregl.GeolocateControl).not.toHaveBeenCalled();
  });

  describe('fallback', () => {
    it('renders fallback when apiKey is missing', () => {
      vi.clearAllMocks();
      const { queryByTestId, getByText } = render(
        <VWorldMap apiKey="" center={[127, 37]} fallback={<div>NO KEY</div>} />,
      );
      expect(queryByTestId('vworld-map-container')).not.toBeInTheDocument();
      expect(getByText('NO KEY')).toBeInTheDocument();
      expect(maplibregl.Map).not.toHaveBeenCalled();
    });

    it('renders fallback when apiKey is whitespace-only', () => {
      vi.clearAllMocks();
      const { queryByTestId } = render(
        <VWorldMap apiKey={'   \n  '} center={[127, 37]} fallback={<div>NO KEY</div>} />,
      );
      expect(queryByTestId('vworld-map-container')).not.toBeInTheDocument();
      expect(maplibregl.Map).not.toHaveBeenCalled();
    });

    it('passes reason to fallback render function', () => {
      vi.clearAllMocks();
      const fallback = vi.fn((info: { reason: string }) => <div>reason: {info.reason}</div>);
      const { getByText } = render(
        <VWorldMap apiKey="" center={[127, 37]} fallback={fallback} />,
      );
      expect(fallback).toHaveBeenCalledWith({ reason: 'missing-api-key' });
      expect(getByText('reason: missing-api-key')).toBeInTheDocument();
    });

    it('renders nothing when fallback is omitted and apiKey is missing', () => {
      vi.clearAllMocks();
      const { queryByTestId } = render(<VWorldMap apiKey="" center={[127, 37]} />);
      expect(queryByTestId('vworld-map-container')).not.toBeInTheDocument();
      expect(maplibregl.Map).not.toHaveBeenCalled();
    });
  });

  describe('event wiring', () => {
    it('attaches map event handlers when map is created', () => {
      vi.clearAllMocks();
      render(
        <VWorldMap
          apiKey="test-key"
          center={[127, 37]}
          onClick={vi.fn()}
          onContextMenu={vi.fn()}
          onMoveEnd={vi.fn()}
          onZoomEnd={vi.fn()}
          onIdle={vi.fn()}
          onError={vi.fn()}
        />,
      );
      const mapInstance = (maplibregl.Map as unknown as { mock: { results: { value: MapMockInstance }[] } })
        .mock.results[0].value;
      const registered = mapInstance.on.mock.calls.map((c) => c[0]);
      expect(registered).toContain('click');
      expect(registered).toContain('contextmenu');
      expect(registered).toContain('moveend');
      expect(registered).toContain('zoomend');
      expect(registered).toContain('idle');
      expect(registered).toContain('error');
      expect(registered).toContain('load');
    });

    it('passes raw MapLibre click events to onClick', () => {
      vi.clearAllMocks();
      const onClick = vi.fn();
      render(<VWorldMap apiKey="test-key" center={[127, 37]} onClick={onClick} />);

      const map = latestMapMock();
      const event = { lngLat: { lng: 127, lat: 37 } };
      mapHandler<typeof event>(map, 'click')(event);

      expect(onClick).toHaveBeenCalledWith(event);
    });

    it('passes raw MapLibre context menu events to onContextMenu', () => {
      vi.clearAllMocks();
      const onContextMenu = vi.fn();
      render(<VWorldMap apiKey="test-key" center={[127, 37]} onContextMenu={onContextMenu} />);

      const map = latestMapMock();
      const event = { lngLat: { lng: 127.1, lat: 37.5 }, point: { x: 12, y: 24 } };
      mapHandler<typeof event>(map, 'contextmenu')(event);

      expect(onContextMenu).toHaveBeenCalledWith(event);
    });

    it('passes raw MapLibre error events to onError', () => {
      vi.clearAllMocks();
      const onError = vi.fn();
      render(<VWorldMap apiKey="test-key" center={[127, 37]} onError={onError} />);

      const map = latestMapMock();
      const rawEvent = { error: new Error('tile failed'), sourceId: 'vworld-Base' };
      mapHandler<typeof rawEvent>(map, 'error')(rawEvent);

      expect(onError).toHaveBeenCalledWith(rawEvent);
    });

    it('uses the latest onError handler even when it is added after mount', () => {
      vi.clearAllMocks();
      const onError = vi.fn();
      const { rerender } = render(<VWorldMap apiKey="test-key" center={[127, 37]} />);
      const map = latestMapMock();

      rerender(<VWorldMap apiKey="test-key" center={[127, 37]} onError={onError} />);
      const rawEvent = { error: new Error('late tile failed'), sourceId: 'vworld-Base' };
      mapHandler<typeof rawEvent>(map, 'error')(rawEvent);

      expect(onError).toHaveBeenCalledWith(rawEvent);
    });
  });

  describe('loadingSkeleton', () => {
    it('renders skeleton before the map fires load', () => {
      vi.clearAllMocks();
      const { getByText } = render(
        <VWorldMap apiKey="test-key" center={[127, 37]} loadingSkeleton={<div>SKELETON</div>} />,
      );
      // The mocked Map fires `load` asynchronously via setTimeout, so on the
      // synchronous render the skeleton is visible.
      expect(getByText('SKELETON')).toBeInTheDocument();
    });
  });

  describe('camera changes', () => {
    it('does not replay the initial camera after the map load event', async () => {
      vi.clearAllMocks();
      render(<VWorldMap apiKey="test-key" center={[127, 37]} zoom={10} />);
      const map = latestMapMock();

      await waitFor(() => expect(map.getZoom).toHaveBeenCalledTimes(2));
      expect(map.flyTo).not.toHaveBeenCalled();
      expect(map.jumpTo).not.toHaveBeenCalled();
    });

    it('forwards flyToOptions to flyTo when center prop changes', async () => {
      vi.clearAllMocks();
      const { rerender } = render(
        <VWorldMap
          apiKey="test-key"
          center={[127, 37]}
          zoom={10}
          flyToOptions={{ duration: 500 }}
        />,
      );
      const map = latestMapMock();
      await waitFor(() => expect(maplibregl.Map).toHaveBeenCalled());

      rerender(
        <VWorldMap
          apiKey="test-key"
          center={[128, 38]}
          zoom={10}
          flyToOptions={{ duration: 500 }}
        />,
      );

      await waitFor(() => {
        expect(map.flyTo).toHaveBeenCalledWith({
          duration: 500,
          center: [128, 38],
          zoom: 10,
          pitch: 0,
          bearing: 0,
        });
      });
    });

    it('updates pitch and bearing when camera props change', async () => {
      vi.clearAllMocks();
      const { rerender } = render(
        <VWorldMap apiKey="test-key" center={[127, 37]} zoom={10} pitch={0} bearing={0} />,
      );
      const map = latestMapMock();
      await waitFor(() => expect(map.getZoom).toHaveBeenCalledTimes(2));

      rerender(
        <VWorldMap apiKey="test-key" center={[127, 37]} zoom={10} pitch={30} bearing={45} />,
      );

      await waitFor(() => {
        expect(map.flyTo).toHaveBeenCalledWith({
          center: [127, 37],
          zoom: 10,
          pitch: 30,
          bearing: 45,
        });
      });
    });

    it('defers camera prop changes while user is panning and re-applies on moveend', async () => {
      vi.clearAllMocks();
      const { rerender } = render(
        <VWorldMap apiKey="test-key" center={[127, 37]} zoom={10} />,
      );
      const map = latestMapMock();
      await waitFor(() => expect(maplibregl.Map).toHaveBeenCalled());

      // Simulate the user being mid-gesture.
      map.isMoving.mockReturnValue(true);

      rerender(<VWorldMap apiKey="test-key" center={[128, 38]} zoom={10} />);

      // While the gesture is in progress, no camera command runs.
      expect(map.flyTo).not.toHaveBeenCalled();
      expect(map.jumpTo).not.toHaveBeenCalled();

      // Gesture ends → moveend fires → pending camera is applied.
      map.isMoving.mockReturnValue(false);
      mapHandler(map, 'moveend')({} as never);

      await waitFor(() => {
        expect(map.flyTo).toHaveBeenCalledWith({
          center: [128, 38],
          zoom: 10,
          pitch: 0,
          bearing: 0,
        });
      });
    });

    it('uses jumpTo when animateCameraChanges is false', async () => {
      vi.clearAllMocks();
      const { rerender } = render(
        <VWorldMap
          apiKey="test-key"
          center={[127, 37]}
          zoom={10}
          animateCameraChanges={false}
        />,
      );
      const map = latestMapMock();
      await waitFor(() => expect(maplibregl.Map).toHaveBeenCalled());

      rerender(
        <VWorldMap
          apiKey="test-key"
          center={[128, 38]}
          zoom={10}
          animateCameraChanges={false}
        />,
      );

      await waitFor(() => {
        expect(map.jumpTo).toHaveBeenCalledWith({
          center: [128, 38],
          zoom: 10,
          pitch: 0,
          bearing: 0,
        });
      });
      expect(map.flyTo).not.toHaveBeenCalled();
    });
  });

  describe('bounds updates', () => {
    it('clears maxBounds when the prop is removed', async () => {
      vi.clearAllMocks();
      const bounds: maplibregl.LngLatBoundsLike = [[126, 36], [128, 38]];
      const { rerender } = render(
        <VWorldMap apiKey="test-key" center={[127, 37]} maxBounds={bounds} />,
      );
      const map = latestMapMock();

      await waitFor(() => expect(map.setMaxBounds).toHaveBeenCalledWith(bounds));
      rerender(<VWorldMap apiKey="test-key" center={[127, 37]} />);

      await waitFor(() => expect(map.setMaxBounds).toHaveBeenCalledWith(undefined));
    });
  });

  describe('lazy loading', () => {
    let OriginalIntersectionObserver: any;
    let observerCallback: IntersectionObserverCallback;
    let observeMock: ReturnType<typeof vi.fn>;
    let disconnectMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      OriginalIntersectionObserver = globalThis.IntersectionObserver;
      observeMock = vi.fn();
      disconnectMock = vi.fn();
      class MockIntersectionObserver {
        constructor(cb: IntersectionObserverCallback) {
          observerCallback = cb;
        }
        observe = observeMock;
        unobserve = vi.fn();
        disconnect = disconnectMock;
      }
      globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
    });

    afterEach(() => {
      globalThis.IntersectionObserver = OriginalIntersectionObserver;
    });

    it('defers map creation until container intersects when lazy=true', () => {
      vi.clearAllMocks();
      const { getByTestId, queryByText } = render(
        <VWorldMap apiKey="test-key" center={[127, 37]} lazy={true} loadingSkeleton={<div>SKELETON</div>} />
      );

      // MapLibre is not created yet
      expect(maplibregl.Map).not.toHaveBeenCalled();
      // Container and skeleton are rendered
      expect(getByTestId('vworld-map-container')).toBeInTheDocument();
      expect(queryByText('SKELETON')).toBeInTheDocument();

      // Trigger intersection
      act(() => {
        observerCallback([{ isIntersecting: true }] as IntersectionObserverEntry[], {} as IntersectionObserver);
      });

      // Now MapLibre should be created
      expect(maplibregl.Map).toHaveBeenCalled();
    });

    it('defers map creation until lazyEnabled is true when lazy="manual"', () => {
      vi.clearAllMocks();
      const { rerender } = render(
        <VWorldMap apiKey="test-key" center={[127, 37]} lazy="manual" lazyEnabled={false} />
      );

      expect(maplibregl.Map).not.toHaveBeenCalled();

      rerender(<VWorldMap apiKey="test-key" center={[127, 37]} lazy="manual" lazyEnabled={true} />);

      expect(maplibregl.Map).toHaveBeenCalled();
    });
  });
});
