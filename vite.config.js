import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // Base public path
  base: './',
  
  // Ensure HTML files can be imported as strings
  assetsInclude: ['**/*.html'],
  
  // Build options
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  
  // Server options
  server: {
    port: 3000,
    open: true
  },
  
  // Resolve aliases for module imports
  resolve: {
    alias: {
      '@': resolve(__dirname, './js'),
      'jquery': 'jquery',
      'bootstrap': 'bootstrap',
      'lodash': 'lodash',
      'pixi.js': 'pixi.js',
      'howler': 'howler'
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['jquery', 'jquery-ui', 'bootstrap'],
    exclude: [],
    esbuildOptions: {
      define: {
        global: 'globalThis',
        jQuery: 'window.jQuery',
        $: 'window.$'
      }
    }
  },
  
  // Define global constants
  define: {
    'process.env': {},
    'global': 'globalThis',
  },
  
  // CSS options
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./css/_variables.scss";`
      }
    }
  }
})