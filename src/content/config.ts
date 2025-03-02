import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    featured: z.boolean().default(false),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    author: z.string(),
  }),
});

export const collections = { blog };