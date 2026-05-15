import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const entries = await getCollection('log', ({ data }) => !data.draft);
  entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "Ananta's Medialog",
    description: 'Films, boeken, albums, games en meer — kort gelogd.',
    site: context.site!,
    items: entries.map(entry => ({
      title: `${entry.data.title} — ${entry.data.creator}`,
      pubDate: entry.data.date,
      description: entry.body?.slice(0, 300).trim(),
      link: `/log/${entry.slug}/`,
    })),
    customData: '<language>nl</language>',
  });
}
