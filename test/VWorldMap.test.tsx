import { render, waitFor } from '@testing-library/react';
import { VWorldMap } from '../src/components/VWorldMap';
import maplibregl from 'maplibre-gl';

type MapMockInstance = maplibregl.Map & {
  on: ReturnType<typeof vi.fn>;
  flyTo: ReturnType<typeof vi.fn>;
  getZoom: ReturnType<typeof vi.fn>;
};

function latestMapMock(): MapMockInstance {
  const results = vi.mocked(maplibregl.Map).mock.results;
  return results[results.length - 1]?.value as unknown as MapMockInstance;
}

function mapHandler<TEvent>(map: MapMockInstance, eventName: string): (event: TEvent) => void {
  const call = map.on.mock.calls.find(([event]) => event === eventName);
  if (!call) {
    throw new Error(`Missing ${eventName} handler`);
  }
  return call[1] as (event: TEvent) => void;
}

describe('VWorldMap', () => {
  it('renders a map container', () => {
    const { getByTestId } = render(<VWorldMap apiKey="test-key" />);
    expect(getByTestId('vworld-map-container')).toBeInTheDocument();
  });

  it('initializes maplibre-gl map with correct options', () => {
    render(<VWorldMap apiKey="test-key" center={[127, 37]} zoom={10} layerType="Satellite" />);
    
    expect(maplibregl.Map).toHaveBeenCalledWith(expect.objectContaining({
      center: [127, 37],
      zoom: 10,
      style: expect.objectContaining({
        version: 8,
      })
    }));
  });

  it('adds NavigationControl and GeolocateControl by default', () => {
    render(<VWorldMap apiKey="test-key" />);
    
    expect(maplibregl.NavigationControl).toHaveBeenCalled();
    expect(maplibregl.GeolocateControl).toHaveBeenCalled();
  });

  it('can disable controls via props', () => {
    vi.clearAllMocks();
    render(<VWorldMap apiKey="test-key" showNavigationControl={false} showGeolocateControl={false} />);
    
    expect(maplibregl.NavigationControl).not.toHaveBeenCalled();
    expect(maplibregl.GeolocateControl).not.toHaveBeenCalled();
  });

  it('passes raw MapLibre click events to onMapClick', () => {
    const onMapClick = vi.fn();
    render(<VWorldMap apiKey="test-key" onMapClick={onMapClick} />);

    const map = latestMapMock();
    const event = { lngLat: { lng: 127, lat: 37 } };
    mapHandler<typeof event>(map, 'click')(event);

    expect(onMapClick).toHaveBeenCalledWith(event);
  });

  it('passes raw MapLibre error events to onMapError', () => {
    const onMapError = vi.fn();
    render(<VWorldMap apiKey="test-key" onMapError={onMapError} />);

    const map = latestMapMock();
    const event = { error: new Error('tile failed'), sourceId: 'vworld-Base' };
    mapHandler<typeof event>(map, 'error')(event);

    expect(onMapError).toHaveBeenCalledWith(event);
  });

  it('applies flyToOptions when center or zoom props change', async () => {
    const { rerender } = render(
      <VWorldMap apiKey="test-key" center={[127, 37]} flyToOptions={{ animate: false, duration: 0 }} zoom={10} />
    );
    const map = latestMapMock();

    await waitFor(() => expect(map.getZoom).toHaveBeenCalled());
    rerender(
      <VWorldMap apiKey="test-key" center={[128, 38]} flyToOptions={{ animate: false, duration: 0 }} zoom={10} />
    );

    await waitFor(() => {
      expect(map.flyTo).toHaveBeenCalledWith({
        animate: false,
        center: [128, 38],
        duration: 0,
        zoom: 10,
      });
    });
  });
});
