import catKaram from "@/assets/cat-karam.jpg";
import catPickle from "@/assets/cat-pickle.jpg";
import catPowder from "@/assets/cat-powder.jpg";

export type Category = "karam" | "pickles" | "powders";

export type Product = {
  name: string;
  /** Telugu name, so the search box matches how customers actually say it. */
  te: string;
  blurb: string;
  /** Prices in [1kg, 500g, 250g] order — matches the original catalogue sheet. */
  prices: [string, string, string];
  image: string;
  category: Category;
  tag?: string;
  /**
   * Real customer rating, e.g. { stars: 4.8, reviews: 120 }.
   * Left undefined until Kopuri Foods has figures to stand behind — a card
   * with no rating simply omits the row.
   */
  rating?: { stars: number; reviews: number };
};

export type Variant = {
  size: string;
  price: string;
  /** Numeric rupee value, used for cart totals only. */
  amount: number;
  /** Pack weight in kg, used to work out delivery charges. */
  kg: number;
};

/** Smallest pack first, the way customers scan a shelf. */
export const SIZE_ORDER = ["250g", "500g", "1kg"] as const;
const SIZE_KG: Record<string, number> = { "250g": 0.25, "500g": 0.5, "1kg": 1 };

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "karam", label: "Karam" },
  { id: "pickles", label: "Pickles" },
  { id: "powders", label: "Powders" },
];

export function toNumber(price: string): number {
  return Number(price.replace(/[^\d.]/g, "")) || 0;
}

export function sizeToKg(size: string): number {
  return SIZE_KG[size] ?? 0;
}

export function variantsOf(product: Product): Variant[] {
  return SIZE_ORDER.map((size, i) => {
    const price = product.prices[2 - i]!;
    return { size, price, amount: toNumber(price), kg: SIZE_KG[size]! };
  });
}

/** The lowest-priced pack, shown as the "Starting from" price. */
export function startingPrice(product: Product): string {
  return product.prices[2];
}

export const karam: Product[] = [
  {
    name: "Byadgi (Less Spicy) Karam",
    te: "బ్యాడిగి కారం",
    blurb: "Deep colour, gentle heat — ground from premium Byadgi chillies.",
    prices: ["₹650", "₹325", "₹180"],
    image: catKaram,
    category: "karam",
    tag: "Bestseller",
  },
  {
    name: "Plain / Pachadi Karam",
    te: "పచ్చడి కారం",
    blurb: "The everyday Andhra staple for chutneys and pachadis.",
    prices: ["₹450", "₹225", "₹120"],
    image: catKaram,
    category: "karam",
  },
  {
    name: "Masala / Kura / Sambar Karam",
    te: "కూర / సాంబార్ కారం",
    blurb: "A balanced masala blend for curries and sambar.",
    prices: ["₹420", "₹220", "₹150"],
    image: catPowder,
    category: "karam",
  },
  {
    name: "Velulli Karam",
    te: "వెల్లుల్లి కారం",
    blurb: "Garlic-forward karam, roasted and stone ground.",
    prices: ["₹470", "₹260", "₹150"],
    image: catKaram,
    category: "karam",
  },
  {
    name: "Tiffin / Idly Karam",
    te: "ఇడ్లీ / టిఫిన్ కారం",
    blurb: "Made for idly, dosa and pesarattu mornings.",
    prices: ["₹490", "₹280", "₹150"],
    image: catPowder,
    category: "karam",
  },
  {
    name: "Munagaku Karam",
    te: "మునగాకు కారం",
    blurb: "Drumstick leaves sun-dried and blended with chilli.",
    prices: ["₹600", "₹300", "₹150"],
    image: catPowder,
    category: "karam",
  },
  {
    name: "Karivepaku Karam",
    te: "కరివేపాకు కారం",
    blurb: "Fragrant curry leaf podi with a slow, lingering heat.",
    prices: ["₹600", "₹300", "₹170"],
    image: catPowder,
    category: "karam",
  },
  {
    name: "Kobbari Karam",
    te: "కొబ్బరి కారం",
    blurb: "Fresh coconut roasted with chilli and garlic.",
    prices: ["₹580", "₹300", "₹160"],
    image: catKaram,
    category: "karam",
  },
  {
    name: "Pappula Podi",
    te: "పప్పుల పొడి",
    blurb: "Roasted gram podi — comfort food in a spoon.",
    prices: ["₹580", "₹300", "₹160"],
    image: catPowder,
    category: "karam",
  },
];

export const pickles: Product[] = [
  {
    name: "Chicken Pickle",
    te: "చికెన్ పచ్చడి",
    blurb: "Boneless chicken slow-cooked in sesame oil and spice.",
    prices: ["₹800", "₹400", "₹200"],
    image: catPickle,
    category: "pickles",
    tag: "Bestseller",
  },
  {
    name: "Gongura Chicken Pickle",
    te: "గోంగూర చికెన్ పచ్చడి",
    blurb: "Tangy gongura leaves folded through tender chicken.",
    prices: ["₹1000", "₹500", "₹250"],
    image: catPickle,
    category: "pickles",
  },
  {
    name: "Mutton Pickle",
    te: "మటన్ పచ్చడి",
    blurb: "Rich, dark and deeply spiced country mutton.",
    prices: ["₹1600", "₹800", "₹400"],
    image: catPickle,
    category: "pickles",
  },
  {
    name: "Gongura Mutton Pickle",
    te: "గోంగూర మటన్ పచ్చడి",
    blurb: "The Andhra classic — sour, fiery and unforgettable.",
    prices: ["₹1800", "₹900", "₹450"],
    image: catPickle,
    category: "pickles",
    tag: "Premium",
  },
  {
    name: "Prawn Pickle",
    te: "రొయ్యల పచ్చడి",
    blurb: "Coastal prawns cured with garlic and red chilli.",
    prices: ["₹1200", "₹600", "₹300"],
    image: catPickle,
    category: "pickles",
  },
];

export const powders: Product[] = [
  {
    name: "Pasupu (Turmeric)",
    te: "పసుపు",
    blurb: "Single-origin turmeric, bright and earthy.",
    prices: ["₹380", "₹190", "₹100"],
    image: catPowder,
    category: "powders",
  },
  {
    name: "Dhaniya Powder",
    te: "ధనియాల పొడి",
    blurb: "Coriander seeds roasted fresh before grinding.",
    prices: ["₹400", "₹200", "₹100"],
    image: catPowder,
    category: "powders",
  },
  {
    name: "Sambar Powder",
    te: "సాంబార్ పొడి",
    blurb: "A traditional house blend, no fillers.",
    prices: ["₹650", "₹325", "₹200"],
    image: catPowder,
    category: "powders",
    tag: "Natural Blend",
  },
  {
    name: "Rasam Powder",
    te: "రసం పొడి",
    blurb: "Peppery and aromatic, for a perfect rasam.",
    prices: ["₹600", "₹320", "₹200"],
    image: catPowder,
    category: "powders",
  },
];

export const allProducts: Product[] = [...karam, ...pickles, ...powders];

/** Matches English name, Telugu name, blurb or category — partial words included. */
export function searchProducts(items: Product[], query: string): Product[] {
  const term = query.trim().toLowerCase();
  if (!term) return items;
  return items.filter((p) =>
    [p.name, p.te, p.blurb, p.category].some((field) => field.toLowerCase().includes(term)),
  );
}
