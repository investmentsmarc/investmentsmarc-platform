import type { Metadata } from "next";

import { AboutBio } from "@/components/about/AboutBio";
import { FlowTitanCards } from "@/components/about/FlowTitanCards";
import { ValuesGrid } from "@/components/about/ValuesGrid";

export const metadata: Metadata = {
  title: "About Us",
  description: "Historia, enfoque y filosofia de Investments Marc.",
};

export default function AboutUsPage() {
  return (
    <>
      <AboutBio />
      <FlowTitanCards />
      <ValuesGrid />
    </>
  );
}
