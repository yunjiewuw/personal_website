// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Used for canonical URLs, sitemap, and RSS links.
export default defineConfig({
  site: 'https://me.yunjietracker.com',
  integrations: [sitemap()],
});
