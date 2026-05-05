import type { Metadata } from "next";
import ProductCategoryCard from "@/components/sections/ProductCategoryCard";
import Button from "@/components/ui/Button";
import { products } from "@/content/products";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "Export Products — Africom International Ltd",
  description:
    "Explore Africom International Ltd's Tanzanian horticultural exports — avocados, green beans, ginger, garlic, and capsicum — delivered to regional and international markets.",
};

export default function ExportsPage() {
  const allMarkets = [
    ...company.regionalMarkets,
    ...company.internationalMarkets,
  ];

  return (
    <div className="section-padding">
      <div className="container-lg">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-brand-earth-brown font-semibold text-sm uppercase tracking-wide mb-3">
            Agricultural Exports
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tanzania&apos;s Finest Agricultural Products
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Africom sources premium agricultural products directly from Tanzania&apos;s
            most productive regions, connecting trusted producers with buyers across{" "}
            {allMarkets.join(", ")}.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {products
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((product) => (
              <ProductCategoryCard key={product.id} product={product} />
            ))}
        </div>

        {/* CTA */}
        <div className="bg-brand-earth-brown rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Source from Tanzania?
          </h2>
          <p className="text-green-100 mb-6 max-w-xl mx-auto">
            Contact us to discuss product availability, volumes, pricing, and shipping
            logistics. We respond to all inquiries within 2 business days.
          </p>
          <Button href="/contact" variant="secondary" size="lg">
            Get in Touch
          </Button>
        </div>
      </div>
    </div>
  );
}
