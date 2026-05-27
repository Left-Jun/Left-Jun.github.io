const state = {
  pages: [],
  current: null,
  taxonomies: { categories: [], tags: [] }
};

const $ = (selector) => document.querySelector(selector);

function log(message) {
  const box = $('#log');
  box.textContent = typeof message === 'string' ? message : JSON.stringify(message, null, 2);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || 'Request failed');
  return data;
}

function listToText(value) {
  return Array.isArray(value) ? value.join('\n') : (value || '');
}

function textToList(value) {
  return String(value || '').split(/\n|,/).map(item => item.trim()).filter(Boolean);
}

function getSection() {
  return $('#sectionFilter').value;
}

function filterPages() {
  const section = getSection();
  const query = $('#searchInput').value.trim().toLowerCase();
  return state.pages.filter((page) => {
    if (page.section !== section) return false;
    if (!query) return true;
    return [page.title, page.slug, page.path, ...(page.tags || []), ...(page.categories || [])]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });
}

function renderList() {
  const list = $('#contentList');
  list.innerHTML = '';
  for (const page of filterPages()) {
    const li = document.createElement('li');
    const button = document.createElement('button');
    if (state.current?.path === page.path) button.classList.add('active');
    button.innerHTML = `<strong>${page.title}</strong><small>${page.path}</small>`;
    button.addEventListener('click', () => openPage(page.path));
    li.append(button);
    list.append(li);
  }
}

function renderRelatedPicker() {
  const box = $('#relatedPicker');
  const currentPath = state.current?.path || '';
  const selected = new Set(state.current?.frontMatter?.relatedPages || []);
  box.innerHTML = '';

  for (const page of state.pages) {
    if (page.path === currentPath) continue;
    const ref = page.path
      .replace(/^content\//, '')
      .replace(/\/index\.md$/, '')
      .replace(/\.en\.md$/, '')
      .replace(/\.md$/, '');
    const label = document.createElement('label');
    const checked = selected.has(ref) ? 'checked' : '';
    label.innerHTML = `<input type="checkbox" value="${ref}" ${checked}><span><strong>${page.title}</strong><br><small>${ref}</small></span>`;
    box.append(label);
  }
}

function fillForm(page) {
  state.current = page;
  const fm = page.frontMatter || {};
  $('#pathField').value = page.path || '';
  $('#titleField').value = fm.title || '';
  $('#slugField').value = fm.slug || '';
  $('#dateField').value = fm.date || '';
  $('#draftField').checked = !!fm.draft;
  $('#descriptionField').value = fm.description || '';
  $('#imageField').value = fm.image || '';
  $('#portfolioTypeField').value = fm.portfolioType || '';
  $('#categoriesField').value = listToText(fm.categories);
  $('#tagsField').value = listToText(fm.tags);
  $('#roleTagsField').value = listToText(fm.roleTags);
  $('#projectFactsField').value = JSON.stringify(fm.projectFacts || {}, null, 2);
  $('#projectLinksField').value = JSON.stringify(fm.projectLinks || [], null, 2);
  $('#bodyField').value = page.body || '';
  renderRelatedPicker();
  renderList();
}

function readForm() {
  const relatedPages = [...document.querySelectorAll('#relatedPicker input:checked')].map(input => input.value);
  const frontMatter = {
    ...(state.current?.frontMatter || {}),
    title: $('#titleField').value.trim(),
    date: $('#dateField').value.trim(),
    draft: $('#draftField').checked,
    slug: $('#slugField').value.trim(),
    description: $('#descriptionField').value.trim(),
    image: $('#imageField').value.trim(),
    categories: textToList($('#categoriesField').value),
    tags: textToList($('#tagsField').value),
    relatedPages
  };

  if ($('#portfolioTypeField').value.trim()) frontMatter.portfolioType = $('#portfolioTypeField').value.trim();
  if ($('#roleTagsField').value.trim()) frontMatter.roleTags = textToList($('#roleTagsField').value);

  const facts = $('#projectFactsField').value.trim();
  const links = $('#projectLinksField').value.trim();
  if (facts) frontMatter.projectFacts = JSON.parse(facts);
  if (links) frontMatter.projectLinks = JSON.parse(links);

  return {
    section: getSection(),
    path: $('#pathField').value.trim(),
    frontMatter,
    body: $('#bodyField').value
  };
}

async function loadContent() {
  const [content, taxonomies] = await Promise.all([
    api('/api/content'),
    api('/api/taxonomies')
  ]);
  state.pages = content.pages;
  state.taxonomies = taxonomies;
  renderList();
  log(`已加载 ${state.pages.length} 个内容文件。`);
}

async function openPage(path) {
  const page = await api(`/api/content/read?path=${encodeURIComponent(path)}`);
  fillForm(page);
  log(`已打开：${path}`);
}

function newPage() {
  const now = new Date();
  const iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 19) + '+08:00';
  fillForm({
    path: '',
    frontMatter: {
      title: '',
      date: iso,
      draft: false,
      slug: '',
      description: '',
      categories: [],
      tags: [],
      relatedPages: []
    },
    body: ''
  });
  log('已创建空白草稿。填写 title 和 slug 后可以保存。');
}

async function save(saveAsNew = false) {
  const payload = readForm();
  payload.saveAsNew = saveAsNew;
  const saved = await api('/api/content/save', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  await loadContent();
  fillForm(saved);
  log(`已保存：${saved.path}`);
}

async function loadStatus() {
  const status = await api('/api/status');
  $('#zhEmoji').value = status.zh?.emoji || '';
  $('#zhTitle').value = status.zh?.title || '';
  $('#zhDescription').value = status.zh?.description || '';
  $('#enEmoji').value = status.en?.emoji || '';
  $('#enTitle').value = status.en?.title || '';
  $('#enDescription').value = status.en?.description || '';
}

async function saveStatus() {
  const status = await api('/api/status', {
    method: 'POST',
    body: JSON.stringify({
      zh: {
        emoji: $('#zhEmoji').value,
        title: $('#zhTitle').value,
        description: $('#zhDescription').value
      },
      en: {
        emoji: $('#enEmoji').value,
        title: $('#enTitle').value,
        description: $('#enDescription').value
      }
    })
  });
  log({ savedStatus: status });
}

async function runBuild() {
  log('正在运行 Hugo 构建...');
  const result = await api('/api/build', { method: 'POST', body: '{}' });
  log(`exit code: ${result.code}\n\n${result.stdout}\n${result.stderr}`);
}

function bind() {
  $('#sectionFilter').addEventListener('change', renderList);
  $('#searchInput').addEventListener('input', renderList);
  $('#refreshButton').addEventListener('click', loadContent);
  $('#newButton').addEventListener('click', newPage);
  $('#saveButton').addEventListener('click', () => save(false).catch(error => log(error.message)));
  $('#saveAsButton').addEventListener('click', () => save(true).catch(error => log(error.message)));
  $('#saveStatusButton').addEventListener('click', () => saveStatus().catch(error => log(error.message)));
  $('#buildButton').addEventListener('click', () => runBuild().catch(error => log(error.message)));
}

bind();
Promise.all([loadContent(), loadStatus()]).catch(error => log(error.message));
