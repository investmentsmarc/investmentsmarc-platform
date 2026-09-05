"use client";

import { useEffect } from "react";

import { useCookieConsent } from "@/hooks/useCookieConsent";
import { getFirebaseApp } from "@/lib/firebase";

// El banner de cookies ya prometia "habilitar medicion cuando aceptas" y no habia
// ninguna medicion: `measurementId` estaba configurado pero `getAnalytics` no se
// llamaba en ningun sitio. Esto lo conecta cumpliendo la promesa literal del
// banner, ni antes ni de mas.
//
// 🚨 Se arranca SOLO con consentimiento explicito. `rejected` y `null` no cargan
// nada: el import de `firebase/analytics` es dinamico, asi que quien rechaza ni
// siquiera descarga el modulo.
export function AnalyticsConsent() {
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (consent !== "accepted") {
      return;
    }

    if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
      return;
    }

    let cancelado = false;

    void (async () => {
      const { getAnalytics, isSupported } = await import("firebase/analytics");

      // `isSupported` es obligatorio: en navegadores sin IndexedDB o en modo
      // privado, `getAnalytics` lanza y tumbaria el arbol de React.
      if (!(await isSupported()) || cancelado) {
        return;
      }

      getAnalytics(getFirebaseApp());
    })();

    return () => {
      cancelado = true;
    };
  }, [consent]);

  return null;
}
