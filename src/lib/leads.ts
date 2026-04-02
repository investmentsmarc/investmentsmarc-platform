import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { getFirestoreDb } from "@/lib/firebase";

type LeadSource = "contacto" | "curso-gratis" | "webinar";

interface CreateLeadPayload {
  name: string;
  email: string;
  whatsapp?: string;
  message?: string;
  source: LeadSource;
  utmSource?: string;
  extra?: Record<string, unknown>;
}

export async function createLead(payload: CreateLeadPayload) {
  await addDoc(collection(getFirestoreDb(), "leads"), {
    name: payload.name.trim(),
    email: payload.email.trim(),
    whatsapp: payload.whatsapp?.trim() || null,
    message: payload.message?.trim() || null,
    source: payload.source,
    createdAt: serverTimestamp(),
    notifiedWhatsApp: false,
    notifiedConvertKit: false,
    utmSource: payload.utmSource ?? payload.source,
    ...payload.extra,
  });
}
