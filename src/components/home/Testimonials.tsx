import Link from "next/link";

import { HOME_TESTIMONIALS } from "@/lib/site";

export function Testimonials() {
  return (
    <section className="mi-section mi-section-secondary mi-home-band" id="testimonios">
      <div className="mi-container">
        <div className="mi-home-section-head mi-home-section-head-centered">
          <div className="mi-home-section-copy mi-reveal">
            <span className="mi-badge">Testimonios</span>
            <h2 className="mi-section-title">Lo que dicen nuestros estudiantes</h2>
          </div>
        </div>

        <div className="mi-testimonials-grid">
          {HOME_TESTIMONIALS.map((testimonial, idx) => (
            <article
              key={testimonial.id}
              className={`mi-testimonial-card mi-reveal mi-reveal-scale mi-reveal-delay-${Math.min(idx + 1, 6)}`}
            >
              <div className="mi-stars" aria-label={`${testimonial.rating ?? 5} estrellas`}>
                {"★★★★★"}
              </div>
              <p className="mi-testimonial-quote">“{testimonial.quote}”</p>
              <div className="mi-testimonial-author">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mi-home-section-footer mi-reveal mi-reveal-delay-2">
          <Link href="/curso-gratis" className="mi-btn-gold mi-home-section-cta">
            Comienza tu transformacion
          </Link>
        </div>
      </div>
    </section>
  );
}
