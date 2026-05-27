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
      once: vi.fn((event, callback) => {
        if (event === 'load') {
          setTimeout(callback, 0);
        }
      }),
      off: vi.fn(),
      loaded: vi.fn(() => false),
      remove: vi.fn(),
      setStyle: vi.fn(),
      addControl: vi.fn(),
      flyTo: vi.fn(),
      fitBounds: vi.fn(),
      jumpTo: vi.fn(),
      isMoving: vi.fn(() => false),
      isEasing: vi.fn(() => false),
      resize: vi.fn(),
      getZoom: vi.fn().mockReturnValue(12),
      getCenter: vi.fn().mockReturnValue({ lng: 127, lat: 37 }),
      setMinZoom: vi.fn(),
      setMaxZoom: vi.fn(),
      setMaxBounds: vi.fn(),
      getBounds: vi.fn().mockReturnValue({
        getWest: () => -180,
        getSouth: () => -90,
        getEast: () => 180,
        getNorth: () => 90,
      }),
      // mockImplementation gives each call a fresh object, so multiple map
      // instances in the same test don't share cursor state through `style`.
      getCanvas: vi.fn(() => ({ style: {} })),
      getStyle: vi.fn(() => ({ layers: [], sources: {} })),
      getSource: vi.fn(),
      getLayer: vi.fn(),
      addSource: vi.fn(),
      addLayer: vi.fn(),
      removeLayer: vi.fn(),
      removeSource: vi.fn(),
      setPaintProperty: vi.fn(),
    };
  });

  const NavigationControl = vi.fn().mockImplementation(function() {
    return {};
  });
  
  type ControlMock = {
    onAdd: ReturnType<typeof vi.fn>;
    onRemove: ReturnType<typeof vi.fn>;
  };

  const GeolocateControl = vi.fn().mockImplementation(function(this: ControlMock) {
    this.onAdd = vi.fn();
    this.onRemove = vi.fn();
  });

  const ScaleControl = vi.fn().mockImplementation(function(this: ControlMock) {
    this.onAdd = vi.fn();
    this.onRemove = vi.fn();
  });

  const Marker = vi.fn().mockImplementation(function(options?: { element?: HTMLElement }) {
    const element = options?.element ?? document.createElement('div');
    return {
      setLngLat: vi.fn().mockReturnThis(),
      setOffset: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      getLngLat: vi.fn().mockReturnValue({ lng: 0, lat: 0 }),
      getElement: vi.fn().mockReturnValue(element),
    };
  });

  const Popup = vi.fn().mockImplementation(function() {
    const element = document.createElement('div');
    return {
      setLngLat: vi.fn().mockReturnThis(),
      setDOMContent: vi.fn().mockReturnThis(),
      setOffset: vi.fn().mockReturnThis(),
      setMaxWidth: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      on: vi.fn(),
      off: vi.fn(),
      remove: vi.fn(),
      getElement: vi.fn().mockReturnValue(element),
    };
  });

  return {
    default: {
      Map,
      NavigationControl,
      GeolocateControl,
      ScaleControl,
      Marker,
      Popup,
      addProtocol: vi.fn(),
    },
    Map,
    NavigationControl,
    GeolocateControl,
    ScaleControl,
    Marker,
    Popup,
    addProtocol: vi.fn(),
  };
});

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
