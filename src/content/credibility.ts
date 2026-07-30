export type IndicatorType =
  | "partner-logo"
  | "certification"
  | "project-highlight"
  | "stat"
  | "testimonial";

export interface CredibilityIndicator {
  id: string;
  type: IndicatorType;
  name: string;
  description?: string;
  imageUrl?: string;
  year?: number;
  quote?: string;
  sortOrder: number;
}

export const credibilityIndicators: CredibilityIndicator[] = [
  {
    id: "testimonial-oliver-hartman",
    type: "testimonial",
    name: "Oliver Hartman",
    description: "Procurement Lead, Global Fresh Imports",
    quote:
      "Outstanding service and deep knowledge of the agricultural value chain — Africom delivered beyond our expectations.",
    sortOrder: 1,
  },
  {
    id: "testimonial-aisha-mwangi",
    type: "testimonial",
    name: "Aisha Mwangi",
    description: "Programme Director, East Africa Development Trust",
    quote:
      "Africom's consultation team helped our cooperatives strengthen governance and reach new markets. Their field experience is second to none.",
    sortOrder: 2,
  },
  {
    id: "testimonial-james-okoro",
    type: "testimonial",
    name: "James Okoro",
    description: "Head of Sourcing, Continental Spice Co.",
    quote:
      "Consistent quality and reliable logistics on every shipment. Africom has become our trusted partner for Tanzanian chili and spices.",
    sortOrder: 3,
  },
];
