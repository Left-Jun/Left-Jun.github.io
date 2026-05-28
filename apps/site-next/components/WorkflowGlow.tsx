"use client";

import { useEffect } from "react";

export function WorkflowGlow() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".home-workflow__item"));
    const onMove = (event: PointerEvent) => {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`);
      target.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`);
    };
    cards.forEach((card) => card.addEventListener("pointermove", onMove));
    return () => cards.forEach((card) => card.removeEventListener("pointermove", onMove));
  }, []);

  return null;
}
