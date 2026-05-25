import { render } from '@testing-library/react';
import { VWorldMap } from '../src/components/VWorldMap';
import maplibregl from 'maplibre-gl';

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

  describe('fallback', () => {
    it('renders fallback when apiKey is missing', () => {
      vi.clearAllMocks();
      const { queryByTestId, getByText } = render(
        <VWorldMap apiKey="" fallback={<div>NO KEY</div>} />
      );
      expect(queryByTestId('vworld-map-container')).not.toBeInTheDocument();
      expect(getByText('NO KEY')).toBeInTheDocument();
      expect(maplibregl.Map).not.toHaveBeenCalled();
    });

    it('renders fallback when apiKey is whitespace-only', () => {
      vi.clearAllMocks();
      const { queryByTestId } = render(
        <VWorldMap apiKey={'   \n  '} fallback={<div>NO KEY</div>} />
      );
      expect(queryByTestId('vworld-map-container')).not.toBeInTheDocument();
      expect(maplibregl.Map).not.toHaveBeenCalled();
    });

    it('passes reason to fallback render function', () => {
      vi.clearAllMocks();
      const fallback = vi.fn((info) => <div>reason: {info.reason}</div>);
      const { getByText } = render(<VWorldMap apiKey="" fallback={fallback} />);
      expect(fallback).toHaveBeenCalledWith({ reason: 'missing-api-key' });
      expect(getByText('reason: missing-api-key')).toBeInTheDocument();
    });

    it('renders nothing when fallback is omitted and apiKey is missing', () => {
      vi.clearAllMocks();
      const { queryByTestId } = render(<VWorldMap apiKey="" />);
      expect(queryByTestId('vworld-map-container')).not.toBeInTheDocument();
      expect(maplibregl.Map).not.toHaveBeenCalled();
    });
  });

  describe('event wiring', () => {
    it('attaches click/error handlers when map is created', () => {
      vi.clearAllMocks();
      const onMapClick = vi.fn();
      const onMapError = vi.fn();
      render(
        <VWorldMap apiKey="test-key" onMapClick={onMapClick} onMapError={onMapError} />
      );
      const mapInstance = (maplibregl.Map as any).mock.results[0].value;
      const registered = mapInstance.on.mock.calls.map((c: any[]) => c[0]);
      expect(registered).toContain('click');
      expect(registered).toContain('error');
      expect(registered).toContain('load');
    });
  });

  describe('loadingSkeleton', () => {
    it('renders skeleton before the map fires load', () => {
      vi.clearAllMocks();
      const { getByText } = render(
        <VWorldMap apiKey="test-key" loadingSkeleton={<div>SKELETON</div>} />
      );
      // The mocked Map fires `load` asynchronously via setTimeout, so on the
      // synchronous render the skeleton is visible.
      expect(getByText('SKELETON')).toBeInTheDocument();
    });
  });
});
