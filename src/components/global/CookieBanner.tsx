"use client";

import { useCookieConsent } from "@/hooks/useCookieConsent";

export function CookieBanner() {
  const { isVisible, accept, reject } = useCookieConsent();

  if (!isVisible) {
    return null;
  }

  return (
    <div className="mi-cookie-banner" role="dialog" aria-live="polite" aria-label="Consentimiento de cookies">
      <div>
        <p className="mi-cookie-title">Tu privacidad importa</p>
        <p className="mi-cookie-copy">
          Usamos cookies para mejorar la experiencia del sitio y habilitar medicion
          cuando aceptas.
        </p>
      </div>

      <div className="mi-cookie-actions">
        <button type="button" className="mi-btn-outline" onClick={reject}>
          Rechazar
        </button>
        <button type="button" className="mi-btn-gold" onClick={accept}>
          Aceptar
        </button>
      </div>
    </div>
  );
}
