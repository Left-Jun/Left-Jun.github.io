import { normalizeRecordView } from "../lib/project-records.js";

const controllers = new WeakMap();

export function recordVisibility(record = {}, view = "all") {
  const normalized = normalizeRecordView(view);
  const hasRetrospective = Boolean(record.hasRetrospective);
  const hasPlan = Boolean(record.hasPlan);
  const threadVisible = normalized === "all"
    || (normalized === "retrospectives" && hasRetrospective)
    || (normalized === "plans" && hasPlan)
    || (normalized === "complete" && hasRetrospective && hasPlan);
  return {
    threadVisible,
    retrospectives: threadVisible && normalized !== "plans",
    plans: threadVisible && normalized !== "retrospectives"
  };
}

export function computeRecordVisibility(records = [], view = "all") {
  const visibility = records.map((record) => ({
    id: record.id,
    ...recordVisibility(record, view)
  }));
  return {
    visibility,
    visibleCount: visibility.filter((item) => item.threadVisible).length
  };
}

function createController(root) {
  const documentRef = root.ownerDocument || globalThis.document;
  const buttons = Array.from(documentRef.querySelectorAll("[data-records-filter]"));
  const threads = Array.from(root.querySelectorAll("[data-record-thread]"));
  const threadById = new Map(threads.map((thread) => [thread.id, thread]));
  const indexItems = Array.from(documentRef.querySelectorAll("[data-record-index-item]"));
  const countTargets = Array.from(documentRef.querySelectorAll("[data-records-visible-count]"));
  const emptyState = root.querySelector("[data-records-empty]");
  let view = normalizeRecordView(root.dataset.recordsInitialView || "all");

  const apply = (nextView = view) => {
    view = normalizeRecordView(nextView);
    let visibleCount = 0;

    buttons.forEach((button) => {
      const active = button.dataset.recordsFilter === view;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    threads.forEach((thread) => {
      const state = recordVisibility({
        hasRetrospective: thread.dataset.hasRetrospective === "true",
        hasPlan: thread.dataset.hasPlan === "true"
      }, view);
      thread.hidden = !state.threadVisible;
      if (state.threadVisible) visibleCount += 1;
      thread.querySelectorAll("[data-record-phase]").forEach((phase) => {
        const phaseName = phase.dataset.recordPhase;
        phase.hidden = phaseName === "retrospectives" ? !state.retrospectives : !state.plans;
      });
    });

    indexItems.forEach((item) => {
      const thread = threadById.get(item.dataset.recordIndexItem || "");
      item.hidden = !thread || thread.hidden;
    });
    countTargets.forEach((target) => {
      target.textContent = String(visibleCount);
    });
    if (emptyState) emptyState.hidden = visibleCount !== 0;
    root.dataset.recordsView = view;
    documentRef.dispatchEvent(new CustomEvent("leftjun:cover-video-sync"));
    return { view, visibleCount };
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => apply(button.dataset.recordsFilter || "all"));
  });

  const controller = { apply, getView: () => view };
  controllers.set(root, controller);
  apply();
  return controller;
}

export function initRecordsFilters(scope = globalThis.document) {
  if (!scope?.querySelectorAll) return [];
  const roots = [];
  if (scope.matches?.("[data-records-root]")) roots.push(scope);
  scope.querySelectorAll("[data-records-root]").forEach((root) => roots.push(root));
  return roots.map((root) => controllers.get(root) || createController(root));
}
