import React from "react";

interface TickerProps {
  speed?: number; // duration of animation in seconds
  bgColor?: string;
  textColor?: string;
}

export default function Ticker({
  speed = 25,
  bgColor = "bg-amber-500",
  textColor = "text-black"
}: TickerProps) {
  const tickerItems = [
    "🍦 NEW FLAVORS ARRIVING WEEKLY",
    "🚚 FREE CONE DELIVERY OVER $20",
    "💎 ACCUMULATE CREAMY REWARD POINTS",
    "🎉 WEEKEND SPECIALS 50% OFF SECOND SCOOP",
    "🌿 100% ORGANIC CERTIFIED MILK AND BERRIES",
    "❄️ SHIPPED WITH ZERO-EMISSION DRY-ICE PACKS",
    "🌟 OVER 12,000 FIVE-STAR REVIEWS",
    "🐮 GRASS-FED FRESH MILK FROM LOCAL COOP"
  ];

  // Repeat items to fill space and guarantee seamless loop
  const repeatedItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div
      id="scrolling-ticker-banner"
      className={`relative w-full overflow-hidden py-3 font-display font-black text-sm uppercase tracking-wider select-none border-y border-white/10 ${bgColor} ${textColor}`}
    >
      {/* Dynamic Keyframes injected locally to ensure absolute independence and reliability */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-infinite {
          animation: marquee ${speed}s linear infinite;
        }
      `}</style>

      <div className="flex w-[300%] animate-marquee-infinite items-center gap-12 whitespace-nowrap">
        {repeatedItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <span>{item}</span>
            <span className="text-xl">✨</span>
          </div>
        ))}
      </div>
    </div>
  );
}
