import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, "..");
const astroPublic = path.resolve(appRoot, "..", "site", "public");
const nextPublic = path.join(appRoot, "public");

async function copyIfExists(name) {
  const from = path.join(astroPublic, name);
  const to = path.join(nextPublic, name);
  try {
    await fs.rm(to, { recursive: true, force: true });
    await fs.cp(from, to, { recursive: true });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

await fs.mkdir(nextPublic, { recursive: true });
for (const name of ["content-assets", "files", "icons", "img", "favicon.ico", "CNAME"]) {
  await copyIfExists(name);
}
