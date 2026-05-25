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
      // `react/jsx-runtime` is intentionally bundled (not externalized): UMD
      // consumers cannot expose a `jsxRuntime` global, so externalizing breaks
      // the UMD build path. The duplicate cost in ESM is a few hundred bytes.
      //
      // `zod` IS externalized: it's a declared peer dep, so consumers always
      // have a copy. Externalizing avoids shipping a ~50 kB duplicate of
      // zod v4 inside the consumer's final bundle.
      external: ['react', 'react-dom', 'maplibre-gl', 'zod'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'maplibre-gl': 'maplibregl',
          zod: 'zod',
        },
      },
    },
  },
});
