import { render, waitFor } from '@testing-library/react';
import { useCallback } from 'react';
import { VWorldMap } from '../src/components/VWorldMap';
import { useMap, useMapSelector } from '../src/store/hooks';

function SelectorProbe({ values }: { values: Array<{ loaded: boolean }> }) {
  const selected = useMapSelector(useCallback((snapshot) => ({ loaded: snapshot.loaded }), []));
  values.push(selected);
  return null;
}

// Identical signature but the selector arrow is freshly allocated each render
// (consumer forgot useCallback). The hook should still stabilize the value.
function UnstableSelectorProbe({ values }: { values: Array<boolean> }) {
  const loaded = useMapSelector((snapshot) => snapshot.loaded);
  values.push(loaded);
  return null;
}

describe('map store hooks', () => {
  it('caches selector results for the same store snapshot', async () => {
    const values: Array<{ loaded: boolean }> = [];
    const { rerender } = render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <SelectorProbe values={values} />
      </VWorldMap>,
    );

    await waitFor(() => expect(values.length).toBeGreaterThan(0));
    const selected = values[values.length - 1];

    rerender(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <SelectorProbe values={values} />
      </VWorldMap>,
    );

    await waitFor(() => expect(values.length).toBeGreaterThan(1));
    expect(values[values.length - 1]).toBe(selected);
  });

  it('tolerates an unstable selector identity without thrashing renders', async () => {
    const values: Array<boolean> = [];
    const { rerender } = render(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <UnstableSelectorProbe values={values} />
      </VWorldMap>,
    );

    await waitFor(() => expect(values.length).toBeGreaterThan(0));
    const before = values.length;

    rerender(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <UnstableSelectorProbe values={values} />
      </VWorldMap>,
    );
    rerender(
      <VWorldMap apiKey="test-key" center={[127, 37]}>
        <UnstableSelectorProbe values={values} />
      </VWorldMap>,
    );

    // Parent re-rendered twice, each re-renders the child once, so we
    // expect at most ~2 extra entries — definitely not the runaway loop
    // an unstabilized selector would produce.
    expect(values.length - before).toBeLessThanOrEqual(3);
  });

  it('throws a useful error when hooks are used outside <VWorldMap>', () => {
    function OutsideProbe() {
      useMap();
      return null;
    }
    expect(() => render(<OutsideProbe />)).toThrow(/inside <VWorldMap>/);
  });
});
