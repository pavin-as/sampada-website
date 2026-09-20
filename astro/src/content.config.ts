import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.string().transform((str) => new Date(str)),
  heroImage: z.string().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
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


const treatments = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/treatments' }),
  schema: z.object({
    title: z.string(),            // <title> tag
    h1: z.string(),               // visible H1
    description: z.string(),      // meta description
    procedureName: z.string(),    // schema.org name
    procedureType: z.enum(['MedicalProcedure', 'MedicalTest']).default('MedicalProcedure'),
    summary: z.string(),          // lead paragraph under the H1
    order: z.number().default(50),
    heroImage: z.string().optional(),
    reviewedBy: z.string().default('Dr Sameera V V'),
    reviewedOn: z.string(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

export const collections = { blog, 'blog-ml': blogMl, treatments };