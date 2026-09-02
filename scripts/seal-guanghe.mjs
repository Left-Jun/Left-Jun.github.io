import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "@11ty/gray-matter";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.resolve(repoRoot, "..");
const sourceRoot = path.resolve(process.env.GUANGHE_SOURCE_DIR || path.join(workspaceRoot, "_private", "guanghe-source"));
const passwordFile = path.resolve(process.env.GUANGHE_ACCESS_PASSWORD_FILE || path.join(workspaceRoot, "_private", "credentials", "guanghe-access.txt"));
const outputRoot = path.join(repoRoot, "apps", "site", "public", "protected", "guanghe");
const assetOutputRoot = path.join(outputRoot, "assets");
const iterations = 600_000;
const projectSlugs = ["action-game-ip-design", "ai-game-creation-research", "ai-game-project-management"];
const languages = [
  { key: "zh-cn", suffix: "zh-cn", file: "index.md" },
  { key: "en", suffix: "en", file: "index.en.md" }
];

const mimeTypes = new Map([
  [".pdf", "application/pdf"],
  [".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  [".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  [".zip", "application/zip"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".txt", "text/plain;charset=utf-8"]
]);

function encode(value) {
  return Buffer.from(value).toString("base64");
}

function encrypt(buffer, key, aad) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(aad));
  const ciphertext = Buffer.concat([cipher.update(buffer), cipher.final(), cipher.getAuthTag()]);
  return { iv: encode(iv), ciphertext: encode(ciphertext), aad };
}

function readPassword() {
  if (process.env.GUANGHE_ACCESS_PASSWORD) return process.env.GUANGHE_ACCESS_PASSWORD;
  return fs.readFile(passwordFile, "utf8").then((value) => {
    const match = value.match(/^Password:\s*(.+)$/m);
    if (!match?.[1]) throw new Error(`Password file has no Password entry: ${passwordFile}`);
    return match[1].trim();
  });
}

async function listFiles(root) {
  const result = [];
  async function visit(directory) {
    for (const item of await fs.readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, item.name);
      if (item.isDirectory()) await visit(absolute);
      else if (item.isFile()) result.push(absolute);
    }
  }
  await visit(root);
  return result.sort();
}

function sourcePathForUrl(slug, url) {
  const prefix = `/content-assets/projects/${slug}/`;
  if (!String(url || "").startsWith(prefix)) return null;
  const relative = String(url).slice(prefix.length).replace(/^\/+/, "");
  return path.resolve(sourceRoot, slug, relative);
}

function mapAttachment(attachment, assetByPath) {
  const next = { ...attachment };
  for (const [field, outputField] of [["previewUrl", "previewAsset"], ["downloadUrl", "downloadAsset"]]) {
    if (!attachment[field]) {
      delete next[field];
      continue;
    }
    const sourcePath = sourcePathForUrl(attachment.slug, attachment[field]);
    const asset = sourcePath && assetByPath.get(sourcePath);
    if (!asset) throw new Error(`Attachment asset not found: ${attachment[field]}`);
    next[outputField] = asset.id;
    delete next[field];
  }
  delete next.slug;
  return next;
}

async function main() {
  const password = await readPassword();
  if (password.length < 12) throw new Error("Guanghe access password must contain at least 12 characters");
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256");
  await fs.rm(outputRoot, { recursive: true, force: true });
  await fs.mkdir(assetOutputRoot, { recursive: true });

  const assetByPath = new Map();
  const assetRecords = {};
  let assetCount = 0;
  let byteCount = 0;
  for (const slug of projectSlugs) {
    const files = await listFiles(path.join(sourceRoot, slug));
    for (const sourcePath of files) {
      const relativePath = path.relative(path.join(sourceRoot, slug), sourcePath).replace(/\\/g, "/");
      if (relativePath.startsWith(`${slug}/`)) continue;
      const bytes = await fs.readFile(sourcePath);
      const id = crypto.createHash("sha256").update(`${slug}/${relativePath}`).digest("hex").slice(0, 24);
      const encrypted = encrypt(bytes, key, `asset:${id}`);
      await fs.writeFile(path.join(assetOutputRoot, `${id}.bin`), Buffer.from(encrypted.ciphertext, "base64"));
      const record = {
        id,
        slug,
        filename: path.basename(sourcePath),
        relativePath,
        mime: mimeTypes.get(path.extname(sourcePath).toLowerCase()) || "application/octet-stream",
        size: bytes.length,
        sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
        url: `/protected/guanghe/assets/${id}.bin`,
        iv: encrypted.iv,
        aad: encrypted.aad
      };
      assetByPath.set(path.resolve(sourcePath), record);
      assetRecords[id] = record;
      assetCount += 1;
      byteCount += bytes.length;
    }
  }

  const projects = [];
  for (const slug of projectSlugs) {
    for (const language of languages) {
      const filePath = path.join(sourceRoot, "frontmatter", `${slug}.${language.suffix}.md`);
      const source = await fs.readFile(filePath, "utf8");
      const parsed = matter(source);
      const data = { ...parsed.data };
      const groups = Array.isArray(data.attachmentGroups) ? data.attachmentGroups : [];
      const attachmentGroups = groups.map((group) => ({
        ...group,
        attachments: (group.attachments || []).map((attachment) => mapAttachment({ ...attachment, slug }, assetByPath))
      }));
      projects.push({
        slug,
        lang: language.key,
        body: parsed.content || "",
        projectFacts: data.projectFacts || {},
        mentorFeedback: data.mentorFeedback || "",
        attachmentGroups
      });
    }
  }

  const payload = encrypt(Buffer.from(JSON.stringify({ projects, assets: assetRecords })), key, "manifest:v1");
  const verifier = encrypt(Buffer.from("leftjun-guanghe-access-v1"), key, "verifier:v1");
  const manifest = {
    version: 1,
    algorithm: "AES-256-GCM",
    kdf: { name: "PBKDF2", hash: "SHA-256", iterations, keyLength: 256 },
    salt: encode(salt),
    verifier,
    payload
  };
  await fs.writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Sealed ${projects.length} localized projects and ${assetCount} assets (${byteCount} source bytes).`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
