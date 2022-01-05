import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'windify',
      fileName: (format) => `windify.${format}.js`
    },
    rollupOptions: {
      onwarn: (warning, defaultHandler) => {
        if (warning.plugin === 'rollup-plugin-dynamic-import-variables')
          return;
        else
          defaultHandler(warning);
      }
    }  
  },
  publicDir: false // omit assets in library build
});
