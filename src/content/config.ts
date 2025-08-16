import { defineCollection, z } from 'astro:content';

const portfolioCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    youtubeId: z.string(),
    thumbnail: z.string().optional(),
    featured: z.boolean().optional().default(false),
    date: z.date(),
    location: z.string().optional(),
    client: z.string().optional(),
    hoverStartTime: z.number().optional(),
    modalStartTime: z.number().optional()
  })
});

const photographesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    speciality: z.string(),
    images: z.array(z.string()),
    website: z.string().optional(),
    instagram: z.string().optional(),
    featured: z.boolean().optional().default(false)
  })
});

export const collections = {
  portfolio: portfolioCollection,
  photographes: photographesCollection
};