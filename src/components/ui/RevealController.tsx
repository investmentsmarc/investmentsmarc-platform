"use client";

import { useEffect } from "react";

/**
 * Globally wires `.mi-reveal` elements to an IntersectionObserver.
 * Adds `.mi-visible` when an element enters the viewport so CSS can fade/translate it in.
 * Respects `prefers-reduced-motion` by showing everything immediately.
 * Tags <html> with `.js-ready` so SSR/no-JS users never see a blank page.
 */
export function RevealController() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-ready");

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      document
        .querySelectorAll<HTMLElement>(".mi-reveal")
        .forEach((el) => el.classList.add("mi-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("mi-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>(".mi-reveal:not(.mi-visible)")
        .forEach((el) => io.observe(el));
    };

    scan();

    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
