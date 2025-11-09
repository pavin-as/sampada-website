import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string().transform((str) => new Date(str)),
    heroImage: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const collections = { blog };

