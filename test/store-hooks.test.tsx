import { render, waitFor } from '@testing-library/react';
import { useCallback } from 'react';
import { VWorldMap } from '../src/components/VWorldMap';
import { useMapSelector } from '../src/store/hooks';

function SelectorProbe({ values }: { values: Array<{ loaded: boolean }> }) {
  const selected = useMapSelector(useCallback((snapshot) => ({ loaded: snapshot.loaded }), []));
  values.push(selected);
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
});
