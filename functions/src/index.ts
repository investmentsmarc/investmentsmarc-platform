import { setGlobalOptions } from "firebase-functions/v2";

import { onLeadCapture } from "./triggers/onLeadCapture";
import { onWebinarRegister } from "./triggers/onWebinarRegister";
import { refreshMarketNews } from "./triggers/refreshMarketNews";
import { stripeWebhook } from "./https/stripeWebhook";

setGlobalOptions({ region: "us-central1", maxInstances: 5 });

export { onLeadCapture, onWebinarRegister, refreshMarketNews, stripeWebhook };
