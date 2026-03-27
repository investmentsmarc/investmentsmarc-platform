"use client";

import { WHATSAPP_URL } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={`${WHATSAPP_URL}?text=Hola%20Marc%2C%20quiero%20mas%20informacion`}
      className="mi-whatsapp-float"
      target="_blank"
      rel="noreferrer"
      aria-label="Hablar por WhatsApp"
    >
      <span className="mi-whatsapp-float-pulse" aria-hidden="true" />
      <span className="mi-whatsapp-float-label">WA</span>
    </a>
  );
}
