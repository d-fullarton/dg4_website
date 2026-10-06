import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const page = (file) => resolve(import.meta.dirname, file);

export default defineConfig({
  server: {
    port: 3001,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      // release-notes.html is internal: served by `npm run dev`, left out of the live build.
      input: {
        main: page('index.html'),
        services: page('services.html'),
        contact: page('contact.html'),
        privacy: page('privacy.html'),
      },
    },
  },
});
