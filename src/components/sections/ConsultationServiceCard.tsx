import type { ConsultationService } from "@/content/services";
import { audienceLabels } from "@/content/services";

interface Props {
  service: ConsultationService;
}

export default function ConsultationServiceCard({ service }: Props) {
  return (
    <article
      data-testid="service-card"
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4"
    >
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
        <div data-testid="service-audience" className="flex flex-wrap gap-2">
          {service.targetAudience.map((aud) => (
            <span
              key={aud}
              className="bg-amber-50 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full border border-amber-200"
            >
              {audienceLabels[aud]}
            </span>
          ))}
        </div>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>

      <div data-testid="service-topics">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Topics Covered
        </p>
        <ul className="space-y-1">
          {service.valueChainTopics.map((topic) => (
            <li key={topic} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-brand-gold mt-0.5 flex-shrink-0">✓</span>
              {topic}
            </li>
          ))}
        </ul>
      </div>

      {service.deliverables && service.deliverables.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Typical Deliverables
          </p>
          <ul className="space-y-1">
            {service.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-400 mt-0.5 flex-shrink-0">→</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
