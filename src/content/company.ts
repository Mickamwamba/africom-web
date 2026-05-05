export interface SocialLink {
  platform: "linkedin" | "twitter" | "facebook" | "instagram" | "youtube";
  url: string;
}

export interface OfficeAddress {
  label: string;
  address: string;
  country: string;
}

export interface CompanyProfile {
  name: string;
  legalName: string;
  tagline: string;
  mission: string;
  vision?: string;
  coreValues?: string[];
  description: string;
  usRegistrationStatus: string;
  foundedYear: number;
  headquartersAddress: string;
  offices?: OfficeAddress[];
  operatingCountry: string;
  regionalMarkets: string[];
  internationalMarkets: string[];
  contactEmail: string;
  contactPhone?: string;
  phones?: string[];
  socialLinks: SocialLink[];
}

export const company: CompanyProfile = {
  name: "Africom",
  legalName: "Africom International Ltd",
  tagline: "From Farm to Global Markets",
  mission:
    "To provide integrated agricultural solutions from production and processing to consultation and trade empowering farmers, advancing technology, and promoting sustainability through every stage of the value chain.",
  vision:
    "To be a leading hub for sustainable agricultural innovation, connecting people, ideas, and resources to build resilient food systems and prosperous communities across Africa and beyond.",
  coreValues: [
    "Sustainability",
    "Innovation",
    "Integrity",
    "Empowerment",
    "Quality",
    "Community",
    "Collaboration",
    "Respect for Nature",
  ],
  description:
    "Africom International Ltd is a Tanzania-based agribusiness enterprise providing integrated agricultural solutions — from production and processing to trade and consultation. We export premium horticultural produce sourced from Tanzanian farmers to regional and international markets, and provide strategic agribusiness consultation to farmers' organisations, cooperatives, NGOs, and development partners. Our offices in Dar es Salaam, Tanzania and Lakewood, Washington (USA) support operations across Africa and beyond.",
  usRegistrationStatus: "Tanzania-based enterprise with offices in Tanzania and USA",
  foundedYear: 2018,
  headquartersAddress: "16103 Riverside St, Dar es Salaam, Tanzania",
  offices: [
    {
      label: "Tanzania Office",
      address: "16103 Riverside St, Dar es Salaam, Tanzania",
      country: "Tanzania",
    },
    {
      label: "USA Office",
      address: "8064 83rd Ave Sw Unit H01, Lakewood, WA 98498, USA",
      country: "USA",
    },
  ],
  operatingCountry: "Tanzania",
  regionalMarkets: ["East Africa", "Southern Africa", "West Africa"],
  internationalMarkets: ["Europe", "Middle East", "North America", "Asia"],
  contactEmail: "info@africom.biz",
  contactPhone: "+255-758-208-673",
  phones: ["+255-758-208-673", "+1 904-477-9924"],
  socialLinks: [],
};
