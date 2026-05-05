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
    id: "stat-agribusiness-initiatives",
    type: "stat",
    name: "5 Innovative Agribusiness Initiatives",
    description: "Programmes driving sustainable growth across the agricultural value chain",
    sortOrder: 1,
  },
  {
    id: "testimonial-oliver-hartman",
    type: "testimonial",
    name: "Oliver Hartman",
    quote:
      "Outstanding service and deep knowledge of the agricultural value chain — Africom delivered beyond our expectations.",
    sortOrder: 2,
  },
];
