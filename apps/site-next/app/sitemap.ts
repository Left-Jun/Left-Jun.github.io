import type { MetadataRoute } from "next";
import { staticUrls } from "../lib/content";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls = Array.from(new Set(await staticUrls()));
  return urls.map((url) => ({
    url: `https://leftjun.com${url}`,
    lastModified: new Date()
  }));
}
