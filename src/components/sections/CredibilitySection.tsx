import type { CredibilityIndicator } from "@/content/credibility";
import Image from "next/image";

interface Props {
  indicators: CredibilityIndicator[];
}

export default function CredibilitySection({ indicators }: Props) {
  if (indicators.length === 0) return null;

  const partners = indicators.filter((i) => i.type === "partner-logo");
  const certifications = indicators.filter((i) => i.type === "certification");
  const highlights = indicators.filter((i) => i.type === "project-highlight");

  return (
    <section data-testid="credibility-section" className="section-padding bg-white border-t border-gray-100">
      <div className="container-lg">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
          Trusted by Leading Organisations
        </h2>

        {partners.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-center mb-6">
              Partners & Clients
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {partners.map((p) => (
                <div key={p.id} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all">
                  {p.imageUrl ? (
                    <Image src={p.imageUrl} alt={p.name} width={120} height={60} className="object-contain" />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">{p.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-center mb-6">
              Certifications
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {certifications.map((c) => (
                <div key={c.id} className="bg-gray-50 rounded-lg p-4 text-center min-w-[120px]">
                  {c.imageUrl && (
                    <Image src={c.imageUrl} alt={c.name} width={60} height={60} className="mx-auto mb-2 object-contain" />
                  )}
                  <p className="text-xs font-medium text-gray-700">{c.name}</p>
                  {c.year && <p className="text-xs text-gray-500">{c.year}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {highlights.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-center mb-6">
              Project Highlights
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {highlights.map((h) => (
                <div key={h.id} className="bg-brand-cream rounded-xl p-5">
                  <p className="font-semibold text-gray-900 text-sm mb-1">{h.name}</p>
                  {h.description && (
                    <p className="text-gray-600 text-xs leading-relaxed">{h.description}</p>
                  )}
                  {h.year && <p className="text-xs text-gray-500 mt-2">{h.year}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
