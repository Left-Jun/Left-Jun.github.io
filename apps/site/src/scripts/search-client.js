const indexCache = new Map();
let resultsIdSequence = 0;

function loadIndex(url) {
  if (!indexCache.has(url)) {
    indexCache.set(url, fetch(url, { headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() : [])
      .catch(() => []));
  }
  return indexCache.get(url);
}

function textNode(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = String(text || "");
  return node;
}

function initShell(shell) {
  if (!(shell instanceof HTMLElement) || shell.dataset.searchReady === "1") return;
  const input = shell.querySelector("[data-search-input]");
  const results = shell.querySelector("[data-search-results]");
  const url = shell.dataset.searchIndexUrl || "";
  const variant = shell.dataset.searchVariant === "mobile" ? "mobile-sidebar-search" : "home-topbar";
  if (!(input instanceof HTMLInputElement) || !(results instanceof HTMLElement) || !url) return;
  if (!results.id) results.id = `leftjun-search-results-${++resultsIdSequence}`;
  input.setAttribute("aria-controls", results.id);
  input.setAttribute("aria-expanded", "false");
  results.setAttribute("aria-live", "polite");
  results.setAttribute("aria-atomic", "false");
  shell.dataset.searchReady = "1";
  let entries = null;

  const close = () => {
    results.hidden = true;
    results.replaceChildren();
    shell.classList.remove("is-search-open");
    input.setAttribute("aria-expanded", "false");
  };

  const render = async () => {
    const query = input.value.trim();
    results.replaceChildren();
    if (!query) return close();

    entries ||= await loadIndex(url);
    if (input.value.trim() !== query) return;
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = entries
      .filter((entry) => tokens.every((token) => String(entry.search || "").includes(token)))
      .slice(0, 8);

    if (matches.length === 0) {
      results.append(textNode("p", `${variant}__empty`, shell.dataset.empty || "No matching results"));
    } else {
      for (const entry of matches) {
        const link = document.createElement("a");
        link.className = `${variant}__result`;
        link.href = entry.url || "#";
        link.append(textNode("span", `${variant}__result-section`, entry.section));
        link.append(textNode("strong", `${variant}__result-title`, entry.title));
        if (entry.description) link.append(textNode("small", `${variant}__result-description`, entry.description));
        if (entry.tags?.length) link.append(textNode("em", `${variant}__result-tags`, entry.tags.slice(0, 4).join(" / ")));
        results.append(link);
      }
    }

    results.hidden = false;
    shell.classList.add("is-search-open");
    input.setAttribute("aria-expanded", "true");
  };

  input.addEventListener("focus", () => {
    void loadIndex(url).then((value) => { entries = value; });
    if (input.value.trim()) void render();
  });
  input.addEventListener("input", () => { void render(); });
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    input.value = "";
    close();
    input.blur();
  });
  document.addEventListener("click", (event) => {
    if (event.target instanceof Node && !shell.contains(event.target)) close();
  });
}

export function initSiteSearch(root = document) {
  root.querySelectorAll("[data-search-shell]").forEach(initShell);
  if (document.documentElement.dataset.searchShortcutReady === "1") return;
  document.documentElement.dataset.searchShortcutReady = "1";
  document.addEventListener("keydown", (event) => {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
    const inputs = [...document.querySelectorAll("[data-search-shell] [data-search-input]")];
    const input = inputs.find((item) => item instanceof HTMLInputElement && item.getClientRects().length > 0);
    if (!(input instanceof HTMLInputElement)) return;
    event.preventDefault();
    input.focus();
    input.select();
  });
}
