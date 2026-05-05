import Button from "@/components/ui/Button";

export default function ServiceSplitSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Can We Help You?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Africom operates two distinct service lines. Select the one that fits your
            needs to learn more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Export */}
          <div data-testid="service-export-block" className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand-green rounded-xl flex items-center justify-center mb-5">
              <span className="text-white text-2xl" aria-hidden="true">🌾</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Agricultural Exports
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              We export premium Tanzanian horticultural produce — avocados, green beans,
              ginger, garlic, and capsicum — to regional and international buyers. From
              farm-gate sourcing to shipment, we handle the full export process.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                "Direct sourcing from Tanzanian producers",
                "Regional (East/Southern Africa) and international markets",
                "Flexible volumes — container and bulk orders",
                "Reliable logistics and documentation support",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-brand-green mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Button href="/exports" variant="primary">
              Explore Export Products →
            </Button>
          </div>

          {/* Consultation */}
          <div data-testid="service-consultation-block" className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center mb-5">
              <span className="text-white text-2xl" aria-hidden="true">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Development Consultation
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              We support NGOs, donors, and implementation partners with expert consultation
              across agricultural value chain topics — from programme design and value
              chain analysis to market linkage and MEL systems.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                "Value chain analysis and market systems diagnosis",
                "Agricultural programme design and feasibility",
                "Market linkage and trade facilitation",
                "Monitoring, evaluation, and learning (MEL)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-brand-gold mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Button href="/consultation" variant="secondary">
              Explore Consultation Services →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
