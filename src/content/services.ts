export type AudienceType = "ngo" | "donor" | "implementation-partner";

export interface ConsultationService {
  id: string;
  name: string;
  description: string;
  targetAudience: AudienceType[];
  valueChainTopics: string[];
  deliverables?: string[];
  sortOrder: number;
}

export const audienceLabels: Record<AudienceType, string> = {
  ngo: "NGO",
  donor: "Donor",
  "implementation-partner": "Implementation Partner",
};

export const services: ConsultationService[] = [
  {
    id: "value-chain-analysis",
    name: "Agricultural Value Chain Analysis",
    description:
      "We conduct end-to-end analysis of agricultural value chains — from farm-gate to final market — identifying bottlenecks, market linkage gaps, and opportunities for smallholder integration. Our findings are translated into actionable programme recommendations.",
    targetAudience: ["ngo", "donor", "implementation-partner"],
    valueChainTopics: [
      "Value chain mapping and actor analysis",
      "Market systems diagnosis",
      "Smallholder integration pathways",
      "Post-harvest loss assessment",
      "Input supply chain analysis",
    ],
    deliverables: [
      "Value chain assessment report",
      "Stakeholder mapping matrix",
      "Intervention prioritisation framework",
    ],
    sortOrder: 1,
  },
  {
    id: "project-design",
    name: "Agricultural Programme Design & Feasibility",
    description:
      "Africom supports donors and implementing partners in designing evidence-based agricultural programmes. We provide feasibility studies, logframes, Theory of Change development, and cost-effectiveness analysis tailored to East African contexts.",
    targetAudience: ["donor", "implementation-partner"],
    valueChainTopics: [
      "Programme logic design (ToC, logframe)",
      "Feasibility and scoping studies",
      "Cost-benefit and value-for-money analysis",
      "Gender and social inclusion integration",
      "Climate-smart agriculture mainstreaming",
    ],
    deliverables: [
      "Feasibility study report",
      "Programme design document",
      "Results framework and indicator set",
    ],
    sortOrder: 2,
  },
  {
    id: "market-linkage",
    name: "Market Linkage & Trade Facilitation",
    description:
      "We facilitate direct connections between smallholder farmer groups, aggregators, and export-ready buyers. Our team has established relationships with regional and international off-takers across key Tanzanian commodities.",
    targetAudience: ["ngo", "implementation-partner"],
    valueChainTopics: [
      "Buyer-seller matchmaking",
      "Export readiness assessment for farmer groups",
      "Contract farming model design",
      "Commodity price monitoring",
      "Trade corridor analysis",
    ],
    sortOrder: 3,
  },
  {
    id: "monitoring-evaluation",
    name: "Monitoring, Evaluation & Learning (MEL)",
    description:
      "Africom designs and implements MEL systems for agricultural development programmes, including baseline surveys, household income tracking, and outcome harvesting aligned with donor reporting requirements.",
    targetAudience: ["ngo", "donor", "implementation-partner"],
    valueChainTopics: [
      "MEL framework design",
      "Baseline and endline surveys",
      "Household income and food security measurement",
      "Outcome harvesting and case study documentation",
      "DMEL system setup and training",
    ],
    deliverables: [
      "MEL framework document",
      "Baseline survey report",
      "Quarterly progress reporting templates",
    ],
    sortOrder: 4,
  },
];
