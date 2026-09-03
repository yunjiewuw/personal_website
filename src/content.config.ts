import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Morandi accent names used for thumbnails / avatars / tags across the site.
const morandi = z.enum(['sage', 'clay', 'slate', 'mauve', 'sand', 'fog']);

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    status: z.enum(['under-review', 'in-progress', 'published']),
    category: z.string(),          // e.g. "Neuroscience"
    summary: z.string(),           // one-liner shown on the card
    order: z.number().default(0),  // manual sort, ascending
    color: morandi.default('sage'),
    image: z.string().optional(),        // preview/hero photo, e.g. '/project-x.jpg'
    imageCredit: z.string().optional(),  // raw HTML credit shown under the hero photo
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.enum(['reflective', 'science-observation', 'industry-observation', 'opinion']),
    summary: z.string(),           // one-liner shown on the card
    color: morandi.default('fog'),
    image: z.string().optional(),        // preview/hero photo, e.g. '/post-x.jpg'
    imageCredit: z.string().optional(),  // raw HTML credit shown under the hero photo
    tags: z.array(z.string()).optional(),  // freeform topic/project labels, shown on the article page
    draft: z.boolean().default(false),
  }),
});

export const collections = { research, writing };
