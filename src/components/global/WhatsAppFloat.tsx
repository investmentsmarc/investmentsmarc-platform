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
      <svg
        className="mi-whatsapp-float-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C9.41 21 3 14.59 3 6c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
          fill="white"
        />
      </svg>
    </a>
  );
}
