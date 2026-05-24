import React from 'react';
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
});
