export interface SocialLink {
  platform: "linkedin" | "twitter" | "facebook" | "instagram" | "youtube";
  url: string;
}

export interface CompanyProfile {
  name: string;
  legalName: string;
  tagline: string;
  mission: string;
  description: string;
  usRegistrationStatus: string;
  foundedYear: number;
  headquartersAddress: string;
  operatingCountry: string;
  regionalMarkets: string[];
  internationalMarkets: string[];
  contactEmail: string;
  contactPhone?: string;
  socialLinks: SocialLink[];
}

export const company: CompanyProfile = {
  name: "Africom",
  legalName: "Africom LLC",
  tagline:
    "Connecting Tanzania's finest agricultural products to regional and international markets.",
  mission:
    "To bridge the gap between Tanzanian agricultural producers and global markets by providing reliable export services and expert development consultation across the agricultural value chain.",
  description:
    "Africom is a US-registered commercial business with deep operational roots in Tanzania. We specialize in the exportation of high-quality agricultural products — from premium cashew nuts to fresh produce — to buyers across East Africa, the Middle East, Europe, and beyond. Alongside our export operations, we provide strategic consultation services to NGOs, donors, and implementation partners working on agricultural development projects across the value chain.",
  usRegistrationStatus: "Registered in the United States of America",
  foundedYear: 2018,
  headquartersAddress: "United States of America",
  operatingCountry: "Tanzania",
  regionalMarkets: ["East Africa", "Southern Africa", "West Africa"],
  internationalMarkets: ["Europe", "Middle East", "North America", "Asia"],
  contactEmail: "info@africom-exports.com",
  socialLinks: [],
};
