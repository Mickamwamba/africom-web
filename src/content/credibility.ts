export type IndicatorType = "partner-logo" | "certification" | "project-highlight";

export interface CredibilityIndicator {
  id: string;
  type: IndicatorType;
  name: string;
  description?: string;
  imageUrl?: string;
  year?: number;
  sortOrder: number;
}

// Populate only when Africom supplies logos, certifications, or project highlights.
// Leave empty to omit the CredibilitySection from all pages.
export const credibilityIndicators: CredibilityIndicator[] = [];
