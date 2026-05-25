import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.build.json',
      include: ['src'],
      exclude: ['dev', 'test'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MaplibreVworldJs',
      fileName: 'maplibre-vworld-js',
    },
    rollupOptions: {
      // NOTE: `react/jsx-runtime` is intentionally bundled (not externalized).
      // Externalizing it would force UMD consumers to expose a `jsxRuntime`
      // global, which they cannot do, breaking the UMD build path. The duplicate
      // cost in ESM is a few hundred bytes — acceptable tradeoff.
      external: ['react', 'react-dom', 'maplibre-gl'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'maplibre-gl': 'maplibregl',
        },
      },
    },
  },
});
