import { CORE_VALUES } from "@/lib/content";

export function ValuesGrid() {
  return (
    <section className="mi-section mi-values-section">
      <div className="mi-container">
        <div className="mi-home-section-head mi-home-section-head-centered mi-reveal">
          <div className="mi-home-section-copy">
            <span className="mi-badge">Principios</span>
            <h2 className="mi-section-title">
              Valores <span className="mi-text-gradient">Innegociables</span>
            </h2>
            <p className="mi-values-intro">
              Los seis anclajes que sostienen cada decisión, cada clase y cada
              framework. Sin ellos, no hay edge sostenible.
            </p>
          </div>
        </div>

        <div className="mi-values-grid">
          {CORE_VALUES.map((value, idx) => (
            <article
              key={value.id}
              className={`mi-value-card mi-reveal mi-reveal-scale mi-reveal-delay-${
                Math.min((idx % 6) + 1, 6)
              }`}
            >
              <span className="mi-value-index">
                {value.icon} / 0{CORE_VALUES.length}
              </span>
              <span className="mi-value-mark" aria-hidden="true">
                {value.icon}
              </span>
              <div className="mi-value-body">
                <h3 className="mi-value-title">{value.title}</h3>
                <p className="mi-value-desc">{value.description}</p>
              </div>
              <span className="mi-value-corner" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
