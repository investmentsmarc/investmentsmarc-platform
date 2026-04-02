import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="mi-hero">
      <div className="mi-container mi-hero-grid">
        <div className="mi-hero-copy">
          <span className="mi-badge">Fundador & Senior Trader</span>
          <h1 className="mi-hero-title">
            <span className="mi-hero-title-line">El poder de las</span>
            <span className="mi-hero-title-line">
              <span className="mi-text-gradient">Instituciones</span> en tus
            </span>
            <span className="mi-hero-title-line">manos.</span>
          </h1>
          <p className="mi-hero-description">
            <span className="mi-hero-copy-line">
              Hacer <span className="mi-text-gradient">trading</span> sin
            </span>
            <span className="mi-hero-copy-line">aprender es como</span>
            <span className="mi-hero-copy-line">navegar sin brujula:</span>
            <span className="mi-hero-copy-line">
              <span className="mi-text-gradient">puedes moverte</span>, pero
            </span>
            <span className="mi-hero-copy-line">dificilmente llegaras</span>
            <span className="mi-hero-copy-line">lejos.</span>
          </p>
          <Image
            src="/images/marc-signature.png"
            alt="Firma de Marcos Martinez"
            width={420}
            height={174}
            className="hero-signature"
          />
          <div className="mi-hero-actions">
            <Link href="/curso-gratis" className="mi-btn-gold mi-hero-primary-btn">
              Ver Curso Gratuito
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
