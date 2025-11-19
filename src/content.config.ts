import { defineCollection, z } from "astro:content";

import { glob, file } from "astro/loaders";

const directories = defineCollection({
	loader: file('src/data/directories.yaml'),
	schema: z.object({
		name: z.string(),
		icon: z.string()
	})
})

const files = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/posts/" }),
	schema: z.object({
		name: z.string(),
		year: z.number(),
		directory: z.string()
	})
})

export const collections = { directories, files };
