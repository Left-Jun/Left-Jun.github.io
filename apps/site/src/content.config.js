import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { isSafeProjectLink, isStablePortfolioType } from "@left-jun/content-model";

const contentStatusSchema = z.enum(["planned", "in-progress", "completed", "paused", "archived"]);
const updateKindSchema = z.enum(["project", "event", "award", "training", "research", "release", "article"]);

const projectFactsSchema = z.strictObject({
  developmentTime: z.string().optional(),
  duration: z.string().optional(),
  team: z.string().optional(),
  event: z.string().optional(),
  competition: z.string().optional(),
  role: z.string().optional(),
  roleNote: z.string().optional(),
  tools: z.string().optional(),
  techNote: z.string().optional(),
  platform: z.string().optional(),
  platformNote: z.string().optional(),
  finishedAt: z.string().optional(),
  trailerDuration: z.string().optional(),
  result: z.string().optional()
});

const projectLinkSchema = z.strictObject({
  label: z.string().min(1),
  url: z.string().min(1).refine(isSafeProjectLink, {
    message: "Project links must use a site-relative, http, or https URL"
  }),
  icon: z.string().optional()
});

const baseSchema = z.looseObject({
  title: z.string(),
  date: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  status: contentStatusSchema.optional(),
  draft: z.boolean().optional().default(false),
  slug: z.string().optional().default(""),
  description: z.string().optional().default(""),
  image: z.string().optional().default(""),
  coverVideo: z.string().optional().default(""),
  categories: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  relatedPages: z.array(z.string()).optional().default([]),
  roleTags: z.array(z.string()).optional().default([]),
  portfolioType: z.union([
    z.literal(""),
    z.string().refine(isStablePortfolioType, {
      message: "Portfolio types must use a lowercase kebab-case token"
    })
  ]).optional().default(""),
  projectFacts: projectFactsSchema.optional(),
  projectLinks: z.array(projectLinkSchema).optional(),
  featured: z.boolean().optional().default(false),
  featuredWeight: z.number().optional().default(999),
  homeHeroWeight: z.number().optional()
});

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

const updateSchema = baseSchema.extend({
  date: z.coerce.date(),
  description: z.string().min(1),
  kind: updateKindSchema,
  relatedPages: z.array(z.string()),
  contribution: z.string().trim().min(1).optional(),
  result: z.string().trim().min(1).optional(),
  featured: z.boolean().optional().default(false),
  featuredWeight: z.number().optional().default(999),
  projectLinks: z.array(projectLinkSchema).optional()
});

const updateCollectionSchema = z.union([
  pageSchema.extend({ sectionIndex: z.literal(true) }),
  updateSchema
]);

const collection = (name, schema = baseSchema, pattern = "**/*.md") => defineCollection({
  loader: glob({
    pattern,
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
  updates: collection("updates", updateCollectionSchema),
  pages: collection("pages", pageSchema)
};
