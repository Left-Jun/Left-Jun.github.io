const http = require('node:http');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const { spawn } = require('node:child_process');

const PORT = Number(process.env.PORT || 4177);
const ROOT = path.resolve(__dirname, '..', '..');
const CONTENT_ROOT = path.join(ROOT, 'content');
const STATIC_IMG_ROOT = path.join(ROOT, 'static', 'img');
const PUBLIC_ROOT = path.join(__dirname, 'public');
const HUGO_CONFIG = path.join(ROOT, 'hugo.yaml');
const ALLOWED_SECTIONS = new Set(['posts', 'projects', 'retrospectives', 'plans']);

function isInside(child, parent) {
  const relative = path.relative(parent, child);
  return relative === '' || (!!relative && !relative.startsWith('..') && !path.isAbsolute(relative));
}

function normalizeRelative(input) {
  return String(input || '').replace(/\\/g, '/').replace(/^\/+/, '');
}

function contentPath(relativePath) {
  const normalized = normalizeRelative(relativePath);
  const absolute = path.resolve(ROOT, normalized);
  if (!isInside(absolute, CONTENT_ROOT)) {
    throw new Error('Path is outside content directory.');
  }
  return absolute;
}

function staticImagePath(relativePath) {
  const normalized = normalizeRelative(relativePath);
  const absolute = path.resolve(ROOT, normalized);
  if (!isInside(absolute, STATIC_IMG_ROOT)) {
    throw new Error('Path is outside static/img directory.');
  }
  return absolute;
}

function json(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(body));
}

function readRequest(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 8 * 1024 * 1024) {
        reject(new Error('Request body is too large.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(new Error('Invalid JSON body.'));
      }
    });
    req.on('error', reject);
  });
}

function splitFrontMatter(raw) {
  const normalized = raw.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    return { frontMatter: {}, body: normalized };
  }

  const end = normalized.indexOf('\n---', 4);
  if (end === -1) {
    return { frontMatter: {}, body: normalized };
  }

  const yaml = normalized.slice(4, end).trim();
  const body = normalized.slice(end + 5).replace(/^\n/, '');
  return { frontMatter: parseYaml(yaml), body };
}

function countIndent(line) {
  return line.match(/^ */)[0].length;
}

function splitKeyValue(text) {
  const index = text.indexOf(':');
  if (index === -1) return [text.trim(), ''];
  return [text.slice(0, index).trim(), text.slice(index + 1).trim()];
}

function parseScalar(value) {
  const trimmed = String(value || '').trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).replace(/\\"/g, '"');
  }
  if (trimmed === '[]') return [];
  return trimmed;
}

function nextNonBlank(lines, start) {
  for (let i = start; i < lines.length; i += 1) {
    if (lines[i].trim()) return i;
  }
  return -1;
}

function parseYamlBlock(lines, start, indent) {
  const first = nextNonBlank(lines, start);
  const isArray = first !== -1 && countIndent(lines[first]) === indent && lines[first].trim().startsWith('- ');
  const container = isArray ? [] : {};
  let index = start;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const lineIndent = countIndent(line);
    if (lineIndent < indent) break;
    if (lineIndent > indent) {
      index += 1;
      continue;
    }

    const trimmed = line.trim();

    if (isArray) {
      if (!trimmed.startsWith('- ')) break;
      const rest = trimmed.slice(2).trim();
      if (rest.includes(':')) {
        const item = {};
        const [key, value] = splitKeyValue(rest);
        if (value) item[key] = parseScalar(value);
        index += 1;

        while (index < lines.length) {
          const child = lines[index];
          if (!child.trim()) {
            index += 1;
            continue;
          }
          const childIndent = countIndent(child);
          if (childIndent <= indent) break;
          if (childIndent === indent + 2) {
            const [childKey, childValue] = splitKeyValue(child.trim());
            if (childValue) {
              item[childKey] = parseScalar(childValue);
              index += 1;
            } else {
              const parsed = parseYamlBlock(lines, index + 1, childIndent + 2);
              item[childKey] = parsed.value;
              index = parsed.index;
            }
          } else {
            index += 1;
          }
        }

        container.push(item);
      } else {
        container.push(parseScalar(rest));
        index += 1;
      }
      continue;
    }

    if (trimmed.startsWith('- ')) break;
    const [key, value] = splitKeyValue(trimmed);
    if (value) {
      container[key] = parseScalar(value);
      index += 1;
    } else {
      const next = nextNonBlank(lines, index + 1);
      if (next === -1 || countIndent(lines[next]) <= indent) {
        container[key] = {};
        index += 1;
      } else {
        const parsed = parseYamlBlock(lines, index + 1, countIndent(lines[next]));
        container[key] = parsed.value;
        index = parsed.index;
      }
    }
  }

  return { value: container, index };
}

function parseYaml(yaml) {
  const lines = yaml.replace(/\r/g, '').split('\n');
  return parseYamlBlock(lines, 0, 0).value || {};
}

function quoteScalar(value) {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (value === null || value === undefined) return '""';
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) return text;
  return `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function stringifyYamlValue(key, value, indent) {
  const pad = ' '.repeat(indent);
  if (Array.isArray(value)) {
    if (!value.length) return `${pad}${key}: []\n`;
    let output = `${pad}${key}:\n`;
    for (const item of value) {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        const entries = Object.entries(item);
        if (!entries.length) {
          output += `${pad}  - {}\n`;
        } else {
          const [firstKey, firstValue] = entries[0];
          output += `${pad}  - ${firstKey}: ${quoteScalar(firstValue)}\n`;
          for (const [childKey, childValue] of entries.slice(1)) {
            output += stringifyYamlValue(childKey, childValue, indent + 4);
          }
        }
      } else {
        output += `${pad}  - ${quoteScalar(item)}\n`;
      }
    }
    return output;
  }

  if (value && typeof value === 'object') {
    let output = `${pad}${key}:\n`;
    for (const [childKey, childValue] of Object.entries(value)) {
      output += stringifyYamlValue(childKey, childValue, indent + 2);
    }
    return output;
  }

  return `${pad}${key}: ${quoteScalar(value)}\n`;
}

function stringifyFrontMatter(frontMatter) {
  let output = '---\n';
  for (const [key, value] of Object.entries(frontMatter)) {
    if (value === '' || value === undefined) continue;
    output += stringifyYamlValue(key, value, 0);
  }
  return `${output}---\n\n`;
}

function slugify(text) {
  return String(text || 'untitled')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'untitled';
}

async function walkMarkdown(dir, section, output) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkMarkdown(absolute, section, output);
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== '_index.md') {
      const raw = await fsp.readFile(absolute, 'utf8');
      const { frontMatter } = splitFrontMatter(raw);
      output.push({
        path: path.relative(ROOT, absolute).replace(/\\/g, '/'),
        section,
        title: frontMatter.title || path.basename(entry.name, '.md'),
        slug: frontMatter.slug || '',
        date: frontMatter.date || '',
        description: frontMatter.description || '',
        categories: frontMatter.categories || [],
        tags: frontMatter.tags || [],
        relatedPages: frontMatter.relatedPages || []
      });
    }
  }
}

async function listContent() {
  const sections = ['posts', 'projects', 'retrospectives', 'plans'];
  const pages = [];
  for (const section of sections) {
    const dir = path.join(CONTENT_ROOT, section);
    if (fs.existsSync(dir)) await walkMarkdown(dir, section, pages);
  }
  return pages.sort((a, b) => String(b.date).localeCompare(String(a.date)) || a.title.localeCompare(b.title));
}

async function readContent(relativePath) {
  const absolute = contentPath(relativePath);
  const raw = await fsp.readFile(absolute, 'utf8');
  const { frontMatter, body } = splitFrontMatter(raw);
  return {
    path: path.relative(ROOT, absolute).replace(/\\/g, '/'),
    frontMatter,
    body
  };
}

function cleanFrontMatter(input) {
  const copy = { ...input };
  for (const key of ['categories', 'tags', 'roleTags', 'relatedPages']) {
    if (typeof copy[key] === 'string') {
      copy[key] = copy[key].split(/\n|,/).map(item => item.trim()).filter(Boolean);
    }
  }
  if (typeof copy.projectFacts === 'string') {
    try { copy.projectFacts = JSON.parse(copy.projectFacts || '{}'); } catch { copy.projectFacts = {}; }
  }
  if (typeof copy.projectLinks === 'string') {
    try { copy.projectLinks = JSON.parse(copy.projectLinks || '[]'); } catch { copy.projectLinks = []; }
  }
  return copy;
}

async function saveContent(payload) {
  const section = payload.section || 'posts';
  if (!ALLOWED_SECTIONS.has(section)) {
    throw new Error('Unsupported content section.');
  }

  const frontMatter = cleanFrontMatter(payload.frontMatter || {});
  if (!frontMatter.title) {
    throw new Error('Front matter title is required.');
  }

  const body = String(payload.body || '').replace(/\r\n/g, '\n').trimEnd() + '\n';
  let relativePath = payload.path;

  if (payload.saveAsNew || !relativePath) {
    const slug = slugify(frontMatter.slug || frontMatter.title);
    frontMatter.slug = frontMatter.slug || slug;
    relativePath = `content/${section}/${slug}/index.md`;
  }

  const absolute = contentPath(relativePath);
  if (!absolute.endsWith('.md')) {
    throw new Error('Only Markdown files can be saved.');
  }

  await fsp.mkdir(path.dirname(absolute), { recursive: true });
  await fsp.writeFile(absolute, stringifyFrontMatter(frontMatter) + body, 'utf8');
  return readContent(path.relative(ROOT, absolute));
}

function yamlPathForLine(lines, index) {
  const stack = [];
  for (let i = 0; i <= index; i += 1) {
    const line = lines[i];
    if (!line || !line.trim() || line.trim().startsWith('- ')) continue;
    const match = line.match(/^(\s*)([A-Za-z0-9_-]+):/);
    if (!match) continue;
    const indent = match[1].length;
    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
    stack.push({ indent, key: match[2] });
  }
  return stack.map(item => item.key);
}

function getStatusBlock(lines, target) {
  for (let i = 0; i < lines.length; i += 1) {
    if (!lines[i].match(/^\s*status:\s*$/)) continue;
    const pathKeys = yamlPathForLine(lines, i);
    if (pathKeys.join('/') !== target.join('/')) continue;
    const indent = countIndent(lines[i]);
    const block = {};
    for (let j = i + 1; j < lines.length; j += 1) {
      if (!lines[j].trim()) continue;
      if (countIndent(lines[j]) <= indent) break;
      const [key, value] = splitKeyValue(lines[j].trim());
      block[key] = parseScalar(value);
    }
    return block;
  }
  return {};
}

function replaceStatusBlock(lines, target, data) {
  for (let i = 0; i < lines.length; i += 1) {
    if (!lines[i].match(/^\s*status:\s*$/)) continue;
    const pathKeys = yamlPathForLine(lines, i);
    if (pathKeys.join('/') !== target.join('/')) continue;
    const indent = countIndent(lines[i]);
    let end = i + 1;
    while (end < lines.length && (!lines[end].trim() || countIndent(lines[end]) > indent)) end += 1;
    const childPad = ' '.repeat(indent + 2);
    const replacement = [
      lines[i],
      `${childPad}emoji: ${quoteScalar(data.emoji || '')}`,
      `${childPad}title: ${quoteScalar(data.title || '')}`,
      `${childPad}description: ${quoteScalar(data.description || '')}`
    ];
    lines.splice(i, end - i, ...replacement);
    return;
  }
}

async function readStatus() {
  const lines = (await fsp.readFile(HUGO_CONFIG, 'utf8')).replace(/\r\n/g, '\n').split('\n');
  return {
    zh: getStatusBlock(lines, ['params', 'sidebar', 'status']),
    en: getStatusBlock(lines, ['languages', 'en', 'params', 'sidebar', 'status'])
  };
}

async function saveStatus(status) {
  const lines = (await fsp.readFile(HUGO_CONFIG, 'utf8')).replace(/\r\n/g, '\n').split('\n');
  replaceStatusBlock(lines, ['params', 'sidebar', 'status'], status.zh || {});
  replaceStatusBlock(lines, ['languages', 'en', 'params', 'sidebar', 'status'], status.en || {});
  await fsp.writeFile(HUGO_CONFIG, lines.join('\n'), 'utf8');
  return readStatus();
}

function runBuild() {
  return new Promise((resolve) => {
    const hugo = path.join(ROOT, 'hugo.exe');
    const child = spawn(hugo, ['--gc', '--minify', '--destination', '.portfolio-build'], {
      cwd: ROOT,
      shell: false
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', chunk => stdout += chunk.toString());
    child.stderr.on('data', chunk => stderr += chunk.toString());
    child.on('close', code => resolve({ code, stdout, stderr }));
  });
}

async function handleApi(req, res, url) {
  try {
    if (req.method === 'GET' && url.pathname === '/api/content') {
      return json(res, 200, { pages: await listContent() });
    }

    if (req.method === 'GET' && url.pathname === '/api/content/read') {
      return json(res, 200, await readContent(url.searchParams.get('path')));
    }

    if (req.method === 'POST' && url.pathname === '/api/content/save') {
      return json(res, 200, await saveContent(await readRequest(req)));
    }

    if (req.method === 'GET' && url.pathname === '/api/status') {
      return json(res, 200, await readStatus());
    }

    if (req.method === 'POST' && url.pathname === '/api/status') {
      return json(res, 200, await saveStatus(await readRequest(req)));
    }

    if (req.method === 'POST' && url.pathname === '/api/build') {
      return json(res, 200, await runBuild());
    }

    if (req.method === 'GET' && url.pathname === '/api/taxonomies') {
      const pages = await listContent();
      const categories = [...new Set(pages.flatMap(page => page.categories || []))].sort();
      const tags = [...new Set(pages.flatMap(page => page.tags || []))].sort();
      return json(res, 200, { categories, tags });
    }

    json(res, 404, { error: 'API route not found.' });
  } catch (error) {
    json(res, 500, { error: error.message });
  }
}

async function serveStatic(req, res, url) {
  let relative = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const absolute = path.resolve(PUBLIC_ROOT, `.${relative}`);
  if (!isInside(absolute, PUBLIC_ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  try {
    const data = await fsp.readFile(absolute);
    const ext = path.extname(absolute);
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8'
    };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
  if (url.pathname.startsWith('/api/')) return handleApi(req, res, url);
  return serveStatic(req, res, url);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Left Jun Site Editor: http://127.0.0.1:${PORT}/`);
});
