"use client";

import { useState } from "react";

import { createLead } from "@/lib/leads";

export function LeadForm() {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");

    try {
      await createLead({
        name: form.name,
        email: form.email,
        whatsapp: form.whatsapp,
        source: "curso-gratis",
        utmSource: "curso-gratis",
        extra: {
          offer: "smart-money-basics",
        },
      });

      setForm({ name: "", email: "", whatsapp: "" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="mi-contact-form" onSubmit={handleSubmit}>
      <label className="mi-form-field">
        <span>Nombre</span>
        <input
          required
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="Tu nombre"
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
          value={form.whatsapp}
          onChange={(event) =>
            setForm((current) => ({ ...current, whatsapp: event.target.value }))
          }
          placeholder="+1 832 953 4918"
        />
      </label>
      <button className="mi-btn-gold" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Enviando..." : "Quiero el Curso Gratis"}
      </button>
      {status === "success" ? (
        <p className="mi-form-success">
          Registro recibido. Tu lead ya quedó guardado y el siguiente paso es activarte
          por los canales configurados.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mi-form-error">No pudimos registrar tu solicitud. Intenta de nuevo.</p>
      ) : null}
    </form>
  );
}
