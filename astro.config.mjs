import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Pas dit aan naar het definitieve subdomein voor deployment
  site: 'https://log.ananta.work',
  integrations: [sitemap()],
});
