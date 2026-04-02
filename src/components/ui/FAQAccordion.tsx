"use client";

import { useState } from "react";

import type { FaqItem } from "@/types";

export function FAQAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="mi-faq-list">
      {items.map((item) => {
        const isOpen = item.id === openId;

        return (
          <div key={item.id} className={`mi-faq-item ${isOpen ? "mi-faq-open" : ""}`}>
            <button
              type="button"
              className="mi-faq-question"
              onClick={() => setOpenId((current) => (current === item.id ? null : item.id))}
            >
              <span>{item.question}</span>
              <span className="mi-faq-icon">+</span>
            </button>
            <div className="mi-faq-answer">
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
