import { HOME_TESTIMONIALS } from "@/lib/site";

export function Testimonials() {
  return (
    <section className="mi-section mi-section-secondary">
      <div className="mi-container">
        <div className="mi-home-section-head mi-home-section-head-stack">
          <div>
            <span className="mi-badge">Testimonios</span>
            <h2 className="mi-section-title">Lo que dicen nuestros estudiantes</h2>
          </div>
          <p className="mi-section-subtitle">
            Una primera seleccion estatica mientras conectamos el contenido editorial en la siguiente fase.
          </p>
        </div>

        <div className="mi-testimonials-grid">
          {HOME_TESTIMONIALS.map((testimonial) => (
            <article key={testimonial.id} className="mi-testimonial-card">
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
      </div>
    </section>
  );
}
