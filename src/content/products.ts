export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  originRegion: string;
  keyCharacteristics: string[];
  targetMarkets: string[];
  image?: string;
  sortOrder: number;
}

export const products: ProductCategory[] = [
  {
    id: "avocado",
    name: "Avocado",
    description:
      "Tanzania produces high-quality Hass and Fuerte avocados grown in the highland regions. Africom International Ltd sources fresh avocados directly from Tanzanian farmers and supplies regional and international buyers with consistent, export-grade fruit.",
    originRegion: "Tanzania",
    keyCharacteristics: [
      "Hass and Fuerte varieties available",
      "Harvested at optimal maturity for export",
      "Consistent sizing and grading",
      "Suitable for long-haul shipping",
      "Sourced directly from Tanzanian farms",
    ],
    targetMarkets: ["Europe", "Middle East", "East Africa"],
    image: "/images/products/avocado.jpg",
    sortOrder: 1,
  },
  {
    id: "green-bean",
    name: "Green Bean",
    description:
      "Tanzanian green beans are prized for their crisp texture and vibrant colour. Africom International Ltd supplies fresh green beans meeting international food safety and quality standards for retail and food service buyers.",
    originRegion: "Tanzania",
    keyCharacteristics: [
      "Fine bean and bobby bean varieties",
      "Harvested and packed for air and sea freight",
      "Meets EU and Middle East import standards",
      "Available year-round through coordinated farm sourcing",
      "Pre-cooled and vacuum-packed on request",
    ],
    targetMarkets: ["Europe", "Middle East", "East Africa"],
    image: "/images/products/green-bean.jpg",
    sortOrder: 2,
  },
  {
    id: "ginger",
    name: "Ginger",
    description:
      "Tanzanian ginger is known for its strong aroma and high oleoresin content, making it highly sought after by spice processors, food manufacturers, and buyers in the health and wellness sector.",
    originRegion: "Tanzania",
    keyCharacteristics: [
      "Fresh and dried ginger available",
      "High oleoresin and essential oil content",
      "Cleaned, graded, and packed in jute or polypropylene bags",
      "Moisture content < 10% for dried grades",
      "Available in bulk and retail packs",
    ],
    targetMarkets: ["Asia", "Middle East", "Europe"],
    image: "/images/products/ginger.jpg",
    sortOrder: 3,
  },
  {
    id: "garlic",
    name: "Garlic",
    description:
      "Africom International Ltd exports quality Tanzanian garlic with a pungent flavour profile favoured by food processors and direct consumers across the Middle East, Asia, and Europe.",
    originRegion: "Tanzania",
    keyCharacteristics: [
      "White and purple skin varieties",
      "Cured and dried for extended shelf life",
      "Packed in mesh bags (5–20 kg) and bulk sacks",
      "Consistent bulb size and dry matter content",
      "Sorted and graded to buyer specifications",
    ],
    targetMarkets: ["Middle East", "Asia", "Europe"],
    image: "/images/products/garlic.jpg",
    sortOrder: 4,
  },
  {
    id: "capsicum",
    name: "Capsicum",
    description:
      "From sweet bell peppers to hot chilli varieties, Africom International Ltd supplies fresh and dried Tanzanian capsicum to regional markets and international spice buyers, offering flexibility in heat level, variety, and pack format.",
    originRegion: "Tanzania",
    keyCharacteristics: [
      "Sweet bell pepper and hot chilli varieties",
      "Fresh and dried (whole, crushed, powder) options",
      "Bright colour and consistent heat level",
      "Packed to buyer specification — bulk or cartons",
      "Available year-round with coordinated farm scheduling",
    ],
    targetMarkets: ["Europe", "Middle East", "East Africa"],
    image: "/images/products/capsicum.jpg",
    sortOrder: 5,
  },
];
