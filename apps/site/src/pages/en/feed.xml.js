import { createFeed } from "../../lib/feed.js";

export function GET(context) {
  return createFeed(context, "en");
}
