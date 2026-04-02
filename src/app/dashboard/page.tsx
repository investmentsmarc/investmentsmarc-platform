import type { Metadata } from "next";
import Link from "next/link";

import { PLATFORM_FLAGS } from "@/lib/platform";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Base del panel del estudiante para progreso y acceso a cursos.",
};

export default function DashboardPage() {
  return (
    <section className="mi-section">
      <div className="mi-container mi-post-layout">
        <span className="mi-badge">Panel del estudiante</span>
        <h1 className="mi-section-title">Dashboard en preparación</h1>
        <p className="mi-page-copy">
          Esta base deja el espacio para autenticación, enrollments, progreso, quizzes
          y certificados cuando se cierre la Fase 4.
        </p>
        <div className="mi-contact-points">
          <div className="mi-contact-point">
            <strong>Auth Firebase</strong>
            <span>{PLATFORM_FLAGS.firebaseAuthReady ? "Variables base detectadas." : "Pendiente de wiring final."}</span>
          </div>
          <div className="mi-contact-point">
            <strong>Stripe</strong>
            <span>{PLATFORM_FLAGS.stripeReady ? "Backend listo para conectar checkout." : "Checkout en modo preparado, sin llaves reales."}</span>
          </div>
        </div>
        <div className="mi-inline-actions">
          <Link href="/cursos" className="mi-btn-gold">
            Explorar cursos
          </Link>
          <Link href="/login" className="mi-btn-outline">
            Ir a Login base
          </Link>
          <Link href="/contacto" className="mi-btn-outline">
            Solicitar acceso
          </Link>
        </div>
      </div>
    </section>
  );
}
