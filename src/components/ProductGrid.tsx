import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Star, ShoppingBag, Check, Search, ArrowLeft, Home } from "lucide-react";
import { Flavor } from "../types";
import { FLAVORS } from "../data";
import FlavorComparison from "./FlavorComparison";

const INGREDIENTS_MAP: Record<string, Array<{ name: string; icon: string; desc: string }>> = {
  chocolate: [
    { name: "Belgian Cocoa", icon: "🍫", desc: "Premium dark cacao" },
    { name: "Fresh Milk", icon: "🥛", desc: "100% organic pasture-fed" },
    { name: "Heavy Cream", icon: "🧈", desc: "Rich sweet-cream base" },
    { name: "Fudge Swirl", icon: "🍯", desc: "House-made molten syrup" },
  ],
  strawberry: [
    { name: "Organic Berries", icon: "🍓", desc: "Sun-ripened organic fruit" },
    { name: "Grass-Fed Milk", icon: "🥛", desc: "Creamy whole milk" },
    { name: "Vanilla Bean", icon: "🌸", desc: "Madagascar vanilla extract" },
    { name: "Sweet Cream", icon: "🧈", desc: "Double-churned body" },
  ],
  mint: [
    { name: "Garden Mint", icon: "🍃", desc: "Cool botanic oil infusion" },
    { name: "Choco Chips", icon: "🍫", desc: "Pure dark chocolate flakes" },
    { name: "Pasture Cream", icon: "🧈", desc: "Velvety butterfat base" },
    { name: "Organic Cane", icon: "🍬", desc: "Unrefined raw sweetness" },
  ],
  blueberry: [
    { name: "Wild Blueberries", icon: "🫐", desc: "Antioxidant-rich berries" },
    { name: "Lavender Sprigs", icon: "🌿", desc: "Calming floral notes" },
    { name: "Velvet Cream", icon: "🧈", desc: "Ultra-whipped heavy milk" },
    { name: "Vanilla Extract", icon: "✨", desc: "Pure flavor enhancer" },
  ],
  mango: [
    { name: "Alfonso Mango", icon: "🥭", desc: "Direct from tropical orchards" },
    { name: "Organic Honey", icon: "🍯", desc: "Natural amber nectar sweetener" },
    { name: "Sweet Cream", icon: "🧈", desc: "Rich and fluffy milk base" },
    { name: "Citrus Zest", icon: "🍊", desc: "A pinch of brightness" },
  ],
};

interface ProductGridProps {
  onAddProduct: (flavor: Flavor, event?: React.MouseEvent) => void;
  onSelectFlavor: (id: string) => void;
  selectedFlavorId: string;
  onNavigate?: (page: string) => void;
}

export default function ProductGrid({
  onAddProduct,
  onSelectFlavor,
  selectedFlavorId,
  onNavigate,
}: ProductGridProps) {
  const [successId, setSuccessId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const handleAdd = (flavor: Flavor, event?: React.MouseEvent) => {
    onAddProduct(flavor, event);
    setSuccessId(flavor.id);
    setTimeout(() => {
      setSuccessId(null);
    }, 1500);
  };

  // Extract categories dynamically or define static ones
  const categories = ["All", "Fruity", "Chocolate", "Nutty", "Vanilla"];

  const filteredFlavors = useMemo(() => {
    return FLAVORS.filter((flavor) => {
      const matchesSearch = flavor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flavor.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = true;
      if (activeCategory !== "All") {
        if (activeCategory === "Chocolate") {
          matchesCategory = flavor.id.includes("chocolate") || flavor.name.toLowerCase().includes("cocoa") || flavor.name.toLowerCase().includes("chocolate");
        } else if (activeCategory === "Fruity") {
          matchesCategory = flavor.id.includes("mango") || flavor.id.includes("berry") || flavor.id.includes("strawberry") || flavor.name.toLowerCase().includes("berry") || flavor.name.toLowerCase().includes("mango");
        } else if (activeCategory === "Nutty") {
          matchesCategory = flavor.id.includes("pistachio") || flavor.name.toLowerCase().includes("pistachio") || flavor.name.toLowerCase().includes("nut");
        } else if (activeCategory === "Vanilla") {
          matchesCategory = flavor.id.includes("vanilla") || flavor.name.toLowerCase().includes("vanilla") || flavor.id.includes("cookie") || flavor.name.toLowerCase().includes("cookie");
        }
      }
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <section id="menu" className="py-24 bg-neutral-900 text-white relative overflow-hidden min-h-screen">
      {/* Absolute ambient blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Back navigation button if onNavigate is provided */}
        {onNavigate && (
          <motion.button
            id="menu-back-home"
            onClick={() => onNavigate("home")}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all text-xs font-mono font-bold border border-white/10 cursor-pointer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Main Stage</span>
          </motion.button>
        )}

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.span
            className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/25"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Signature Series
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-display font-black tracking-tight mt-4 mb-5 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Explore Our Delicious Taste
          </motion.h2>
          <motion.p
            className="text-neutral-400 text-sm md:text-base leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Indulge in our exquisite flavor palette. Click on a flavor to switch the main stage preview, or add them straight to your basket.
          </motion.p>
        </div>

        {/* Search & Categories Bar */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-950/40 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
          {/* Categories Tab Selector */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-amber-500 text-black shadow-md shadow-amber-500/20 scale-105"
                      : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search bar input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search flavours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredFlavors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-20">
            {filteredFlavors.map((flavor, index) => {
              const isSelected = selectedFlavorId === flavor.id;
              const isAdded = successId === flavor.id;

              return (
                <motion.div
                  key={flavor.id}
                  className={`relative group rounded-3xl p-5 border transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "bg-neutral-800 border-amber-500 shadow-2xl shadow-amber-500/10"
                      : "bg-neutral-950/50 border-white/10 hover:border-white/20 hover:bg-neutral-900"
                  }`}
                  onClick={() => onSelectFlavor(flavor.id)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  {/* Floating Selection Indicator */}
                  {isSelected && (
                    <span className="absolute top-4 right-4 bg-amber-500 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wide">
                      Active Preview
                    </span>
                  )}

                  {/* Cup Image with rotatable zoom effect */}
                  <div className="relative aspect-square w-full mb-5 flex items-center justify-center rounded-2xl bg-black/40 overflow-hidden p-3 group-hover:bg-black/20 transition-colors">
                    <motion.img
                      src={flavor.image}
                      alt={flavor.name}
                      className="w-36 h-36 object-contain drop-shadow-xl group-hover:scale-105 group-hover:opacity-10 transition-all duration-300"
                      whileHover={{ scale: 1.15, rotate: 15 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      referrerPolicy="no-referrer"
                    />

                    {/* Ingredients Hover Overlay & Tooltips */}
                    <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-3 space-y-1.5 select-none z-10">
                      <div className="text-[10px] uppercase tracking-wider text-amber-400 font-mono font-bold mb-1 border-b border-white/10 pb-1 text-center">
                        ✨ Pure Ingredients
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {(INGREDIENTS_MAP[flavor.id] || []).map((ing, i) => (
                          <motion.div
                            key={ing.name}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false }}
                            transition={{ delay: i * 0.04 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/5 border border-white/10 hover:border-amber-400/30 rounded-xl p-1.5 flex flex-col items-center justify-center text-center relative group/ing transition-all"
                          >
                            <span className="text-base mb-0.5" role="img" aria-label={ing.name}>{ing.icon}</span>
                            <span className="text-[9px] text-white font-bold leading-tight line-clamp-1">{ing.name}</span>
                            
                            {/* Micro-Tooltip for each ingredient */}
                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black/95 text-[9px] text-amber-300 px-2 py-1 rounded-lg border border-white/15 opacity-0 pointer-events-none group-hover/ing:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-xl z-20 font-sans">
                              {ing.desc}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Content info */}
                  <div>
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </div>
                      <span className="text-xs font-bold text-neutral-300">{flavor.rating}</span>
                      <span className="text-[10px] text-neutral-500">({flavor.reviewCount})</span>
                    </div>

                    {/* Title & Price */}
                    <h4 className="font-display font-extrabold text-base tracking-tight mb-1 text-white group-hover:text-amber-400 transition-colors">
                      {flavor.name}
                    </h4>
                    <p className="font-mono text-xs text-neutral-400 mb-4 line-clamp-2">
                      {flavor.description}
                    </p>
                  </div>

                  {/* Pricing & Add to Cart */}
                  <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-white/5">
                    <span className="font-display font-black text-lg text-amber-500">{flavor.price}</span>

                    <button
                      id={`product-order-${flavor.id}`}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent flavor selection trigger
                        handleAdd(flavor, e);
                      }}
                      className={`h-9 px-3 rounded-full font-display text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAdded
                          ? "bg-emerald-500 text-black font-black"
                          : "bg-white text-black hover:bg-neutral-200"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-950/30 rounded-3xl border border-white/5 mb-16">
            <span className="text-4xl block mb-4">🍧</span>
            <h4 className="text-lg font-bold text-neutral-300">No flavours found</h4>
            <p className="text-xs text-neutral-500 mt-1">Try adjusting your category or search query.</p>
          </div>
        )}

        {/* INTERACTIVE FLAVOR COMPARISON FACT SHEET */}
        <div className="mb-16">
          <FlavorComparison activeFlavorId={selectedFlavorId} />
        </div>

        {/* Summer Scoop Banner Quote */}
        <motion.div
          className="bg-amber-500 text-black rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Subtle design accents */}
          <div className="absolute top-0 right-0 text-7xl translate-x-4 -translate-y-4 opacity-15 select-none pointer-events-none">
            🍦
          </div>

          <div className="max-w-2xl text-center md:text-left">
            <h3 className="font-display font-black text-2xl md:text-3xl tracking-tight mb-2">
              Moments of Joy, Scooped Fresh
            </h3>
            <p className="text-sm font-semibold text-neutral-900/80 leading-relaxed max-w-xl">
              "We believe in capturing the joy of summer in every scoop - crafted with organic real cream, bold pure fruit puree, and a whole lot of happiness."
            </p>
          </div>

          <motion.a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#hero")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 bg-black hover:bg-neutral-950 text-amber-500 font-display font-extrabold text-xs uppercase tracking-wider rounded-full shrink-0 transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            Experience Main Stage ⚡
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
