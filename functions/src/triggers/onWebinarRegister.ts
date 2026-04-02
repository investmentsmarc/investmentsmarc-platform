import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

export const onWebinarRegister = onDocumentCreated("leads/{leadId}", async (event) => {
  const snapshot = event.data;

  if (!snapshot) {
    return;
  }

  const lead = snapshot.data();

  if (lead.source !== "webinar") {
    return;
  }

  logger.info("Registro de webinar detectado", { leadId: snapshot.id, email: lead.email });

  await getFirestore().collection("leadEvents").add({
    leadId: snapshot.id,
    source: "webinar",
    type: "webinar-registered",
    createdAt: new Date().toISOString(),
  });
});
