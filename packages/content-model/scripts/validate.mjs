import path from "node:path";
import fs from "node:fs/promises";
import { validateContentRoot } from "../src/index.js";

async function findRepoRoot(start) {
  let current = start;
  while (true) {
    try {
      const packageJson = JSON.parse(await fs.readFile(path.join(current, "package.json"), "utf8"));
      if (packageJson.workspaces) return current;
    } catch {
      // Keep walking.
    }
    const parent = path.dirname(current);
    if (parent === current) return start;
    current = parent;
  }
}

const repoRoot = await findRepoRoot(process.cwd());
const root = path.resolve(repoRoot, "apps/site/src/content");
const result = await validateContentRoot(root);

if (!result.ok) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(result, null, 2));
