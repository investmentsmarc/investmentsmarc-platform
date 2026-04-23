import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions";
import { onSchedule } from "firebase-functions/v2/scheduler";

const refreshSecret = defineSecret("NEWS_REFRESH_SECRET");

// Endpoint del Next app que hace el scrape y escribe cache/marketNews.
// Configurable en runtime: firebase functions:config o variable de entorno.
const DEFAULT_ENDPOINT = "https://investmentsmarc.com/api/internal/refresh-news";

export const refreshMarketNews = onSchedule(
  {
    schedule: "every 30 minutes",
    timeZone: "UTC",
    secrets: [refreshSecret],
    timeoutSeconds: 120,
    memory: "256MiB",
    retryCount: 1,
  },
  async () => {
    const endpoint = process.env.NEWS_REFRESH_URL ?? DEFAULT_ENDPOINT;
    const secret = refreshSecret.value();
    const startedAt = Date.now();

    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 90_000);
      let res: Response;
      try {
        res = await fetch(endpoint, {
          method: "POST",
          headers: {
            authorization: `Bearer ${secret}`,
            "content-type": "application/json",
          },
          signal: ctrl.signal,
        });
      } finally {
        clearTimeout(timer);
      }

      const body = await res.json().catch(() => null);
      const durationMs = Date.now() - startedAt;

      if (!res.ok) {
        logger.error("[refreshMarketNews] endpoint returned non-ok", {
          status: res.status,
          body,
          durationMs,
        });
        throw new Error(`refresh endpoint ${res.status}`);
      }

      logger.info("[refreshMarketNews] ok", { body, durationMs });
    } catch (err) {
      logger.error("[refreshMarketNews] failed", {
        error: err instanceof Error ? err.message : String(err),
        durationMs: Date.now() - startedAt,
      });
      throw err;
    }
  },
);
