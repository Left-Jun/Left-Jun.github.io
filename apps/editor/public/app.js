const state = {
  entries: [],
  pairs: [],
  current: null,
  config: null
};

const sections = ["posts", "projects", "retrospectives", "plans", "pages"];
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

function fillSectionOptions() {
  for (const id of ["sectionFilter", "sectionField", "relatedSectionFilter"]) {
    const select = $(`#${id}`);
    if (!select) continue;
    const current = select.value;
    select.innerHTML = id === "relatedSectionFilter" ? `<option value="all">全部分区</option>` : "";
    for (const section of sections) {
      const option = document.createElement("option");
      option.value = section;
      option.textContent = section;
      select.append(option);
    }
    if (current) select.value = current;
  }
}

function filteredEntries() {
  const section = $("#sectionFilter").value;
  const lang = $("#languageFilter").value;
  const query = $("#searchInput").value.trim().toLowerCase();
  return state.entries.filter((entry) => {
    if (entry.section !== section) return false;
    if (lang !== "all" && entry.lang !== lang) return false;
    if (!query) return true;
    return [entry.title, entry.slug, entry.path, ...(entry.tags || []), ...(entry.categories || [])]
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
    button.innerHTML = `<strong>${entry.title}</strong><small>${entry.lang} · ${entry.path}</small>`;
    button.addEventListener("click", () => openEntry(entry.id));
    li.append(button);
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
  const pairKey = `${state.current.section}/${state.current.path.replace(/^.*?\/(.+?)(\/index(\.en)?\.md|\.en\.md|\.md)$/i, "$1")}`;
  const pair = state.pairs.find((item) => item.key === pairKey);
  $("#pairSummary").textContent = pair
    ? `配对键：${pair.key} · 中文 ${pair.zh ? "已存在" : "缺少"} · English ${pair.en ? "已存在" : "缺少"}`
    : "当前内容暂未形成配对。";
  for (const [label, id] of [["打开中文", pair?.zh], ["打开英文", pair?.en]]) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.disabled = !id;
    if (id) button.addEventListener("click", () => openEntry(id));
    box.append(button);
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
    label.innerHTML = `<input type="checkbox" value="${entry.ref}" ${selected.has(entry.ref) ? "checked" : ""}><span><strong>${entry.title}</strong><br><small>${entry.section} · ${entry.lang} · ${entry.ref}</small></span>`;
    box.append(label);
  }
}

function renderAssets() {
  const box = $("#assetPicker");
  box.innerHTML = "";
  const assets = state.current?.assets || [];
  if (!assets.length) {
    box.textContent = "当前内容暂无可选资源。";
    return;
  }
  for (const asset of assets) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = asset.name;
    button.addEventListener("click", () => {
      if (/\.(mp4|webm)$/i.test(asset.name)) $("#coverVideoField").value = asset.url;
      else $("#imageField").value = asset.url;
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
  if (!title) throw new Error("保存前需要 title。");
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
  log(`已加载 ${state.entries.length} 个 Astro 内容文件。`);
}

async function loadConfig() {
  state.config = await api("/api/site-config");
  $("#siteConfigField").value = JSON.stringify(state.config, null, 2);
}

async function openEntry(id) {
  fillForm(await api(`/api/content/${id}`));
  log(`已打开：${state.current.path}`);
}

function newEntry() {
  fillForm({
    id: "new",
    path: "",
    section: $("#sectionFilter").value,
    lang: "zh-cn",
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
  log("已创建空白内容。");
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
  log(result);
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
  $("#sectionFilter").value = "posts";
  $("#sectionFilter").addEventListener("change", renderList);
  $("#languageFilter").addEventListener("change", renderList);
  $("#searchInput").addEventListener("input", renderList);
  $("#refreshButton").addEventListener("click", () => loadContent().catch((error) => log(error.message)));
  $("#newButton").addEventListener("click", newEntry);
  $("#saveButton").addEventListener("click", () => save(false).catch((error) => log(error.message)));
  $("#saveAsButton").addEventListener("click", () => save(true).catch((error) => log(error.message)));
  $("#validateButton").addEventListener("click", () => validate().catch((error) => log(error.message)));
  $("#buildButton").addEventListener("click", () => build().catch((error) => log(error.message)));
  $("#saveConfigButton").addEventListener("click", () => saveConfig().catch((error) => log(error.message)));
  $("#relatedSectionFilter").addEventListener("change", renderRelatedPicker);
}

bind();
Promise.all([loadContent(), loadConfig()]).catch((error) => log(error.message));
