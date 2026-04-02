import type { Metadata } from "next";
import Link from "next/link";

import { PLATFORM_FLAGS } from "@/lib/platform";

export const metadata: Metadata = {
  title: "Login",
  description: "Base inicial para autenticación de estudiantes y acceso a cursos.",
};

export default function LoginPage() {
  return (
    <section className="mi-section">
      <div className="mi-container mi-post-layout">
        <span className="mi-badge">Auth</span>
        <h1 className="mi-section-title">Acceso de estudiantes</h1>
        <p className="mi-page-copy">
          Página base preparada para conectar login con Firebase Auth, proteger cursos y
          habilitar progreso personalizado.
        </p>
        <div className="mi-contact-points">
          <div className="mi-contact-point">
            <strong>Estado</strong>
            <span>
              {PLATFORM_FLAGS.firebaseAuthReady
                ? "La configuración pública base de Firebase ya está disponible."
                : "Falta terminar el wiring final de autenticación."}
            </span>
          </div>
        </div>
        <div className="mi-inline-actions">
          <Link href="/dashboard" className="mi-btn-gold">
            Ver dashboard base
          </Link>
          <Link href="/cursos" className="mi-btn-outline">
            Volver a cursos
          </Link>
        </div>
      </div>
    </section>
  );
}
