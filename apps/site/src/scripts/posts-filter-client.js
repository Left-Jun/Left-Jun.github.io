const initializedRoots = new WeakSet();

export function normalizePostFilterState(state = {}, allowed = {}) {
  const columns = new Set(allowed.columns || []);
  const years = new Set(allowed.years || []);
  return {
    column: state.column === "all" || columns.has(state.column) ? state.column || "all" : "all",
    year: state.year === "all" || years.has(state.year) ? state.year || "all" : "all"
  };
}

export function matchesPostFilter(record, state) {
  const columns = Array.isArray(record.columns)
    ? record.columns
    : String(record.columns || "").split(/\s+/).filter(Boolean);
  const columnMatch = state.column === "all" || columns.includes(state.column);
  const yearMatch = state.year === "all" || record.year === state.year;
  return columnMatch && yearMatch;
}

export function computePostFilterResult(records, state) {
  const visibility = records.map((record) => ({
    id: record.id,
    visible: matchesPostFilter(record, state)
  }));
  return {
    visibility,
    visibleCount: visibility.filter((item) => item.visible).length
  };
}

export function initPostFilters(rootDocument = document) {
  const roots = Array.from(rootDocument.querySelectorAll("[data-posts-archive-root]"));
  for (const root of roots) {
    if (initializedRoots.has(root)) continue;
    const controls = Array.from(rootDocument.querySelectorAll("[data-post-filter-controls]"));
    const buttons = controls.flatMap((control) => Array.from(control.querySelectorAll("[data-post-filter-axis]")));
    const items = Array.from(root.querySelectorAll("[data-post-item]"));
    const empty = root.querySelector("[data-post-filter-empty]");
    const countTargets = Array.from(rootDocument.querySelectorAll("[data-post-filter-visible-count]"));
    if (buttons.length === 0 || items.length === 0) continue;

    initializedRoots.add(root);
    const allowed = {
      columns: buttons.filter((button) => button.dataset.postFilterAxis === "column").map((button) => button.dataset.postFilterValue).filter((value) => value && value !== "all"),
      years: buttons.filter((button) => button.dataset.postFilterAxis === "year").map((button) => button.dataset.postFilterValue).filter((value) => value && value !== "all")
    };
    let state = { column: "all", year: "all" };

    const apply = () => {
      state = normalizePostFilterState(state, allowed);
      const records = items.map((item, index) => ({
        id: item.id || `post-${index}`,
        columns: item.dataset.postColumns || "standalone",
        year: item.dataset.postYear || ""
      }));
      const result = computePostFilterResult(records, state);
      result.visibility.forEach((record, index) => {
        items[index].hidden = !record.visible;
      });
      buttons.forEach((button) => {
        const axis = button.dataset.postFilterAxis;
        const value = button.dataset.postFilterValue || "all";
        const active = state[axis] === value;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
      countTargets.forEach((target) => {
        target.textContent = String(result.visibleCount);
      });
      if (empty) empty.hidden = result.visibleCount > 0;
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const axis = button.dataset.postFilterAxis;
        if (axis !== "column" && axis !== "year") return;
        state = { ...state, [axis]: button.dataset.postFilterValue || "all" };
        apply();
      });
    });
    apply();
  }
}
