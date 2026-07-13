import { buildSearchIndex, searchIndexResponse } from "../../lib/search.js";

export const prerender = true;

export async function GET() {
  return searchIndexResponse(await buildSearchIndex("en"));
}
