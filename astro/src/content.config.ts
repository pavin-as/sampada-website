import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.string().transform((str) => new Date(str)),
  heroImage: z.string().optional(),
  category: z.string().optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: blogSchema,
});

// Malayalam translations. A post here should share its filename (slug) with
// the English post it translates, so the language toggle can link between them.
const blogMl = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog-ml' }),
  schema: blogSchema,
});

export const collections = { blog, 'blog-ml': blogMl };