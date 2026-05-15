import { defineCollection, z } from 'astro:content';

const log = defineCollection({
  type: 'content',
  schema: z.object({
    type: z.enum(['film', 'serie', 'boek', 'album', 'game', 'anders']),
    title: z.string(),
    creator: z.string(),
    year: z.number().int(),
    date: z.coerce.date(),
    rating: z.number().min(0).max(5).refine(
      (v) => v * 2 === Math.round(v * 2),
      { message: 'Rating moet een veelvoud van 0.5 zijn (bv. 3, 3.5, 4)' }
    ),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
    link: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { log };
