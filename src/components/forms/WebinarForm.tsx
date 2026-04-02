"use client";

import { useState } from "react";

import { createLead } from "@/lib/leads";

export function WebinarForm() {
  const [form, setForm] = useState({ fullName: "", email: "", whatsapp: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");

    try {
      await createLead({
        name: form.fullName,
        email: form.email,
        whatsapp: form.whatsapp,
        source: "webinar",
        utmSource: "webinar",
        extra: {
          webinar: "smart-money-live",
        },
      });

      setForm({ fullName: "", email: "", whatsapp: "" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="mi-contact-form" onSubmit={handleSubmit}>
      <label className="mi-form-field">
        <span>Nombre completo</span>
        <input
          required
          value={form.fullName}
          onChange={(event) =>
            setForm((current) => ({ ...current, fullName: event.target.value }))
          }
          placeholder="Tu nombre completo"
        />
      </label>
      <label className="mi-form-field">
        <span>Email</span>
        <input
          required
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="tu@email.com"
        />
      </label>
      <label className="mi-form-field">
        <span>WhatsApp</span>
        <input
          required
          value={form.whatsapp}
          onChange={(event) =>
            setForm((current) => ({ ...current, whatsapp: event.target.value }))
          }
          placeholder="+1 832 953 4918"
        />
      </label>
      <button className="mi-btn-gold" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Reservando..." : "Reservar mi lugar"}
      </button>
      {status === "success" ? (
        <p className="mi-form-success">
          Tu registro al webinar quedó guardado. Ya puedes seguir por WhatsApp para
          confirmar tu asistencia.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mi-form-error">No pudimos registrar tu lugar. Intenta nuevamente.</p>
      ) : null}
    </form>
  );
}
