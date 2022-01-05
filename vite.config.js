import { defineConfig } from 'vite'

export default defineConfig(Object.assign({
  build: {
    outDir: "docs",
    rollupOptions: {
      onwarn: (warning, defaultHandler) => {
        if (warning.plugin === 'rollup-plugin-dynamic-import-variables')
          return;
        else
          defaultHandler(warning);
      }
    }
  }
}, gitpodConfig()));

function gitpodConfig() {
  if (process.env.APP_ENV === 'gitpod') {
    return {
      server: {
        hmr: {
          clientPort: 443
        }
      }
    };
  }
}
