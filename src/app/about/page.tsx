import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import CredibilitySection from "@/components/sections/CredibilitySection";
import { company } from "@/content/company";
import { credibilityIndicators } from "@/content/credibility";

export const metadata: Metadata = {
  title: "About Africom",
  description:
    "Learn about Africom — a US-registered business exporting Tanzanian agricultural products and providing agricultural development consultation across East Africa.",
};

export default function AboutPage() {
  const allMarkets = [
    ...company.regionalMarkets,
    ...company.internationalMarkets,
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-cream section-padding">
        <div className="container-lg max-w-4xl">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-wide mb-3">
            About Us
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Who We Are
          </h1>
          <p className="text-gray-700 text-xl leading-relaxed">
            {company.description}
          </p>
        </div>
      </section>

      {/* Details */}
      <section className="section-padding">
        <div className="container-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">{company.mission}</p>
            </div>

            {/* Key facts */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Facts</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Registration
                  </dt>
                  <dd className="text-gray-800 mt-1">{company.usRegistrationStatus}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Operating Country
                  </dt>
                  <dd className="text-gray-800 mt-1">{company.operatingCountry}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Founded
                  </dt>
                  <dd className="text-gray-800 mt-1">{company.foundedYear}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Market Reach
                  </dt>
                  <dd className="text-gray-800 mt-1">{allMarkets.join(" · ")}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Services summary */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-brand-green text-white rounded-2xl p-8">
              <div className="text-3xl mb-4" aria-hidden="true">🌾</div>
              <h3 className="text-xl font-bold mb-2">Agricultural Exports</h3>
              <p className="text-green-100 text-sm leading-relaxed mb-4">
                Premium Tanzanian agricultural commodities exported to regional and
                international markets with reliable logistics and documentation.
              </p>
              <Button href="/exports" variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-brand-green">
                View Products
              </Button>
            </div>
            <div className="bg-brand-gold text-white rounded-2xl p-8">
              <div className="text-3xl mb-4" aria-hidden="true">📊</div>
              <h3 className="text-xl font-bold mb-2">Development Consultation</h3>
              <p className="text-yellow-100 text-sm leading-relaxed mb-4">
                Expert support for NGOs, donors, and implementation partners across
                agricultural value chain topics in East Africa.
              </p>
              <Button href="/consultation" variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-brand-gold">
                View Services
              </Button>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Want to work with us?</p>
            <Button href="/contact" variant="primary" size="lg">
              Contact Africom
            </Button>
          </div>
        </div>
      </section>

      <CredibilitySection indicators={credibilityIndicators} />
    </div>
  );
}
