import { Flavor, FAQItem, Review } from './types';

export const MASCOT_IMAGE = "/src/assets/images/creamsy_mascot_1783828739900.jpg";

export const FLAVORS: Flavor[] = [
  {
    id: "chocolate",
    name: "Chocolate Bliss",
    displayName: "Chocolate Bliss",
    price: "$6.49",
    rating: 4.9,
    reviewCount: 4210,
    description: "Our hallmark recipe. Rich Belgian chocolate cream churned with a molten fudge ribbon and crispy premium cocoa shavings.",
    bgColor: "#BF360C", // Vibrant reddish orange/rust background
    themeClass: "text-[#BF360C] bg-[#BF360C]/10 border-[#BF360C]/20",
    image: "/src/assets/images/chocolate_cup_1783828757855.jpg",
    floatingEmojis: ["🍫", "🥛", "🌟", "🍫", "❄️"],
    accentColor: "bg-[#FF5722] hover:bg-[#E64A19] text-white focus:ring-[#FF5722]"
  },
  {
    id: "strawberry",
    name: "Strawberry Dream",
    displayName: "Strawberry Dream",
    price: "$5.99",
    rating: 4.8,
    reviewCount: 3120,
    description: "Gourmet sun-ripened strawberry puree folded into fresh heavy cream with delicate bits of handpicked organic strawberry pieces.",
    bgColor: "#EC407A", // Pink background
    themeClass: "text-[#EC407A] bg-[#EC407A]/10 border-[#EC407A]/20",
    image: "/src/assets/images/strawberry_cup_1783828772764.jpg",
    floatingEmojis: ["🍓", "🌸", "✨", "🍓", "🧁"],
    accentColor: "bg-[#E91E63] hover:bg-[#C2185B] text-white focus:ring-[#E91E63]"
  },
  {
    id: "mint",
    name: "Mint Choco",
    displayName: "Mint Choco",
    price: "$6.29",
    rating: 4.8,
    reviewCount: 2890,
    description: "Invigorating cool garden mint whipped with organic sweet cream and heavily studded with high-quality dark chocolate chips.",
    bgColor: "#00897B", // Deep teal mint green
    themeClass: "text-[#00897B] bg-[#00897B]/10 border-[#00897B]/20",
    image: "/src/assets/images/mint_cup_1783828788409.jpg",
    floatingEmojis: ["🍃", "🍫", "🌱", "✨", "❄️"],
    accentColor: "bg-[#009688] hover:bg-[#00796B] text-white focus:ring-[#009688]"
  },
  {
    id: "blueberry",
    name: "Blueberry Velvet",
    displayName: "Blueberry Velvet",
    price: "$6.99",
    rating: 4.9,
    reviewCount: 1980,
    description: "An elegant infusion of organic wild blueberries and subtle notes of calming French lavender, resulting in a smooth, velvety purple scoop.",
    bgColor: "#5E35B1", // Purple background
    themeClass: "text-[#5E35B1] bg-[#5E35B1]/10 border-[#5E35B1]/20",
    image: "/src/assets/images/blueberry_cup_1783828804172.jpg",
    floatingEmojis: ["🫐", "🍇", "💜", "✨", "🌿"],
    accentColor: "bg-[#673AB7] hover:bg-[#512DA8] text-white focus:ring-[#673AB7]"
  },
  {
    id: "mango",
    name: "Mango Delight",
    displayName: "Mango Delight",
    price: "$6.79",
    rating: 4.7,
    reviewCount: 2450,
    description: "Sun-drenched, ripe Alfonso mango pulp blended into a smooth and refreshing golden cream, offering an intense taste of sweet summer joy.",
    bgColor: "#FB8C00", // Warm yellow orange
    themeClass: "text-[#FB8C00] bg-[#FB8C00]/10 border-[#FB8C00]/20",
    image: "/src/assets/images/mango_cup_1783828821164.jpg",
    floatingEmojis: ["🥭", "🍊", "☀️", "🥭", "💛"],
    accentColor: "bg-[#FF9800] hover:bg-[#F57C00] text-white focus:ring-[#FF9800]"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "What ingredients go into Creamsy cups?",
    answer: "We use 100% grass-fed organic sweet cream, pure cane sugar, and high-quality natural ingredients sourced directly from local partner farms. No artificial preservatives or corn syrups are ever allowed in our kitchen."
  },
  {
    question: "How fast is delivery?",
    answer: "Our ultra-insulated dispatch vehicles deliver within 30-45 minutes in active zones. Your ice cream is shipped in custom thermal containers chilled with dry-ice pellets to ensure it arrives perfectly frozen."
  },
  {
    question: "Do you have dairy-free options?",
    answer: "Yes, we certainly do! We offer a dedicated selection of plant-based cups crafted with certified gluten-free oat milk and rich organic coconut cream so everyone can experience the joy."
  },
  {
    question: "How should I store my ice cream?",
    answer: "For the absolute best texture and flavor preservation, keep your cups in the coldest part of your freezer at -18°C (0°F) or below. Before digging in, let it sit on the counter for 1 minute for a velvet scoop."
  },
  {
    question: "Can I order for events or parties?",
    answer: "Absolutely! We offer customized catering for birthdays, corporate functions, weddings, and celebrations. Our packages include mini-cups, custom flavor banners, and interactive presentation carts."
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev1",
    name: "Rahul K.",
    role: "Verified Sweet Tooth",
    text: "Best chocolate scoop I've ever had! Hands down. The fudge ribbon is amazingly thick and rich. Definitely ordering again!",
    rating: 5
  },
  {
    id: "rev2",
    name: "Liza S.",
    role: "Daily Craver",
    text: "Creamy, dreamy, and always fresh. My absolute go-to treat on a hot afternoon. The mint chocolate chip is refreshingly real.",
    rating: 5
  },
  {
    id: "rev3",
    name: "Emily P.",
    role: "Ice Cream Mom",
    text: "My kids go absolutely crazy for the Creamsy blueberry lavender flavor! It is unique, gorgeous, and not overly sweet.",
    rating: 5
  }
];

export const MOMENTS = [
  {
    id: "m1",
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=500",
    tags: ["#SummerVibe", "#CreamsyLover"],
    color: "from-pink-400 to-rose-400"
  },
  {
    id: "m2",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500",
    tags: ["#BerryDream", "#YummyInMyTummy"],
    color: "from-purple-400 to-indigo-400"
  },
  {
    id: "m3",
    imageUrl: "https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&q=80&w=500",
    tags: ["#FamilySpoons", "#IceCreamJoy"],
    color: "from-emerald-400 to-teal-400"
  },
  {
    id: "m4",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500",
    tags: ["#DoubleScoop", "#WeekendIndulgence"],
    color: "from-amber-400 to-orange-400"
  }
];
