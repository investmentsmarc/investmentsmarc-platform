import Link from "next/link";

interface PagePlaceholderProps {
  badge: string;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function PagePlaceholder({
  badge,
  title,
  description,
  ctaHref,
  ctaLabel,
}: PagePlaceholderProps) {
  return (
    <section className="mi-section">
      <div className="mi-container mi-page-hero">
        <span className="mi-badge">{badge}</span>
        <h1 className="mi-section-title">{title}</h1>
        <p className="mi-page-copy">{description}</p>
        {ctaHref && ctaLabel ? (
          <Link href={ctaHref} className="mi-btn-gold">
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
