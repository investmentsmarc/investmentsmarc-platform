import "server-only";

import {
  cert,
  getApps,
  initializeApp,
  applicationDefault,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// En App Hosting / Cloud Run usa Application Default Credentials del service
// account por defecto. En local, permite usar FIREBASE_SERVICE_ACCOUNT_JSON
// (JSON completo en una sola variable) o GOOGLE_APPLICATION_CREDENTIALS.

let adminApp: App | undefined;

function resolveCredentials() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as ServiceAccount;
      return cert(parsed);
    } catch (err) {
      console.error(
        "[firebaseAdmin] FIREBASE_SERVICE_ACCOUNT_JSON no es JSON válido:",
        err,
      );
    }
  }
  return applicationDefault();
}

export function getAdminApp(): App {
  if (adminApp) return adminApp;
  const existing = getApps();
  if (existing.length > 0) {
    adminApp = existing[0];
    return adminApp;
  }
  adminApp = initializeApp({
    credential: resolveCredentials(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
  return adminApp;
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}
