"use client";

import { useCountdown } from "@/hooks/useCountdown";

export function Countdown() {
  const { targetDate, parts } = useCountdown();
  const [days, hours, minutes, seconds] = parts;

  return (
    <div className="mi-countdown-shell">
      <div className="mi-countdown-grid">
        {[
          { label: "Dias", value: days },
          { label: "Horas", value: hours },
          { label: "Min", value: minutes },
          { label: "Seg", value: seconds },
        ].map((part) => (
          <div key={part.label} className="mi-countdown-card">
            <strong>{String(part.value).padStart(2, "0")}</strong>
            <span>{part.label}</span>
          </div>
        ))}
      </div>
      <p className="mi-countdown-note">
        Proxima sesión estimada: {targetDate.toLocaleString("es-ES", { dateStyle: "full", timeStyle: "short" })} EST
      </p>
    </div>
  );
}
