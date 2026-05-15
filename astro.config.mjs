import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL instellen in Vercel's omgevingsvariabelen zodra het project live is.
// VERCEL_PROJECT_PRODUCTION_URL is de stabiele productie-URL die Vercel zelf meegeeft.
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

export default defineConfig({
  site,
  integrations: [sitemap()],
});
