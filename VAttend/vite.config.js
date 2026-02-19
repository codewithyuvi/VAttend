import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [react()],

  define: {
    global: 'globalThis',
  },

  // Ensure Vite resolves Node polyfills at runtime (browser)
  resolve: {
    alias: {
      // map `buffer` imports to the buffer package (with trailing slash)
      buffer: 'buffer/',
      // process/browser provides a browser-friendly process shim
      process: 'process/browser',
    },
  },

  optimizeDeps: {
    // ensure these are pre-bundled so Vite doesn't externalize them
    include: ['buffer', 'process'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
})
