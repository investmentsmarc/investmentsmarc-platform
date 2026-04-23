import "server-only";

import { Timestamp } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebaseAdmin";
import type { MarketNewsArticle } from "@/lib/marketNews";
import type {
  EarningsEvent,
  FearGreed,
  TopMover,
} from "@/lib/marketSignals";

const COLLECTION = "cache";
const DOC_ID = "marketNews";
const SCHEMA_VERSION = 1;

export type MarketNewsCache = {
  articles: MarketNewsArticle[];
  movers: TopMover[];
  earnings: EarningsEvent[];
  fearGreed: FearGreed | null;
  updatedAt: number; // epoch ms
  version: number;
};

function hasAdminCredentials(): boolean {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.K_SERVICE || // Cloud Run / App Hosting
      process.env.FUNCTION_TARGET, // Cloud Functions
  );
}

export async function readMarketNewsCache(): Promise<MarketNewsCache | null> {
  if (!hasAdminCredentials()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[marketNewsCache] sin credenciales admin — omitiendo cache (dev)",
      );
    }
    return null;
  }
  try {
    const snap = await getAdminFirestore()
      .collection(COLLECTION)
      .doc(DOC_ID)
      .get();
    if (!snap.exists) return null;
    const data = snap.data() as Omit<MarketNewsCache, "updatedAt"> & {
      updatedAt: Timestamp | number;
    };
    const updatedAt =
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toMillis()
        : Number(data.updatedAt) || 0;
    return {
      articles: data.articles ?? [],
      movers: data.movers ?? [],
      earnings: data.earnings ?? [],
      fearGreed: data.fearGreed ?? null,
      updatedAt,
      version: data.version ?? 0,
    };
  } catch (err) {
    console.warn("[marketNewsCache] read failed, usando live fallback:", err);
    return null;
  }
}

export async function writeMarketNewsCache(
  payload: Omit<MarketNewsCache, "updatedAt" | "version">,
): Promise<void> {
  await getAdminFirestore()
    .collection(COLLECTION)
    .doc(DOC_ID)
    .set({
      ...payload,
      updatedAt: Timestamp.now(),
      version: SCHEMA_VERSION,
    });
}
