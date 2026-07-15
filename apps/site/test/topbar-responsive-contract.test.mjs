import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const styles = fs.readFileSync(path.join(root, "src/styles/refresh.css"), "utf8");

test("desktop topbar does not restore its full search width before the shell can contain it", () => {
  assert.match(styles, /@media \(min-width:\s*768px\) and \(max-width:\s*1180px\)[\s\S]*?\.home-topbar__search\s*\{\s*display:\s*none/);
  assert.match(styles, /@media \(min-width:\s*1181px\) and \(max-width:\s*1280px\)[\s\S]*?\.home-topbar__search\s*\{[\s\S]*?width:\s*clamp\(188px, 18vw, 220px\)/);
  assert.match(styles, /@media \(min-width:\s*1181px\) and \(max-width:\s*1280px\)[\s\S]*?\.home-topbar__tools\s*\{\s*gap:\s*8px/);
});
