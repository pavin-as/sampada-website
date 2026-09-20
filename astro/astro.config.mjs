// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Internal staff/tool redirect pages: they must stay out of the public sitemap.
const INTERNAL_PATHS = ['/akshay/', '/content/', '/inventory/', '/queue/', '/sudarshan/', '/syamili/', '/wellness/'];

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
      // Only public clinic pages belong in the sitemap.
      filter: (page) => !INTERNAL_PATHS.includes(new URL(page).pathname),
    }),
  ],
});
