"use client";

import { useEffect } from "react";

export function ProjectListControls() {
  useEffect(() => {
    const showcase = document.querySelector<HTMLElement>(".project-showcase");
    if (!showcase) return;

    const viewStorageKey = "left-jun-project-view";
    const filterStorageKey = "left-jun-project-filter";
    const viewButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-view-target]"));
    const filterButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-filter-target]"));
    const cards = Array.from(showcase.querySelectorAll<HTMLElement>(".project-card"));
    const allowedViews = new Set(["single", "grid"]);
    const allowedFilters = new Set(["game", "embedded"]);

    const applyView = (view: string | null) => {
      const next = view && allowedViews.has(view) ? view : "single";
      showcase.dataset.view = next;
      viewButtons.forEach((button) => {
        const active = button.dataset.viewTarget === next;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
    };

    const applyFilters = (filters: string[]) => {
      const normalized = filters.filter((item) => allowedFilters.has(item));
      filterButtons.forEach((button) => {
        const active = normalized.includes(button.dataset.filterTarget || "");
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
      cards.forEach((card) => {
        const visible = normalized.length === 0 || normalized.includes(card.dataset.projectType || "");
        card.hidden = !visible;
      });
    };

    let savedFilters: string[] = [];
    try {
      const parsed = JSON.parse(window.localStorage.getItem(filterStorageKey) || "[]");
      savedFilters = Array.isArray(parsed) ? parsed : [];
    } catch {
      savedFilters = [];
    }

    applyView(window.localStorage.getItem(viewStorageKey));
    applyFilters(savedFilters);

    const onViewClick = (event: Event) => {
      const view = (event.currentTarget as HTMLButtonElement).dataset.viewTarget || "single";
      applyView(view);
      window.localStorage.setItem(viewStorageKey, view);
    };

    const onFilterClick = (event: Event) => {
      const key = (event.currentTarget as HTMLButtonElement).dataset.filterTarget || "";
      const current = new Set(
        filterButtons
          .filter((button) => button.classList.contains("is-active"))
          .map((button) => button.dataset.filterTarget || "")
          .filter(Boolean)
      );
      if (current.has(key)) current.delete(key);
      else current.add(key);
      const next = Array.from(current);
      applyFilters(next);
      window.localStorage.setItem(filterStorageKey, JSON.stringify(next));
    };

    viewButtons.forEach((button) => button.addEventListener("click", onViewClick));
    filterButtons.forEach((button) => button.addEventListener("click", onFilterClick));

    return () => {
      viewButtons.forEach((button) => button.removeEventListener("click", onViewClick));
      filterButtons.forEach((button) => button.removeEventListener("click", onFilterClick));
    };
  }, []);

  return null;
}
