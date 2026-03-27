import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Canal principal de contacto y acompañamiento.",
};

export default function ContactoPage() {
  return (
    <PagePlaceholder
      badge="Contacto"
      title="Contacto multicanal en preparacion."
      description="La fase siguiente migrara el flujo actual de WhatsApp a Firestore + notificacion, manteniendo WhatsApp como canal principal de cierre y atencion."
      ctaHref="/curso-gratis"
      ctaLabel="Empezar Gratis"
    />
  );
}
