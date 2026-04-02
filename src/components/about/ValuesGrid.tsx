import { CORE_VALUES } from "@/lib/content";

export function ValuesGrid() {
  return (
    <section className="mi-section">
      <div className="mi-container">
        <div className="mi-tools-hero">
          <span className="mi-badge">Principios</span>
          <h2 className="mi-section-title">
            Valores <span className="mi-text-gradient">Innegociables</span>
          </h2>
        </div>

        <div className="mi-values-grid">
          {CORE_VALUES.map((value) => (
            <article key={value.id} className="mi-value-card">
              <div className="mi-value-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p className="mi-text-secondary">{value.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
