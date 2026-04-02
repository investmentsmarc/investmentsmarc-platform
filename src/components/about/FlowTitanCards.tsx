"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { FLOWTITAN_FEATURES, FLOWTITAN_SCREENS } from "@/lib/content";

const FLOWTITAN_SCREEN_IMAGES = [
  "/images/flowtitan-1.png",
  "/images/flowtitan-2.png",
  "/images/flowtitan-3.png",
  "/images/flowtitan-4.png",
  "/images/flowtitan-5.png",
  "/images/flowtitan-6.png",
] as const;

export function FlowTitanCards() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % FLOWTITAN_SCREENS.length);
    }, 1800);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section className="mi-section mi-ft-section">
      <div className="mi-container mi-ft-grid">
        <div className="mi-ft-copy">
          <span className="mi-badge">Herramienta insignia</span>
          <h2 className="mi-section-title">
            FlowTitan <span className="mi-text-gradient">PRO</span>
          </h2>
          <p className="mi-page-copy">
            Una capa premium pensada para traders que quieren unir flujo,
            estructura, contexto y ejecución en una misma interfaz.
          </p>

          <ul className="mi-ft-feature-list">
            {FLOWTITAN_FEATURES.map((feature) => (
              <li key={feature.title} className="mi-ft-feature-item">
                <div className="mi-ft-icon">•</div>
                <div>
                  <strong>{feature.title}</strong>
                  <p>{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link href="/cursos/flowtitan-pro" className="mi-btn-gold">
            Explorar FlowTitan
          </Link>
        </div>

        <div className="mi-ft-card-container">
          <div className="mi-ft-card-stack">
            {FLOWTITAN_SCREENS.map((screen, index) => {
              const distance = (index - activeIndex + FLOWTITAN_SCREENS.length) % FLOWTITAN_SCREENS.length;
              const visualIndex = Math.min(distance, 4);

              return (
                <article
                  key={screen}
                  className={`mi-ft-card mi-ft-card-${visualIndex + 1}`}
                >
                  <span className="mi-ft-card-badge">{screen}</span>
                  <Image
                    src={FLOWTITAN_SCREEN_IMAGES[index]}
                    alt={`Pantalla ${screen} de FlowTitan`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 550px"
                    className="mi-ft-card-image"
                  />
                  <div className="mi-ft-card-surface">
                    <div className="mi-ft-card-kicker">FlowTitan</div>
                    <h3>{screen}</h3>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
