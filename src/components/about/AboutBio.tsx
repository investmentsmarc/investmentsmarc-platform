import Image from "next/image";

import { ABOUT_QUOTE, ABOUT_STORY } from "@/lib/content";

export function AboutBio() {
  return (
    <section className="mi-section">
      <div className="mi-container mi-about-grid">
        <div className="mi-about-image-wrapper">
          <Image
            src="/images/marc-2026.jpg"
            alt="Marcos Martínez, fundador de Marc Investments"
            width={843}
            height={1264}
            priority
            className="mi-about-image"
          />
        </div>

        <div className="mi-about-content">
          <span className="mi-badge">Nuestra Historia</span>
          <h1 className="mi-section-title">
            El hombre detras de los <span className="mi-text-gradient">datos</span>
          </h1>
          {ABOUT_STORY.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="mi-about-quote">
            <p>{ABOUT_QUOTE}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
