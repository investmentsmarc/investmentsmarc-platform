import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";

export const stripeWebhook = onRequest(async (request, response) => {
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signingSecret) {
    logger.warn("STRIPE_WEBHOOK_SECRET no configurado.");
    response.status(501).json({
      ok: false,
      message: "Stripe webhook no configurado todavia.",
    });
    return;
  }

  response.status(202).json({
    ok: true,
    message: "Webhook recibido. Implementar verificacion de firma y fulfillment.",
    method: request.method,
  });
});
