import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';
import manifest from './manifest.json';

// Update manifest to use source paths for build
delete manifest.background;
delete manifest.content_scripts;

const extensionManifest = {
  ...manifest,
  background: {
    service_worker: 'src/background/background.ts',
    type: 'module'
  },
  content_scripts: [
    {
      matches: [
        '*://*.youtube.com/*',
        '*://*.facebook.com/*',
        '*://*.instagram.com/*',
        '*://*.twitter.com/*',
        '*://*.x.com/*'
      ],
      js: ['src/content/content.ts'],
      run_at: 'document_idle'
    }
  ]
};

export default defineConfig({
  plugins: [
    react(),
    crx({ 
      manifest: extensionManifest,
    })
  ],
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        content: resolve(__dirname, 'src/content/content.ts'),
        background: resolve(__dirname, 'src/background/background.ts')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
