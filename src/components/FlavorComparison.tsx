import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FLAVORS } from "../data";
import { Flavor } from "../types";
import { Scale, Sparkles, Check, AlertTriangle, HelpCircle } from "lucide-react";

interface NutritionData {
  calories: number; // kcal
  sugar: number; // g
  fat: number; // g
  protein: number; // g
  dietaryTags: string[];
  keyIngredients: string[];
  allergens: string[];
  joyScore: number; // 1-100 scale of happiness index
  flavorProfile: string; // descriptive words
}

// Complete rich nutritional data for our curated menu flavors
const FLAVOR_NUTRITION: Record<string, NutritionData> = {
  chocolate: {
    calories: 210,
    sugar: 18,
    fat: 14,
    protein: 4.5,
    dietaryTags: ["Organic", "Gluten-Free", "High Calcium"],
    keyIngredients: ["Belgian cocoa mass", "Grass-fed sweet cream", "Molten fudge ripple", "Vanilla bean paste"],
    allergens: ["Milk/Lactose"],
    joyScore: 98,
    flavorProfile: "Rich, ultra-chocolatey, velvety fudgy textures"
  },
  strawberry: {
    calories: 175,
    sugar: 14,
    fat: 11,
    protein: 3.2,
    dietaryTags: ["100% Real Fruit", "Gluten-Free", "Low Sodium", "Organic Fruits"],
    keyIngredients: ["Organic Albion strawberries", "Heavy sweet cream", "Raw organic honey", "Lemon juice zest"],
    allergens: ["Milk/Lactose"],
    joyScore: 95,
    flavorProfile: "Tart, fruity, refreshing summer berries"
  },
  mint: {
    calories: 195,
    sugar: 15,
    fat: 13,
    protein: 3.8,
    dietaryTags: ["Fresh Herbs", "Gluten-Free", "All-Natural Mint"],
    keyIngredients: ["Garden-grown mint leaves extract", "Grass-fed dairy cream", "60% dark chocolate chunks", "Organic cane sugar"],
    allergens: ["Milk/Lactose", "Soy lecithin (in chocolate chips)"],
    joyScore: 96,
    flavorProfile: "Cooling, refreshingly herbal, crunchy chip accents"
  },
  blueberry: {
    calories: 180,
    sugar: 13,
    fat: 11.5,
    protein: 3.5,
    dietaryTags: ["Superfood Infusion", "Gluten-Free", "Organic Botanicals"],
    keyIngredients: ["Wild organic blueberries", "Culinary French lavender infusion", "Heavy organic cream", "Pure maple drizzle"],
    allergens: ["Milk/Lactose"],
    joyScore: 94,
    flavorProfile: "Calming floral undertones, aromatic wild berry burst"
  },
  mango: {
    calories: 165,
    sugar: 12,
    fat: 9.5,
    protein: 3.0,
    dietaryTags: ["Tropical Fruit", "Gluten-Free", "Lower Calorie", "Dairy-Free Optional friendly"],
    keyIngredients: ["Alfonso mango pulp", "Organic light cream", "Coconut water nectar", "Lime juice squeeze"],
    allergens: ["Milk/Lactose (cream base)"],
    joyScore: 97,
    flavorProfile: "Intensely tropical, sweet citrus, sunshine creamy"
  }
};

interface FlavorComparisonProps {
  activeFlavorId?: string;
}

export default function FlavorComparison({ activeFlavorId = "chocolate" }: FlavorComparisonProps) {
  const [leftId, setLeftId] = useState<string>(activeFlavorId);
  const [rightId, setRightId] = useState<string>(
    FLAVORS.find((f) => f.id !== activeFlavorId)?.id || "strawberry"
  );

  // Synchronize component when the active menu flavor selection changes in the parent component
  useEffect(() => {
    if (activeFlavorId && activeFlavorId !== leftId) {
      setLeftId(activeFlavorId);
    }
  }, [activeFlavorId]);

  const leftFlavor = FLAVORS.find((f) => f.id === leftId) || FLAVORS[0];
  const rightFlavor = FLAVORS.find((f) => f.id === rightId) || FLAVORS[1];

  const leftNutri = FLAVOR_NUTRITION[leftId] || FLAVOR_NUTRITION["chocolate"];
  const rightNutri = FLAVOR_NUTRITION[rightId] || FLAVOR_NUTRITION["strawberry"];

  // Utility to determine maximums for safe responsive chart scaling
  const maxCal = 250;
  const maxSugar = 20;
  const maxFat = 18;
  const maxProtein = 6;

  // Swap compared flavors for quick interactions
  const handleSwap = () => {
    const temp = leftId;
    setLeftId(rightId);
    setRightId(temp);
  };

  return (
    <div className="mt-16 bg-neutral-950/40 p-6 md:p-8 rounded-3xl border border-white/5 backdrop-blur-md">
      {/* Header section inside the panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-black text-lg text-white">Compare Scoops Side-by-Side</h4>
            <p className="text-xs text-neutral-400">Analyze nutrition facts, unique premium ingredients, and dietary attributes.</p>
          </div>
        </div>

        <button
          onClick={handleSwap}
          className="self-start md:self-auto px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer text-neutral-300 hover:text-white"
        >
          🔄 Swap Positions
        </button>
      </div>

      {/* Selectors grid & side-by-side preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative">
        
        {/* Absolute vs decorative divider line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2" />

        {/* Left flavor compare column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
              Comparing Scoop A
            </label>
            <select
              value={leftId}
              onChange={(e) => setLeftId(e.target.value)}
              className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
            >
              {FLAVORS.map((f) => (
                <option key={f.id} value={f.id} disabled={f.id === rightId}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Simple header info for Left scoop */}
          <div className="flex items-center gap-4 bg-neutral-900/50 p-4 rounded-2xl border border-white/5">
            <div className="w-16 h-16 rounded-xl bg-black/40 flex items-center justify-center p-1.5">
              <img src={leftFlavor.image} alt={leftFlavor.name} className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h5 className="font-display font-extrabold text-sm text-white">{leftFlavor.name}</h5>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-amber-500 font-bold">{leftFlavor.price}</span>
                <span className="text-[10px] text-neutral-500">|</span>
                <span className="text-[10px] text-neutral-400 font-mono italic">{leftNutri.flavorProfile}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right flavor compare column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-pink-400">
              Comparing Scoop B
            </label>
            <select
              value={rightId}
              onChange={(e) => setRightId(e.target.value)}
              className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500 transition-colors"
            >
              {FLAVORS.map((f) => (
                <option key={f.id} value={f.id} disabled={f.id === leftId}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Simple header info for Right scoop */}
          <div className="flex items-center gap-4 bg-neutral-900/50 p-4 rounded-2xl border border-white/5">
            <div className="w-16 h-16 rounded-xl bg-black/40 flex items-center justify-center p-1.5">
              <img src={rightFlavor.image} alt={rightFlavor.name} className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h5 className="font-display font-extrabold text-sm text-white">{rightFlavor.name}</h5>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-pink-400 font-bold">{rightFlavor.price}</span>
                <span className="text-[10px] text-neutral-500">|</span>
                <span className="text-[10px] text-neutral-400 font-mono italic">{rightNutri.flavorProfile}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Main comparative stats stack */}
      <div className="mt-10 bg-neutral-950/20 rounded-2xl p-4 md:p-6 border border-white/5 space-y-6">
        
        {/* Calories Bar Chart comparison */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2 font-mono">
            <span className="text-neutral-400">Calories (kcal per scoop)</span>
            <div className="flex gap-4">
              <span className="text-amber-400 font-bold">{leftNutri.calories} kcal</span>
              <span className="text-neutral-500">vs</span>
              <span className="text-pink-400 font-bold">{rightNutri.calories} kcal</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-neutral-900 overflow-hidden flex">
            <div
              style={{ width: `${(leftNutri.calories / maxCal) * 50}%` }}
              className="bg-amber-500 h-full transition-all duration-500 ease-out border-r border-black/25"
            />
            <div className="w-px bg-neutral-800" />
            <div
              style={{ width: `${(rightNutri.calories / maxCal) * 50}%` }}
              className="bg-pink-500 h-full transition-all duration-500 ease-out border-l border-black/25 ml-auto"
            />
          </div>
        </div>

        {/* Sugars Bar Chart comparison */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2 font-mono">
            <span className="text-neutral-400">Total Sugars (g)</span>
            <div className="flex gap-4">
              <span className="text-amber-400 font-bold">{leftNutri.sugar}g</span>
              <span className="text-neutral-500">vs</span>
              <span className="text-pink-400 font-bold">{rightNutri.sugar}g</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-neutral-900 overflow-hidden flex">
            <div
              style={{ width: `${(leftNutri.sugar / maxSugar) * 50}%` }}
              className="bg-amber-500 h-full transition-all duration-500 ease-out"
            />
            <div className="w-px bg-neutral-800" />
            <div
              style={{ width: `${(rightNutri.sugar / maxSugar) * 50}%` }}
              className="bg-pink-500 h-full transition-all duration-500 ease-out ml-auto"
            />
          </div>
        </div>

        {/* Total Fat Bar Chart comparison */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2 font-mono">
            <span className="text-neutral-400">Total Fat (g)</span>
            <div className="flex gap-4">
              <span className="text-amber-400 font-bold">{leftNutri.fat}g</span>
              <span className="text-neutral-500">vs</span>
              <span className="text-pink-400 font-bold">{rightNutri.fat}g</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-neutral-900 overflow-hidden flex">
            <div
              style={{ width: `${(leftNutri.fat / maxFat) * 50}%` }}
              className="bg-amber-500 h-full transition-all duration-500 ease-out"
            />
            <div className="w-px bg-neutral-800" />
            <div
              style={{ width: `${(rightNutri.fat / maxFat) * 50}%` }}
              className="bg-pink-500 h-full transition-all duration-500 ease-out ml-auto"
            />
          </div>
        </div>

        {/* Protein Bar Chart comparison */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2 font-mono">
            <span className="text-neutral-400">Protein (g)</span>
            <div className="flex gap-4">
              <span className="text-amber-400 font-bold">{leftNutri.protein}g</span>
              <span className="text-neutral-500">vs</span>
              <span className="text-pink-400 font-bold">{rightNutri.protein}g</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-neutral-900 overflow-hidden flex">
            <div
              style={{ width: `${(leftNutri.protein / maxProtein) * 50}%` }}
              className="bg-amber-500 h-full transition-all duration-500 ease-out"
            />
            <div className="w-px bg-neutral-800" />
            <div
              style={{ width: `${(rightNutri.protein / maxProtein) * 50}%` }}
              className="bg-pink-500 h-full transition-all duration-500 ease-out ml-auto"
            />
          </div>
        </div>

        {/* Happiness / Joy Index comparison */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2 font-mono">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Happiness Joy Index
            </span>
            <div className="flex gap-4">
              <span className="text-amber-400 font-bold">{leftNutri.joyScore}% Joy</span>
              <span className="text-neutral-500">vs</span>
              <span className="text-pink-400 font-bold">{rightNutri.joyScore}% Joy</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-neutral-900 overflow-hidden flex">
            <div
              style={{ width: `${(leftNutri.joyScore / 100) * 50}%` }}
              className="bg-amber-500 h-full transition-all duration-500 ease-out"
            />
            <div className="w-px bg-neutral-800" />
            <div
              style={{ width: `${(rightNutri.joyScore / 100) * 50}%` }}
              className="bg-pink-500 h-full transition-all duration-500 ease-out ml-auto"
            />
          </div>
        </div>

      </div>

      {/* Key ingredients, allergens & dietary tags layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 border-t border-white/5 pt-8">
        
        {/* Left Scoop Detail column */}
        <div className="space-y-4">
          {/* Dietary tags */}
          <div className="flex flex-wrap gap-1.5">
            {leftNutri.dietaryTags.map((tag) => (
              <span key={tag} className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                {tag}
              </span>
            ))}
          </div>

          {/* Unique premium ingredients list */}
          <div>
            <h6 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">Key Ingredients</h6>
            <ul className="space-y-1.5 text-xs text-neutral-300">
              {leftNutri.keyIngredients.map((ing) => (
                <li key={ing} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Allergens warning panel */}
          <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/15 flex items-start gap-2.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 block">Allergen Notice</span>
              <span className="text-[10px] text-neutral-300">{leftNutri.allergens.join(", ")}</span>
            </div>
          </div>
        </div>

        {/* Right Scoop Detail column */}
        <div className="space-y-4">
          {/* Dietary tags */}
          <div className="flex flex-wrap gap-1.5">
            {rightNutri.dietaryTags.map((tag) => (
              <span key={tag} className="text-[10px] font-mono font-bold bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/20">
                {tag}
              </span>
            ))}
          </div>

          {/* Unique premium ingredients list */}
          <div>
            <h6 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">Key Ingredients</h6>
            <ul className="space-y-1.5 text-xs text-neutral-300">
              {rightNutri.keyIngredients.map((ing) => (
                <li key={ing} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Allergens warning panel */}
          <div className="p-3 bg-pink-500/5 rounded-xl border border-pink-500/15 flex items-start gap-2.5">
            <AlertTriangle className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-pink-400 block">Allergen Notice</span>
              <span className="text-[10px] text-neutral-300">{rightNutri.allergens.join(", ")}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
