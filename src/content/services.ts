export type AudienceType =
  | "ngo"
  | "donor"
  | "implementation-partner"
  | "farmers-organisation"
  | "cooperative"
  | "development-partner";

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
  "farmers-organisation": "Farmers' Organisation",
  cooperative: "Cooperative",
  "development-partner": "Development Partner",
};

export const services: ConsultationService[] = [
  {
    id: "agribusiness-consultation",
    name: "Agribusiness Consultation",
    description:
      "Africom International Ltd provides strategic agribusiness guidance to farmers' organisations, cooperatives, and NGOs across Tanzania and the wider East Africa region. We help clients assess market opportunities, develop business plans, strengthen governance, and navigate the agricultural value chain to improve productivity and profitability.",
    targetAudience: ["farmers-organisation", "cooperative", "ngo"],
    valueChainTopics: [
      "Market opportunity assessment",
      "Agribusiness business plan development",
      "Cooperative governance strengthening",
      "Value chain integration for smallholders",
      "Input supply and post-harvest management",
    ],
    deliverables: [
      "Agribusiness assessment report",
      "Business development roadmap",
      "Stakeholder engagement plan",
    ],
    sortOrder: 1,
  },
  {
    id: "trade-facilitation",
    name: "Trade Facilitation",
    description:
      "We connect African agricultural produce to international markets by supporting farmers' organisations, cooperatives, and implementation partners with export readiness, buyer linkages, and trade logistics. Our established relationships with regional and international buyers help clients access higher-value markets.",
    targetAudience: ["farmers-organisation", "cooperative", "implementation-partner"],
    valueChainTopics: [
      "Export readiness assessment",
      "Buyer-seller matchmaking and linkage",
      "Trade documentation and compliance",
      "Commodity price monitoring and intelligence",
      "Trade corridor and logistics analysis",
    ],
    deliverables: [
      "Export readiness report",
      "Market linkage action plan",
      "Trade facilitation framework",
    ],
    sortOrder: 2,
  },
  {
    id: "capacity-building",
    name: "Agribusiness Capacity Building",
    description:
      "Africom International Ltd designs and delivers capacity building programmes that equip farmers' organisations, cooperatives, NGOs, and development partners with the skills and knowledge to manage agribusiness operations, improve quality standards, and achieve long-term sustainability.",
    targetAudience: ["farmers-organisation", "cooperative", "ngo", "development-partner"],
    valueChainTopics: [
      "Farmer business school facilitation",
      "Quality assurance and food safety training",
      "Financial management for agribusinesses",
      "Leadership and cooperative governance",
      "Digital tools for farm management",
    ],
    deliverables: [
      "Training curriculum and materials",
      "Facilitator guide and participant workbook",
      "Post-training impact assessment",
    ],
    sortOrder: 3,
  },
  {
    id: "sustainability-initiatives",
    name: "Sustainability Initiatives",
    description:
      "We work with NGOs, donors, and development partners to design and implement sustainability programmes in the agricultural sector — promoting eco-friendly farming practices, fair trade principles, environmental stewardship, and community empowerment across the agricultural value chain.",
    targetAudience: ["ngo", "donor", "development-partner"],
    valueChainTopics: [
      "Eco-friendly and climate-smart farming practices",
      "Fair trade certification and compliance support",
      "Community empowerment and gender inclusion",
      "Environmental impact assessment",
      "Sustainability reporting and communications",
    ],
    deliverables: [
      "Sustainability programme design document",
      "Environmental and social impact assessment",
      "Community engagement framework",
    ],
    sortOrder: 4,
  },
];
