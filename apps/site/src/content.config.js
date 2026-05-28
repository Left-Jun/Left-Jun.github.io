import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const baseSchema = z.object({
  title: z.string(),
  date: z.coerce.date().optional(),
  draft: z.boolean().optional().default(false),
  slug: z.string().optional().default(""),
  description: z.string().optional().default(""),
  image: z.string().optional().default(""),
  coverVideo: z.string().optional().default(""),
  categories: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  relatedPages: z.array(z.string()).optional().default([]),
  roleTags: z.array(z.string()).optional().default([]),
  portfolioType: z.string().optional().default(""),
  projectFacts: z.record(z.string(), z.unknown()).optional(),
  projectLinks: z.array(z.record(z.string(), z.unknown())).optional(),
  featured: z.boolean().optional().default(false),
  featuredWeight: z.number().optional().default(999)
}).passthrough();

const pageSchema = baseSchema.extend({
  countSuffix: z.string().optional(),
  typeTitle: z.string().optional(),
  indexTitle: z.string().optional(),
  singleViewLabel: z.string().optional(),
  gridViewLabel: z.string().optional(),
  gameFilterLabel: z.string().optional(),
  embeddedFilterLabel: z.string().optional(),
  viewAriaLabel: z.string().optional(),
  filterAriaLabel: z.string().optional()
});

const collection = (name, schema = baseSchema) => defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: `./src/content/${name}`,
    generateId: ({ entry }) => entry.replace(/\\/g, "/").replace(/\.md$/i, "")
  }),
  schema
});

export const collections = {
  projects: collection("projects", pageSchema),
  posts: collection("posts", pageSchema),
  retrospectives: collection("retrospectives", pageSchema),
  plans: collection("plans", pageSchema),
  pages: collection("pages", pageSchema)
};
