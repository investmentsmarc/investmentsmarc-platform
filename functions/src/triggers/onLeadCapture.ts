import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

initializeApp();

export const onLeadCapture = onDocumentCreated("leads/{leadId}", async (event) => {
  const snapshot = event.data;

  if (!snapshot) {
    logger.warn("Lead trigger invoked without snapshot.");
    return;
  }

  const lead = snapshot.data();
  const db = getFirestore();

  logger.info("Lead capturado", {
    leadId: snapshot.id,
    source: lead.source,
    email: lead.email,
  });

  await db.collection("leadEvents").add({
    leadId: snapshot.id,
    source: lead.source,
    type: "captured",
    createdAt: new Date().toISOString(),
  });
});
