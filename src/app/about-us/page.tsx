import type { Metadata } from "next";

import { AboutBio } from "@/components/about/AboutBio";
import { FlowTitanCards } from "@/components/about/FlowTitanCards";
import { ValuesGrid } from "@/components/about/ValuesGrid";
import { paginaMetadata } from "@/lib/seo";

export const metadata: Metadata = paginaMetadata({
  ruta: "/about-us",
  titulo: "About Us",
  descripcion: "Historia, enfoque y filosofia de Investments Marc.",
});

export default function AboutUsPage() {
  return (
    <>
      <AboutBio />
      <FlowTitanCards />
      <ValuesGrid />
    </>
  );
}
