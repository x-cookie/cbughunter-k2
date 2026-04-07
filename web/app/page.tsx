import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { TwoWaysSection } from "@/components/sections/TwoWaysSection";
import { DomainGrid } from "@/components/sections/DomainGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { GateCallout } from "@/components/sections/GateCallout";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <StatsStrip />
        <TwoWaysSection />
        <DomainGrid />
        <HowItWorks />
        <GateCallout />
      </main>
      <Footer />
    </>
  );
}
