// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://sampadavr.com',
  output: 'static',
  // Merged into /about/. Astro emits a static page with a meta refresh + canonical
  // link to the target, so old bookmarks and search results never hit a 404.
  redirects: {
    '/why-sampada-vr': '/about/',
  },
  integrations: [
    sitemap({
      filenameBase: 'sitemap',
    }),
  ],
});
