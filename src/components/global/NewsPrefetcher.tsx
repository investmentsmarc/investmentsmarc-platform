"use client";

import { useEffect } from "react";

/**
 * Dispara un prefetch de /api/market-news cuando el browser está idle.
 *
 * - No compite con el render inicial (usa requestIdleCallback).
 * - No bloquea nada — si el fetch falla, silencioso.
 * - El handler server-side de /api/market-news llama a getMarketNews, que a
 *   su vez usa fetch() con `next.revalidate = 1800` para cada query RSS +
 *   enrichment. Ese cache es compartido con el server component LatestArticles,
 *   así que cuando el usuario scrollea al home, la sección ya tiene data.
 */
export function NewsPrefetcher() {
  useEffect(() => {
    let cancelled = false;

    const prefetch = () => {
      if (cancelled) return;
      // priority: low es soporte Chromium; demás browsers lo ignoran.
      const init: RequestInit & { priority?: "low" | "auto" | "high" } = {
        priority: "low",
        cache: "default",
      };
      fetch("/api/market-news", init).catch(() => {
        /* ignore — best-effort warm-up */
      });
    };

    type IdleCallbackWindow = Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout?: number },
      ) => number;
    };
    const w = window as IdleCallbackWindow;

    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(prefetch, { timeout: 3000 });
    } else {
      window.setTimeout(prefetch, 1500);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
