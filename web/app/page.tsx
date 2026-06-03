import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { Marquee } from "@/components/Marquee";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { TwoWaysSection } from "@/components/sections/TwoWaysSection";
import { FeaturedSkills } from "@/components/sections/FeaturedSkills";
import { ThreeSteps } from "@/components/sections/ThreeSteps";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { DomainGrid } from "@/components/sections/DomainGrid";
import { GateCallout } from "@/components/sections/GateCallout";
import { SectionReveal } from "@/components/SectionReveal";

export const metadata: Metadata = {
  title: "cbug — Claude Bug Hunting Skills",
  description:
    "51 specialized Claude skills for bug hunting, web security, and external red-team workflows. Auto-load by context. 7-Question Gate before every submission.",
};

export default function HomePage() {
  return (
    <>
      <Nav />
      {/* Hero and Marquee are above-fold — no entrance animation */}
      <HeroSection />
      <Marquee />

      {/* Every section below the fold gets a section-level motion.div */}
      <SectionReveal><StatsStrip /></SectionReveal>
      <SectionReveal><TwoWaysSection /></SectionReveal>
      <SectionReveal><FeaturedSkills /></SectionReveal>
      <SectionReveal><ThreeSteps /></SectionReveal>
      <SectionReveal><HowItWorks /></SectionReveal>
      <SectionReveal><DomainGrid /></SectionReveal>
      <SectionReveal><GateCallout /></SectionReveal>
      <Footer />
    </>
  );
}
