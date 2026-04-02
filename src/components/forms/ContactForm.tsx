"use client";

import { useState } from "react";

import { createLead } from "@/lib/leads";
import { WHATSAPP_URL } from "@/lib/site";

type FormState = {
  name: string;
  email: string;
  whatsapp: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  whatsapp: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      await createLead({
        name: form.name,
        email: form.email,
        whatsapp: form.whatsapp,
        message: form.message,
        source: "contacto",
        utmSource: "contact-page",
      });

      setForm(initialState);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(
        "No pudimos enviar tu mensaje ahora mismo. Intenta nuevamente o escribenos por WhatsApp."
      );
    }
  };

  return (
    <div className="mi-contact-grid">
      <div className="mi-contact-intro">
        <span className="mi-badge">Contacto</span>
        <h1 className="mi-section-title">Hablemos de tu siguiente nivel en trading.</h1>
        <p className="mi-page-copy">
          Cuentanos en que punto estas, que necesitas mejorar y que tipo de apoyo
          estas buscando. Registramos tu interes en Firebase y mantenemos WhatsApp
          como canal principal de seguimiento.
        </p>

        <div className="mi-contact-points">
          <div className="mi-contact-point">
            <strong>Canal principal</strong>
            <span>WhatsApp directo con Marc</span>
          </div>
          <div className="mi-contact-point">
            <strong>Respuesta esperada</strong>
            <span>Seguimiento manual y priorizado segun contexto</span>
          </div>
          <div className="mi-contact-point">
            <strong>Ideal para</strong>
            <span>Dudas de cursos, herramientas, mentoring y roadmap personal</span>
          </div>
        </div>

        <a
          href={`${WHATSAPP_URL}?text=Hola%20Marc%2C%20quiero%20mas%20informacion%20sobre%20sus%20programas`}
          className="mi-btn-outline"
          target="_blank"
          rel="noreferrer"
        >
          Escribir por WhatsApp
        </a>
      </div>

      <div className="mi-contact-card">
        <form className="mi-contact-form" onSubmit={handleSubmit}>
          <label className="mi-form-field">
            <span>Nombre</span>
            <input
              required
              type="text"
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              placeholder="Tu nombre"
            />
          </label>

          <label className="mi-form-field">
            <span>Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="tu@email.com"
            />
          </label>

          <label className="mi-form-field">
            <span>WhatsApp</span>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(event) => handleChange("whatsapp", event.target.value)}
              placeholder="+1 832 953 4918"
            />
          </label>

          <label className="mi-form-field">
            <span>Mensaje</span>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(event) => handleChange("message", event.target.value)}
              placeholder="Cuéntanos en qué etapa estás y qué te gustaría conseguir."
            />
          </label>

          <button type="submit" className="mi-btn-gold" disabled={status === "submitting"}>
            {status === "submitting" ? "Enviando..." : "Enviar mensaje"}
          </button>

          {status === "success" ? (
            <p className="mi-form-success">
              Mensaje enviado. Ya registramos tu lead en Firebase y puedes continuar por
              WhatsApp si quieres acelerar la conversacion.
            </p>
          ) : null}

          {status === "error" ? <p className="mi-form-error">{errorMessage}</p> : null}
        </form>
      </div>
    </div>
  );
}
