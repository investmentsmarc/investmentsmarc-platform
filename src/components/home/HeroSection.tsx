import Link from "next/link";

export function HeroSection() {
  return (
    <section className="mi-hero">
      <div className="mi-container mi-hero-grid">
        <div className="mi-hero-copy">
          <span className="mi-badge">Fundador & Senior Trader</span>
          <h1 className="mi-hero-title">
            El poder de las <span className="mi-text-gradient">instituciones</span> en tus manos.
          </h1>
          <p className="mi-hero-description">
            Aprende a leer estructura, liquidez y contexto con una metodologia clara
            para traders e inversores que quieren dejar atras la improvisacion.
          </p>
          <div className="mi-hero-actions">
            <Link href="/curso-gratis" className="mi-btn-gold">
              Empieza Gratis
            </Link>
            <Link href="/about-us" className="mi-btn-outline">
              Conoce Mas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
