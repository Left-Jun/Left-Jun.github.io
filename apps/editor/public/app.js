const state = {
  entries: [],
  pairs: [],
  current: null,
  config: null,
  page: "editor"
};

const sections = ["projects", "posts", "retrospectives", "plans", "pages"];
const sectionLabels = {
  projects: "项目作品",
  posts: "文章",
  retrospectives: "项目复盘",
  plans: "开发计划",
  pages: "页面"
};
const languageLabels = {
  "zh-cn": "中文",
  en: "English"
};
const pageMeta = {
  editor: {
    kicker: "本地工具",
    title: "内容编辑",
    hint: "编辑项目、文章、复盘、计划和关于页面。保存后内容会写回仓库 Markdown 文件。"
  },
  language: {
    kicker: "Language",
    title: "中英文配对",
    hint: "检查作品集内容的中文 / 英文版本，快速切换或创建英文草稿。"
  },
  config: {
    kicker: "Site Config",
    title: "站点配置",
    hint: "调整站点配置 JSON。看不懂结构时，只改已有文字值。"
  }
};

const $ = (selector) => document.querySelector(selector);

function log(message) {
  $("#log").textContent = typeof message === "string" ? message : JSON.stringify(message, null, 2);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || "Request failed");
  return data;
}

function textToList(value) {
  return String(value || "").split(/\n|,/).map((item) => item.trim()).filter(Boolean);
}

function listToText(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function slugify(text) {
  return String(text || "untitled")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "untitled";
}

function normalizePath(value) {
  return String(value || "").replace(/\\/g, "/").replace(/^\/+/, "");
}

function baseEntryId(idOrPath) {
  let id = normalizePath(idOrPath)
    .replace(/^content\//, "")
    .replace(/^src\/content\//, "")
    .replace(/\.md$/i, "")
    .replace(/\.en$/i, "");
  for (const section of sections) {
    id = id.replace(new RegExp(`^${section}/`), "");
  }
  id = id.replace(/\/index$/i, "");
  return id || "index";
}

function pairKeyForEntry(entry) {
  return `${entry.section}/${baseEntryId(entry.path || "")}`;
}

function sectionLabel(section) {
  return sectionLabels[section] || section;
}

function languageLabel(lang) {
  return languageLabels[lang] || lang;
}

function entryById(id) {
  return state.entries.find((entry) => entry.id === id);
}

function fillSectionOptions() {
  for (const id of ["sectionFilter", "sectionField", "relatedSectionFilter"]) {
    const select = $(`#${id}`);
    if (!select) continue;
    const current = select.value;
    select.innerHTML = id === "relatedSectionFilter" ? `<option value="all">全部类型</option>` : "";
    for (const section of sections) {
      const option = document.createElement("option");
      option.value = section;
      option.textContent = sectionLabel(section);
      select.append(option);
    }
    if (current) select.value = current;
  }
}

function switchPage(page) {
  state.page = pageMeta[page] ? page : "editor";
  for (const view of document.querySelectorAll(".page-view")) {
    view.classList.toggle("is-active", view.dataset.page === state.page);
  }
  for (const tab of document.querySelectorAll(".page-tab")) {
    tab.classList.toggle("is-active", tab.dataset.pageTarget === state.page);
  }
  $("#pageKicker").textContent = pageMeta[state.page].kicker;
  $("#pageTitle").textContent = pageMeta[state.page].title;
  $("#pageHint").textContent = pageMeta[state.page].hint;

  const editorOnly = state.page === "editor";
  $("#previewLink").hidden = !editorOnly;
  $("#saveAsButton").hidden = !editorOnly;
  $("#saveButton").hidden = !editorOnly;
  renderLanguageBoard();
}

function filteredEntries() {
  const section = $("#sectionFilter").value;
  const lang = $("#languageFilter").value;
  const query = $("#searchInput").value.trim().toLowerCase();
  return state.entries.filter((entry) => {
    if (entry.section !== section) return false;
    if (lang !== "all" && entry.lang !== lang) return false;
    if (!query) return true;
    return [entry.title, entry.slug, entry.path, sectionLabel(entry.section), languageLabel(entry.lang), ...(entry.tags || []), ...(entry.categories || [])]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

function renderList() {
  const list = $("#contentList");
  list.innerHTML = "";
  for (const entry of filteredEntries()) {
    const li = document.createElement("li");
    const button = document.createElement("button");
    if (state.current?.id === entry.id) button.classList.add("active");
    button.innerHTML = `<strong>${entry.title}</strong><small>${sectionLabel(entry.section)} · ${languageLabel(entry.lang)} · ${entry.path}</small>`;
    button.addEventListener("click", () => openEntry(entry.id));
    li.append(button);
    list.append(li);
  }
  if (!list.children.length) {
    const li = document.createElement("li");
    li.className = "empty-list";
    li.textContent = "没有找到内容。试试换一个类型或搜索词。";
    list.append(li);
  }
}

function renderPair() {
  const box = $("#pairActions");
  box.innerHTML = "";
  if (!state.current) {
    $("#pairSummary").textContent = "选择内容后显示中文 / 英文配对状态。";
    return;
  }
  const pair = state.pairs.find((item) => item.key === pairKeyForEntry(state.current));
  $("#pairSummary").textContent = pair
    ? `内容键：${pair.key} · 中文 ${pair.zh ? "已存在" : "缺少"} · English ${pair.en ? "已存在" : "缺少"}`
    : "当前内容暂未形成配对。";

  for (const [label, id] of [["打开中文", pair?.zh], ["打开英文", pair?.en]]) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.disabled = !id;
    if (id) button.addEventListener("click", () => openEntry(id));
    box.append(button);
  }
  if (pair?.zh && !pair.en) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "创建英文草稿";
    button.addEventListener("click", () => createMissingLanguage(pair, "en").catch((error) => log(error.message)));
    box.append(button);
  }
}

function renderLanguageBoard() {
  const board = $("#languageBoard");
  if (!board) return;
  const section = $("#sectionFilter").value;
  const query = $("#searchInput").value.trim().toLowerCase();
  const pairs = state.pairs.filter((pair) => {
    if (pair.section !== section) return false;
    if (!query) return true;
    const zh = entryById(pair.zh);
    const en = entryById(pair.en);
    return [pair.title, pair.key, zh?.title, en?.title].join(" ").toLowerCase().includes(query);
  });

  board.innerHTML = "";
  if (!pairs.length) {
    board.innerHTML = `<p class="empty-board">当前筛选下没有中英文配对项。</p>`;
    return;
  }

  for (const pair of pairs) {
    const zh = entryById(pair.zh);
    const en = entryById(pair.en);
    const card = document.createElement("article");
    card.className = "language-card";
    card.innerHTML = `
      <div class="language-card__head">
        <div>
          <strong>${pair.title || zh?.title || en?.title || pair.key}</strong>
          <small>${sectionLabel(pair.section)} · ${pair.key}</small>
        </div>
        <span class="${pair.zh && pair.en ? "status-ok" : "status-missing"}">${pair.zh && pair.en ? "中英文齐全" : "缺少版本"}</span>
      </div>
      <div class="language-card__grid">
        <div>
          <span>中文</span>
          <p>${zh ? zh.title : "缺少中文版本"}</p>
          <button type="button" data-open-id="${pair.zh || ""}" ${pair.zh ? "" : "disabled"}>打开中文</button>
        </div>
        <div>
          <span>English</span>
          <p>${en ? en.title : "缺少英文版本"}</p>
          ${pair.en
            ? `<button type="button" data-open-id="${pair.en}">打开英文</button>`
            : `<button type="button" data-create-lang="en">创建英文草稿</button>`}
        </div>
      </div>
    `;
    for (const button of card.querySelectorAll("[data-open-id]")) {
      const id = button.dataset.openId;
      if (id) button.addEventListener("click", () => openEntry(id));
    }
    const createButton = card.querySelector("[data-create-lang]");
    if (createButton) {
      createButton.addEventListener("click", () => createMissingLanguage(pair, createButton.dataset.createLang).catch((error) => log(error.message)));
    }
    board.append(card);
  }
}

function renderRelatedPicker() {
  const box = $("#relatedPicker");
  const filter = $("#relatedSectionFilter").value;
  const selected = new Set(state.current?.frontMatter?.relatedPages || []);
  box.innerHTML = "";
  for (const entry of state.entries) {
    if (state.current?.id === entry.id) continue;
    if (filter !== "all" && entry.section !== filter) continue;
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${entry.ref}" ${selected.has(entry.ref) ? "checked" : ""}><span><strong>${entry.title}</strong><br><small>${sectionLabel(entry.section)} · ${languageLabel(entry.lang)} · ${entry.ref}</small></span>`;
    box.append(label);
  }
}

function renderAssets() {
  const box = $("#assetPicker");
  box.innerHTML = "";
  const assets = state.current?.assets || [];
  if (!assets.length) {
    box.textContent = "当前内容暂无可选资源。资源通常放在 apps/site/public/content-assets/ 对应内容目录里。";
    return;
  }
  for (const asset of assets) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = asset.name;
    button.addEventListener("click", () => {
      if (/\.(mp4|webm)$/i.test(asset.name)) $("#coverVideoField").value = asset.url;
      else $("#imageField").value = asset.url;
      log(`已填入资源：${asset.url}`);
    });
    box.append(button);
  }
}

function fillForm(entry) {
  state.current = entry;
  const fm = entry.frontMatter || {};
  $("#pathField").value = entry.path || "";
  $("#sectionField").value = entry.section || $("#sectionFilter").value;
  $("#langField").value = entry.lang || "zh-cn";
  $("#titleField").value = fm.title || "";
  $("#slugField").value = fm.slug || "";
  $("#dateField").value = fm.date || "";
  $("#draftField").checked = !!fm.draft;
  $("#descriptionField").value = fm.description || "";
  $("#imageField").value = fm.image || "";
  $("#coverVideoField").value = fm.coverVideo || "";
  $("#portfolioTypeField").value = fm.portfolioType || "";
  $("#categoriesField").value = listToText(fm.categories);
  $("#tagsField").value = listToText(fm.tags);
  $("#roleTagsField").value = listToText(fm.roleTags);
  $("#projectFactsField").value = JSON.stringify(fm.projectFacts || {}, null, 2);
  $("#projectLinksField").value = JSON.stringify(fm.projectLinks || [], null, 2);
  $("#bodyField").value = entry.body || "";
  $("#previewLink").href = entry.previewUrl || "#";
  renderList();
  renderPair();
  renderRelatedPicker();
  renderAssets();
}

function readForm() {
  const title = $("#titleField").value.trim();
  if (!title) throw new Error("保存前需要填写标题。");
  const facts = $("#projectFactsField").value.trim();
  const links = $("#projectLinksField").value.trim();
  const frontMatter = {
    ...(state.current?.frontMatter || {}),
    title,
    date: $("#dateField").value.trim(),
    draft: $("#draftField").checked,
    slug: $("#slugField").value.trim() || slugify(title),
    description: $("#descriptionField").value.trim(),
    image: $("#imageField").value.trim(),
    coverVideo: $("#coverVideoField").value.trim(),
    portfolioType: $("#portfolioTypeField").value.trim(),
    categories: textToList($("#categoriesField").value),
    tags: textToList($("#tagsField").value),
    roleTags: textToList($("#roleTagsField").value),
    relatedPages: [...document.querySelectorAll("#relatedPicker input:checked")].map((input) => input.value)
  };
  if (facts) frontMatter.projectFacts = JSON.parse(facts);
  if (links) frontMatter.projectLinks = JSON.parse(links);
  return {
    section: $("#sectionField").value,
    lang: $("#langField").value,
    frontMatter,
    body: $("#bodyField").value
  };
}

async function loadContent() {
  const data = await api("/api/content");
  state.entries = data.entries;
  state.pairs = data.pairs;
  renderList();
  renderLanguageBoard();
  log(`已加载 ${state.entries.length} 个作品集内容文件。`);
}

async function loadConfig() {
  state.config = await api("/api/site-config");
  $("#siteConfigField").value = JSON.stringify(state.config, null, 2);
}

async function openEntry(id) {
  fillForm(await api(`/api/content/${id}`));
  switchPage("editor");
  log(`已打开：${state.current.path}`);
}

function newEntry() {
  fillForm({
    id: "new",
    path: "",
    section: $("#sectionFilter").value,
    lang: $("#languageFilter").value === "en" ? "en" : "zh-cn",
    frontMatter: {
      title: "",
      slug: "",
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19) + "+08:00",
      draft: false,
      categories: [],
      tags: [],
      roleTags: [],
      relatedPages: []
    },
    body: "",
    assets: []
  });
  switchPage("editor");
  log("已创建空白内容。");
}

async function createMissingLanguage(pair, lang) {
  const sourceId = lang === "en" ? pair.zh : pair.en;
  if (!sourceId) throw new Error("没有可复制的源语言版本。");
  const source = await api(`/api/content/${sourceId}`);
  const frontMatter = {
    ...(source.frontMatter || {}),
    draft: true
  };
  const draft = {
    id: "new",
    path: "",
    section: source.section,
    lang,
    frontMatter,
    body: source.body || "",
    assets: source.assets || []
  };
  fillForm(draft);
  switchPage("editor");
  log(`已根据 ${languageLabel(source.lang)} 创建 ${languageLabel(lang)} 草稿。翻译完成后点击“保存当前内容”。`);
}

async function save(asNew = false) {
  const payload = readForm();
  const id = asNew ? "new" : (state.current?.id || "new");
  const saved = await api(`/api/content/${id}`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  await loadContent();
  fillForm(saved);
  log(`已保存：${saved.path}`);
}

async function validate() {
  const result = await api("/api/validate", { method: "POST", body: "{}" });
  log(result.ok ? `校验通过：共 ${result.total} 个内容文件。` : result);
}

async function build() {
  log("正在运行 Astro 构建...");
  const result = await api("/api/build", { method: "POST", body: "{}" });
  log(`exit code: ${result.code}\n\n${result.stdout}\n${result.stderr}`);
}

async function saveConfig() {
  const parsed = JSON.parse($("#siteConfigField").value);
  const saved = await api("/api/site-config", {
    method: "POST",
    body: JSON.stringify(parsed)
  });
  state.config = saved;
  log("站点配置已保存。");
}

function bind() {
  fillSectionOptions();
  $("#sectionFilter").value = "projects";
  for (const tab of document.querySelectorAll(".page-tab")) {
    tab.addEventListener("click", () => switchPage(tab.dataset.pageTarget));
  }
  $("#sectionFilter").addEventListener("change", () => {
    renderList();
    renderLanguageBoard();
  });
  $("#languageFilter").addEventListener("change", renderList);
  $("#searchInput").addEventListener("input", () => {
    renderList();
    renderLanguageBoard();
  });
  $("#refreshButton").addEventListener("click", () => loadContent().catch((error) => log(error.message)));
  $("#newButton").addEventListener("click", newEntry);
  $("#saveButton").addEventListener("click", () => save(false).catch((error) => log(error.message)));
  $("#saveAsButton").addEventListener("click", () => save(true).catch((error) => log(error.message)));
  $("#validateButton").addEventListener("click", () => validate().catch((error) => log(error.message)));
  $("#buildButton").addEventListener("click", () => build().catch((error) => log(error.message)));
  $("#saveConfigButton").addEventListener("click", () => saveConfig().catch((error) => log(error.message)));
  $("#relatedSectionFilter").addEventListener("change", renderRelatedPicker);
  switchPage("editor");
}

bind();
Promise.all([loadContent(), loadConfig()]).catch((error) => log(error.message));
