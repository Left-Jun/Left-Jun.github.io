import { PROJECT_PORTFOLIO_FILTERS, normalizeProjectFilter } from "../lib/project-portfolio.js";

const initializedRoots = new WeakSet();

export function computeProjectFilterResult(records, requestedFilter) {
  const filter = normalizeProjectFilter(requestedFilter);
  const visibility = records.map((record) => ({
    id: record.id,
    section: record.section,
    visible: filter === "all" || record.type === filter
  }));
  const sectionCounts = visibility.reduce((counts, record) => {
    if (record.visible && record.section in counts) counts[record.section] += 1;
    return counts;
  }, { core: 0, archive: 0 });

  return {
    filter,
    visibility,
    sectionCounts,
    visibleCount: visibility.filter((record) => record.visible).length
  };
}

function syncCoverVideos(root, documentRef) {
  const controller = documentRef.defaultView?.LeftJunCoverVideos;
  if (typeof controller?.sync === "function") {
    controller.sync(root);
    return;
  }
  const EventConstructor = documentRef.defaultView?.Event || globalThis.Event;
  if (EventConstructor) documentRef.dispatchEvent(new EventConstructor("leftjun:cover-video-sync"));
}

export function initProjectFilters(rootDocument = document) {
  const roots = Array.from(rootDocument.querySelectorAll("[data-project-portfolio]"));
  for (const root of roots) {
    if (initializedRoots.has(root)) continue;
    const buttons = Array.from(root.querySelectorAll("[data-project-filter]"));
    const cards = Array.from(root.querySelectorAll("[data-project-item]"));
    const sections = Array.from(root.querySelectorAll("[data-project-section-root]"));
    const countTargets = Array.from(root.querySelectorAll("[data-project-visible-count]"));
    const empty = root.querySelector("[data-project-filter-empty]");
    if (buttons.length === 0) continue;

    initializedRoots.add(root);
    const allowedFilters = buttons
      .map((button) => button.dataset.projectFilter)
      .filter((value) => PROJECT_PORTFOLIO_FILTERS.includes(value));

    const apply = (requestedFilter) => {
      const filter = normalizeProjectFilter(requestedFilter, allowedFilters);
      const records = cards.map((card, index) => ({
        id: card.id || `project-${index}`,
        type: card.dataset.projectType || "other",
        section: card.dataset.projectSection || "archive"
      }));
      const result = computeProjectFilterResult(records, filter);

      result.visibility.forEach((record, index) => {
        cards[index].hidden = !record.visible;
      });
      sections.forEach((section) => {
        const name = section.dataset.projectSection;
        section.hidden = !result.sectionCounts[name];
      });
      buttons.forEach((button) => {
        const active = button.dataset.projectFilter === result.filter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
      countTargets.forEach((target) => {
        target.textContent = String(result.visibleCount);
      });
      if (empty) empty.hidden = result.visibleCount > 0;
      root.dataset.activeProjectFilter = result.filter;
      syncCoverVideos(root, rootDocument);
      return result;
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => apply(button.dataset.projectFilter));
    });
    apply("all");
  }
}
