import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import ServiceSplitSection from "@/components/sections/ServiceSplitSection";
import FarmPartnershipsSection from "@/components/sections/FarmPartnershipsSection";
import CredibilitySection from "@/components/sections/CredibilitySection";
import { credibilityIndicators } from "@/content/credibility";

export const metadata: Metadata = {
  title: "Africom International Ltd — From Farm to Global Markets",
  description:
    "Africom International Ltd is a Tanzania-based agribusiness enterprise exporting premium horticultural produce and providing agribusiness consultation for farmers' organisations, cooperatives, and NGOs.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceSplitSection />
      <FarmPartnershipsSection />
      <CredibilitySection indicators={credibilityIndicators} />
    </>
  );
}
