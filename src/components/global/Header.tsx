"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { NAV_ITEMS } from "@/lib/site";

function isActivePath(pathname: string, href: string) {
  // Hash links like "/#testimonios" are in-page anchors, never a route match
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
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
        <Link href="/" className="mi-header-brand" aria-label="Investments Marc - Trading Profesional">
          <Image
            src="/images/logo.png"
            alt="Marc Investments — Trading e Inversiones Profesionales"
            width={936}
            height={252}
            priority
            className="mi-header-brand-image"
          />
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
            const className = item.isExternal
              ? "mi-mobile-link"
              : `mi-mobile-link ${isActivePath(pathname, item.href) ? "is-active" : ""}`;

            if (item.isExternal) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={className}
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
                className={className}
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
