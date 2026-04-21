import type { FaqItem } from "@/types";

export function FAQGrid({ items }: { items: FaqItem[] }) {
  return (
    <div className="mi-faq-grid">
      {items.map((item, idx) => (
        <article
          key={item.id}
          className={`mi-faq-card mi-reveal mi-reveal-scale mi-reveal-delay-${Math.min((idx % 6) + 1, 6)}`}
        >
          <span className="mi-faq-card-index">
            {(idx + 1).toString().padStart(2, "0")}
          </span>
          <h3 className="mi-faq-card-question">{item.question}</h3>
          <p className="mi-faq-card-answer">{item.answer}</p>
        </article>
      ))}
    </div>
  );
}
