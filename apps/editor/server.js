import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  CONTENT_SECTIONS,
  baseEntryId,
  entryRef,
  entryUrl,
  languageFromPath,
  listContentFiles,
  normalizeFrontMatter,
  normalizeSlash,
  readContentFile,
  slugify,
  validateContentRoot,
  validateFrontMatter,
  writeContentFile,
  walkFiles
} from "@left-jun/content-model";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SITE_ROOT = path.join(REPO_ROOT, "apps", "site");
const CONTENT_ROOT = path.join(SITE_ROOT, "src", "content");
const SITE_CONFIG = path.join(SITE_ROOT, "src", "data", "site-config.json");
const PUBLIC_ROOT = path.join(__dirname, "public");
const ASSET_ROOT = path.join(SITE_ROOT, "public", "content-assets");
const PORT = Number(process.env.PORT || 4178);

function isInside(child, parent) {
  const relative = path.relative(parent, child);
  return relative === "" || (!!relative && !relative.startsWith("..") && !path.isAbsolute(relative));
}

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  let data = "";
  for await (const chunk of req) {
    data += chunk;
    if (data.length > 8 * 1024 * 1024) throw new Error("Request body is too large.");
  }
  return data ? JSON.parse(data) : {};
}

function encodeId(value) {
  return Buffer.from(value).toString("base64url");
}

function decodeId(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function publicPreviewPath(entry) {
  const section = entry.section;
  const data = entry.frontMatter ? { slug: entry.frontMatter.slug } : entry.data;
  return entryUrl(section, { ...entry, data }, entry.lang);
}

function listPathForNew(section, slug, lang) {
  const cleanSlug = slugify(slug || "untitled");
  if (section === "pages") {
    return `pages/${cleanSlug}${lang === "en" ? ".en" : ""}.md`;
  }
  return `${section}/${cleanSlug}/index${lang === "en" ? ".en" : ""}.md`;
}

async function listAssetsForEntry(entry) {
  const assetDir = path.join(ASSET_ROOT, entry.section, baseEntryId(entry.path));
  if (!isInside(assetDir, ASSET_ROOT) || !fs.existsSync(assetDir)) return [];
  const files = await walkFiles(assetDir, (file) => (
    /\.(png|jpe?g|webp|gif|svg|mp4|webm|pdf)$/i.test(file)
    && !/-\d+\.webp$/i.test(file)
  ));
  return files.map((file) => {
    const relative = normalizeSlash(path.relative(assetDir, file));
    return {
      name: relative,
      url: `/content-assets/${entry.section}/${baseEntryId(entry.path)}/${relative}`
    };
  });
}

async function listContent() {
  const entries = (await listContentFiles(CONTENT_ROOT))
    .filter((entry) => !entry.isSectionIndex)
    .map((entry) => {
      const slug = slugify(entry.frontMatter.slug || baseEntryId(entry.path));
      return {
        id: encodeId(entry.path),
        path: entry.path,
        section: entry.section,
        lang: entry.lang,
        pairKey: `${entry.section}/${baseEntryId(entry.path)}`,
        ref: entryRef(entry.section, entry.path),
        title: entry.frontMatter.title || slug,
        slug,
        date: entry.frontMatter.date || "",
        description: entry.frontMatter.description || "",
        categories: entry.frontMatter.categories || [],
        tags: entry.frontMatter.tags || [],
        relatedPages: entry.frontMatter.relatedPages || [],
        previewUrl: publicPreviewPath(entry)
      };
    });

  const pairs = Object.values(entries.reduce((acc, entry) => {
    acc[entry.pairKey] = acc[entry.pairKey] || {
      key: entry.pairKey,
      section: entry.section,
      title: entry.title,
      zh: null,
      en: null
    };
    acc[entry.pairKey][entry.lang === "en" ? "en" : "zh"] = entry.id;
    return acc;
  }, {}));

  return {
    entries: entries.sort((a, b) => String(b.date).localeCompare(String(a.date)) || a.title.localeCompare(b.title)),
    pairs
  };
}

async function readContent(id) {
  const entry = await readContentFile(CONTENT_ROOT, decodeId(id));
  return {
    id,
    ...entry,
    frontMatter: normalizeFrontMatter(entry.frontMatter),
    previewUrl: publicPreviewPath(entry),
    assets: await listAssetsForEntry(entry)
  };
}

async function saveContent(id, payload) {
  const frontMatter = normalizeFrontMatter(payload.frontMatter || {});
  if (!frontMatter.title) throw new Error("title is required.");
  validateFrontMatter(frontMatter, { section: payload.section || "posts" });

  let relativePath;
  if (id && id !== "new") {
    relativePath = decodeId(id);
  } else {
    const section = CONTENT_SECTIONS.includes(payload.section) ? payload.section : "posts";
    relativePath = listPathForNew(section, frontMatter.slug || frontMatter.title, payload.lang || "zh-cn");
  }

  const absolute = path.resolve(CONTENT_ROOT, normalizeSlash(relativePath));
  if (!isInside(absolute, CONTENT_ROOT) || !absolute.endsWith(".md")) {
    throw new Error("Refusing to write outside Astro content root.");
  }

  const saved = await writeContentFile(CONTENT_ROOT, relativePath, frontMatter, payload.body || "");
  return readContent(encodeId(saved.path));
}

async function readSiteConfig() {
  return JSON.parse(await fsp.readFile(SITE_CONFIG, "utf8"));
}

async function saveSiteConfig(body) {
  const absolute = path.resolve(SITE_CONFIG);
  if (!isInside(absolute, path.join(SITE_ROOT, "src", "data"))) {
    throw new Error("Refusing to write outside site data directory.");
  }
  await fsp.writeFile(absolute, `${JSON.stringify(body, null, 2)}\n`, "utf8");
  return readSiteConfig();
}

function runBuild() {
  return new Promise((resolve) => {
    const command = "npm run optimize:media && npm run validate:content && npm run build:site";
    const child = process.platform === "win32"
      ? spawn(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", command], { cwd: REPO_ROOT })
      : spawn("sh", ["-c", command], { cwd: REPO_ROOT });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", (error) => resolve({ code: 1, stdout, stderr: error.message }));
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

async function handleApi(req, res, url) {
  try {
    const contentMatch = url.pathname.match(/^\/api\/content\/([^/]+)$/);
    if (req.method === "GET" && url.pathname === "/api/content") {
      return json(res, 200, await listContent());
    }
    if (req.method === "GET" && contentMatch) {
      return json(res, 200, await readContent(contentMatch[1]));
    }
    if (req.method === "POST" && contentMatch) {
      return json(res, 200, await saveContent(contentMatch[1], await readJson(req)));
    }
    if (req.method === "GET" && url.pathname === "/api/site-config") {
      return json(res, 200, await readSiteConfig());
    }
    if (req.method === "POST" && url.pathname === "/api/site-config") {
      return json(res, 200, await saveSiteConfig(await readJson(req)));
    }
    if (req.method === "POST" && url.pathname === "/api/validate") {
      return json(res, 200, await validateContentRoot(CONTENT_ROOT));
    }
    if (req.method === "POST" && url.pathname === "/api/build") {
      return json(res, 200, await runBuild());
    }
    return json(res, 404, { error: "API route not found." });
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
}

async function serveStatic(req, res, url) {
  const relative = normalizeSlash(url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname));
  const absolute = path.resolve(PUBLIC_ROOT, relative);
  if (!isInside(absolute, PUBLIC_ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  try {
    const data = await fsp.readFile(absolute);
    const ext = path.extname(absolute);
    const types = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8"
    };
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);
  if (url.pathname.startsWith("/api/")) return handleApi(req, res, url);
  return serveStatic(req, res, url);
}).listen(PORT, "127.0.0.1", () => {
  console.log(`Left Jun Astro Editor: http://127.0.0.1:${PORT}/`);
});
