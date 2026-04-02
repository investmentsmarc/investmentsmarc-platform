import Image from "next/image";

import { ABOUT_QUOTE, ABOUT_STORY } from "@/lib/content";

export function AboutBio() {
  return (
    <section className="mi-section">
      <div className="mi-container mi-about-grid">
        <div className="mi-about-image-wrapper">
          <Image
            src="/images/marc-image.jpg"
            alt="Marcos Martinez"
            width={720}
            height={960}
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
