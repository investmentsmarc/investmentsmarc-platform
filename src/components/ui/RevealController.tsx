"use client";

import { useEffect } from "react";

/**
 * Tags <html> with `.js-ready` once the client boots.
 *
 * All reveal animation is now CSS-driven via `animation-timeline: view()`
 * (see design-system.css). That avoids DOM mutation — earlier versions used
 * an IntersectionObserver to add `.mi-visible`, which raced with streaming
 * hydration under Suspense and produced "tree hydrated but attributes didn't
 * match" warnings in React 19.
 */
export function RevealController() {
  useEffect(() => {
    document.documentElement.classList.add("js-ready");
  }, []);

  return null;
}
