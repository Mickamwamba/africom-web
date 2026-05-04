export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  originRegion: string;
  keyCharacteristics: string[];
  targetMarkets: string[];
  imageUrl?: string;
  sortOrder: number;
}

export const products: ProductCategory[] = [
  {
    id: "cashew-nuts",
    name: "Cashew Nuts",
    description:
      "Tanzania is one of the world's top cashew producers. Africom sources raw and processed cashews from the coastal belt regions, offering W180, W210, W240, and W320 grades to international buyers.",
    originRegion: "Coastal Belt — Lindi, Mtwara, Pwani",
    keyCharacteristics: [
      "Available in raw (RCN) and processed grades",
      "W180, W210, W240, W320 whole white kernels",
      "Packed in 25 kg vacuum-sealed bags",
      "Certified aflatoxin-screened",
      "Harvested January – June season",
    ],
    targetMarkets: ["Europe", "Middle East", "India", "East Asia"],
    sortOrder: 1,
  },
  {
    id: "sesame-seeds",
    name: "Sesame Seeds",
    description:
      "Tanzanian sesame (simsim) is prized for its high oil content and clean flavour profile. Africom supplies hulled and natural sesame to food processors and confectionery manufacturers worldwide.",
    originRegion: "Central & Western Tanzania — Tabora, Singida, Dodoma",
    keyCharacteristics: [
      "Natural (unhulled) and hulled grades available",
      "Oil content 50–55%",
      "Packed in 50 kg polypropylene bags",
      "Moisture < 6%",
      "Harvested July – October season",
    ],
    targetMarkets: ["Japan", "China", "Middle East", "Europe"],
    sortOrder: 2,
  },
  {
    id: "coffee",
    name: "Arabica & Robusta Coffee",
    description:
      "Tanzania's high-altitude coffee from Kilimanjaro and Mbeya regions commands premium prices. Africom exports green beans for specialty roasters and commodity buyers.",
    originRegion: "Kilimanjaro, Arusha, Mbeya, Ruvuma",
    keyCharacteristics: [
      "Arabica: AA, AB, C grades",
      "Screen 18+ for premium lots",
      "Washed and natural processing available",
      "Cupping scores 80+ for specialty lots",
      "Packed in 60 kg GrainPro-lined jute bags",
    ],
    targetMarkets: ["Europe", "North America", "Japan", "Australia"],
    sortOrder: 3,
  },
  {
    id: "pulses",
    name: "Pulses & Legumes",
    description:
      "Africom supplies a range of Tanzanian pulses — including red kidney beans, black-eyed peas, and pigeon peas — to food aid programmes, commercial buyers, and regional markets.",
    originRegion: "Lake Zone — Kagera, Mwanza; Southern Highlands",
    keyCharacteristics: [
      "Red kidney beans, black-eyed peas, pigeon peas",
      "Sortex-cleaned and colour-graded",
      "Packed in 50 kg and 25 kg bags",
      "Low defect rates (<1%)",
      "Available for bulk and container shipments",
    ],
    targetMarkets: ["East Africa", "Europe", "Middle East", "Food Aid Programmes"],
    sortOrder: 4,
  },
];
