const controllers = new WeakMap();

export function normalizeTimelineFilterState(state = {}, allowed = {}) {
  const groups = new Set(["all", ...(allowed.groups || [])]);
  const years = new Set(["all", ...(allowed.years || []).map(String)]);
  const group = groups.has(state.group) ? state.group : "all";
  const year = years.has(String(state.year || "all")) ? String(state.year || "all") : "all";
  return { group, year };
}

export function matchesTimelineFilter(record = {}, state = {}) {
  const group = state.group || "all";
  const year = String(state.year || "all");
  const groupMatch = group === "all" || record.filterGroup === group;
  const yearMatch = year === "all" || String(record.year || "") === year;
  return groupMatch && yearMatch;
}

export function computeTimelineFilterResult(records = [], state = {}) {
  const visibility = records.map((record) => ({
    id: record.id,
    visible: matchesTimelineFilter(record, state)
  }));
  return {
    visibility,
    visibleCount: visibility.filter((record) => record.visible).length
  };
}

function createController(root) {
  const documentRef = root.ownerDocument || globalThis.document;
  const buttons = Array.from(documentRef.querySelectorAll("[data-timeline-filter-axis][data-timeline-filter-value]"));
  const items = Array.from(root.querySelectorAll("[data-timeline-item]"));
  const clusters = Array.from(root.querySelectorAll("[data-timeline-cluster]"));
  const sections = Array.from(root.querySelectorAll("[data-timeline-section]"));
  const countTargets = Array.from(documentRef.querySelectorAll("[data-timeline-visible-count]"));
  const empty = root.querySelector("[data-timeline-filter-empty]");
  const allowed = {
    groups: buttons
      .filter((button) => button.dataset.timelineFilterAxis === "group")
      .map((button) => button.dataset.timelineFilterValue)
      .filter((value) => value && value !== "all"),
    years: buttons
      .filter((button) => button.dataset.timelineFilterAxis === "year")
      .map((button) => button.dataset.timelineFilterValue)
      .filter((value) => value && value !== "all")
  };
  let state = { group: "all", year: "all" };

  const apply = (nextState = state) => {
    state = normalizeTimelineFilterState(nextState, allowed);
    buttons.forEach((button) => {
      const axis = button.dataset.timelineFilterAxis;
      const value = button.dataset.timelineFilterValue || "all";
      const active = state[axis] === value;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    let visibleCount = 0;
    items.forEach((item) => {
      const visible = matchesTimelineFilter({
        filterGroup: item.dataset.timelineGroup,
        year: item.dataset.timelineYear
      }, state);
      item.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    clusters.forEach((cluster) => {
      const clusterItems = Array.from(cluster.querySelectorAll("[data-timeline-item]"));
      const visibleClusterItems = clusterItems.filter((item) => !item.hidden);
      cluster.hidden = clusterItems.length > 0 && visibleClusterItems.length === 0;
      const clusterCount = cluster.querySelector("[data-timeline-cluster-count]");
      if (clusterCount) clusterCount.textContent = String(visibleClusterItems.length);
    });
    sections.forEach((section) => {
      const sectionItems = Array.from(section.querySelectorAll("[data-timeline-item]"));
      section.hidden = sectionItems.length > 0 && !sectionItems.some((item) => !item.hidden);
    });
    countTargets.forEach((target) => {
      target.textContent = String(visibleCount);
    });
    if (empty) empty.hidden = visibleCount !== 0;

    documentRef.dispatchEvent(new CustomEvent("leftjun:cover-video-sync"));
    return { ...state, visibleCount };
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const axis = button.dataset.timelineFilterAxis;
      if (axis !== "group" && axis !== "year") return;
      apply({ ...state, [axis]: button.dataset.timelineFilterValue || "all" });
    });
  });

  const controller = { apply, getState: () => ({ ...state }) };
  controllers.set(root, controller);
  apply();
  return controller;
}

export function initUpdatesFilters(scope = globalThis.document) {
  if (!scope?.querySelectorAll) return [];
  const roots = [];
  if (scope.matches?.("[data-timeline-root]")) roots.push(scope);
  scope.querySelectorAll("[data-timeline-root]").forEach((root) => roots.push(root));
  return roots.map((root) => controllers.get(root) || createController(root));
}
