import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock maplibre-gl
vi.mock('maplibre-gl', () => {
  const Map = vi.fn().mockImplementation(function() {
    return {
      on: vi.fn((event, callback) => {
        if (event === 'load') {
          setTimeout(callback, 0); // simulate async load
        }
      }),
      off: vi.fn(),
      remove: vi.fn(),
      setStyle: vi.fn(),
      addControl: vi.fn(),
      flyTo: vi.fn(),
      resize: vi.fn(),
    };
  });

  const NavigationControl = vi.fn().mockImplementation(function() {
    return {};
  });
  
  const GeolocateControl = vi.fn().mockImplementation(function() {
    this.onAdd = vi.fn();
    this.onRemove = vi.fn();
  });

  const ScaleControl = vi.fn().mockImplementation(function() {
    this.onAdd = vi.fn();
    this.onRemove = vi.fn();
  });

  const Marker = vi.fn().mockImplementation(function() {
    return {
      setLngLat: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn(),
      on: vi.fn(),
      getLngLat: vi.fn().mockReturnValue({ lng: 0, lat: 0 }),
    };
  });

  return {
    default: {
      Map,
      NavigationControl,
      GeolocateControl,
      ScaleControl,
      Marker,
    },
    Map,
    NavigationControl,
    GeolocateControl,
    ScaleControl,
    Marker,
  };
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
