export interface Flavor {
  id: string;
  name: string;
  displayName: string;
  price: string;
  rating: number;
  reviewCount: number;
  description: string;
  bgColor: string; // Tailwind hex background code (e.g. #D35400)
  themeClass: string; // for tailwind text colors, etc.
  image: string;
  floatingEmojis: string[]; // floating decorations
  accentColor: string; // button accent colors
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface CartItem {
  flavorId: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}
