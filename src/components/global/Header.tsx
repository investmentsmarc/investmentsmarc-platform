"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { NAV_ITEMS } from "@/lib/site";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`mi-header ${isScrolled ? "mi-header-scrolled" : ""}`}>
      <div className="mi-header-inner">
        <Link href="/" className="mi-header-brand" aria-label="Investments Marc">
          <span className="mi-header-brand-mark" aria-hidden="true">
            IM
          </span>
          <span>
            Investments <span className="mi-text-gradient">Marc</span>
          </span>
        </Link>

        <nav className="mi-nav-desktop" aria-label="Navegacion principal">
          {NAV_ITEMS.map((item) => {
            const className = item.isExternal
              ? "mi-nav-link"
              : `mi-nav-link ${isActivePath(pathname, item.href) ? "is-active" : ""}`;

            if (item.isExternal) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={className}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link key={item.label} href={item.href} className={className}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mi-header-actions">
          <Link href="/curso-gratis" className="mi-btn-gold mi-header-cta">
            Curso Gratis
          </Link>

          <button
            type="button"
            className="mi-mobile-toggle"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mi-mobile-nav ${isOpen ? "is-open" : ""}`} id="mobile-nav">
        <div className="mi-mobile-nav-panel">
          {NAV_ITEMS.map((item) => {
            if (item.isExternal) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="mi-mobile-link"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="mi-mobile-link"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/curso-gratis"
            className="mi-btn-gold mi-mobile-cta"
            onClick={() => setIsOpen(false)}
          >
            Empezar Gratis
          </Link>
        </div>
      </div>
    </header>
  );
}
