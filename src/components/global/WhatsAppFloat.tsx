"use client";

import { WHATSAPP_URL } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={`${WHATSAPP_URL}?text=Hola%20Marc%2C%20quiero%20mas%20informacion`}
      className="mi-whatsapp-float"
      target="_blank"
      rel="noreferrer"
      aria-label="Hablar con Marc"
    >
      <span className="mi-whatsapp-float-pulse" aria-hidden="true" />
      <svg
        className="mi-whatsapp-float-icon"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    </a>
  );
}
