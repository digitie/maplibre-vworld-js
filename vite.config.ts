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
      external: ['react', 'react-dom', 'react/jsx-runtime', 'maplibre-gl'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'maplibre-gl': 'maplibregl',
        },
      },
    },
  },
});
