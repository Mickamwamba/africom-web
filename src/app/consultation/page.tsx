import type { Metadata } from "next";
import ConsultationServiceCard from "@/components/sections/ConsultationServiceCard";
import Button from "@/components/ui/Button";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Consultation Services",
  description:
    "Africom provides expert agricultural development consultation for NGOs, donors, and implementation partners — from value chain analysis to programme design and MEL systems.",
};

export default function ConsultationPage() {
  return (
    <div className="section-padding">
      <div className="container-lg">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-brand-gold font-semibold text-sm uppercase tracking-wide mb-3">
            Development Consultation
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Agricultural Value Chain Expertise
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Africom works with NGOs, donors, and implementation partners across East Africa
            to design, implement, and evaluate agricultural development programmes. Our
            team brings deep field experience and practical knowledge of Tanzania&apos;s
            agricultural systems.
          </p>
        </div>

        {/* Who we work with */}
        <div className="flex flex-wrap gap-3 mb-12">
          <span className="bg-amber-50 text-amber-800 text-sm font-medium px-4 py-2 rounded-full border border-amber-200">
            NGOs
          </span>
          <span className="bg-amber-50 text-amber-800 text-sm font-medium px-4 py-2 rounded-full border border-amber-200">
            Bilateral & Multilateral Donors
          </span>
          <span className="bg-amber-50 text-amber-800 text-sm font-medium px-4 py-2 rounded-full border border-amber-200">
            Implementation Partners
          </span>
          <span className="bg-amber-50 text-amber-800 text-sm font-medium px-4 py-2 rounded-full border border-amber-200">
            Private Sector
          </span>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {services
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((service) => (
              <ConsultationServiceCard key={service.id} service={service} />
            ))}
        </div>

        {/* CTA */}
        <div className="bg-brand-gold rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Looking for a Consultation Partner?
          </h2>
          <p className="text-yellow-100 mb-6 max-w-xl mx-auto">
            Tell us about your programme or project and we will discuss how Africom can
            support your objectives. We respond to all enquiries within 2 business days.
          </p>
          <Button href="/contact" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-gold">
            Request a Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}
