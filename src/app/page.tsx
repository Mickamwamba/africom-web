import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import ServiceSplitSection from "@/components/sections/ServiceSplitSection";
import CredibilitySection from "@/components/sections/CredibilitySection";
import { credibilityIndicators } from "@/content/credibility";

export const metadata: Metadata = {
  title: "Africom — Agricultural Exports & Development Consulting",
  description:
    "Africom is a US-registered exporter of Tanzanian agricultural products and an expert agricultural development consultant for NGOs, donors, and implementation partners.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceSplitSection />
      <CredibilitySection indicators={credibilityIndicators} />
    </>
  );
}
