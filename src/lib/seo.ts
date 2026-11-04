import type { Metadata } from "next";

/**
 * Metadatos por página estática (rutas con `export const metadata`, no
 * `generateMetadata`).
 *
 * ## Por qué existe
 *
 * `<title>` y la meta `description` ya se generaban por ruta -- cada página
 * exportaba su propio `metadata: Metadata = { title, description }` -- pero
 * ninguna declaraba `openGraph` ni `twitter`. Next.js fusiona los metadatos
 * del layout raíz con los de la página por clave de nivel superior: si la
 * página no declara `openGraph`, hereda el objeto COMPLETO del layout, sin
 * regenerarlo a partir del `title`/`description` de esa página. Resultado
 * (auditoría SEO+IA, 2026-09-10): las 11 páginas no-home compartían el
 * `og:url`, `og:title` y `og:description` de la home -- compartir enlace o
 * abrir cualquiera de ellas en un chat de IA mostraba siempre el pitch de
 * la portada, nunca el tema real de la página.
 *
 * Esta función construye el objeto `openGraph`/`twitter` a partir de los
 * mismos `title`/`description` que la página ya declara, así que hay una
 * sola fuente para las tres superficies (pestaña del navegador, tarjeta de
 * compartir, resumen para un asistente de IA) en vez de dos verdades del
 * mismo dato.
 */
export function paginaMetadata({
  ruta,
  titulo,
  descripcion,
}: {
  /** Con barra inicial, sin barra final: "/about-us", "/herramientas/investment-calculator". */
  ruta: string;
  titulo: string;
  descripcion: string;
}): Metadata {
  const url = `https://investmentsmarc.com${ruta}`;
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: titulo,
      description: descripcion,
    },
    twitter: {
      title: titulo,
      description: descripcion,
    },
  };
}
