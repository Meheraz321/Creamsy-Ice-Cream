import React, { useState } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Menu, X, Star, ShieldCheck, User } from "lucide-react";
import { MASCOT_IMAGE } from "../data";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ cartCount, onCartClick, currentPage, onNavigate }: HeaderProps) {
  const [logoClicks, setLogoClicks] = useState(0);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return (
      localStorage.getItem("creamsy_admin_unlocked") === "true" ||
      window.location.search.includes("admin=true")
    );
  });
  const [showUnlockFeedback, setShowUnlockFeedback] = useState(false);

  const navItems = [
    { label: "Home", page: "home" },
    { label: "Menu", page: "menu" },
    { label: "Moments", page: "moments" },
    { label: "Reviews", page: "reviews" },
    { label: "FAQ", page: "faq" }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, page: string) => {
    e.preventDefault();
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigate("home");
    window.scrollTo({ top: 0, behavior: "smooth" });

    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);

    if (nextClicks >= 5 && !isAdminUnlocked) {
      localStorage.setItem("creamsy_admin_unlocked", "true");
      setIsAdminUnlocked(true);
      setShowUnlockFeedback(true);
      setTimeout(() => setShowUnlockFeedback(false), 3000);
    }
  };

  return (
    <header
      id="main-app-header"
      className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all"
    >
      {/* Toast Feedback for Admin Vault Unlocked */}
      {showUnlockFeedback && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[10px] font-mono font-bold px-4 py-1.5 rounded-full shadow-lg border border-amber-300 flex items-center gap-1.5 animate-bounce z-50">
          🔑 Admin Order Vault Revealed!
        </div>
      )}

      {/* Brand logo */}
      <a
        href="#home"
        onClick={handleLogoClick}
        className="flex items-center gap-3 group cursor-pointer"
        title="Creamsy Homepage"
      >
        <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-neutral-900 group-hover:scale-110 transition-transform">
          <img
            src={MASCOT_IMAGE}
            alt="Creamsy Mascot"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="font-display font-black text-2xl tracking-wider text-white drop-shadow-sm">
          Creamsy
        </span>
      </a>

      {/* Nav Items (Pill menus) */}
      <nav id="desktop-nav" className="hidden md:flex items-center gap-1.5 bg-black/25 p-1 rounded-full border border-white/5">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <a
              key={item.label}
              href={`#${item.page}`}
              onClick={(e) => handleNavClick(e, item.page)}
              className={`relative px-4 py-2 font-display text-sm font-semibold rounded-full tracking-wide transition-all ${
                isActive
                  ? "text-black font-bold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-white rounded-full z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Cart & Social Interaction Area */}
      <div className="flex items-center gap-3">
        {/* Rating star pill badge on header */}
        <div className="hidden sm:flex items-center gap-1 bg-amber-500 text-black px-3 py-1.5 rounded-full font-display text-xs font-black shadow-md border border-white/20">
          <Star className="w-3.5 h-3.5 fill-black" />
          <span>4.8/5 Rated</span>
        </div>

        {/* Merchant Portal / Admin Toggle Button (Only visible if unlocked) */}
        {isAdminUnlocked && (
          <button
            id="header-admin-toggle"
            onClick={() => {
              onNavigate("admin");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`relative w-11 h-11 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer border ${
              currentPage === "admin"
                ? "bg-amber-400 text-black border-amber-500"
                : "bg-neutral-900 text-amber-400 border-white/20 hover:bg-neutral-850"
            }`}
            title="Merchant Orders Vault"
          >
            <ShieldCheck className="w-5 h-5 stroke-[2]" />
          </button>
        )}

        {/* Customer Profile / My Orders Button */}
        <button
          id="header-profile-toggle"
          onClick={() => {
            onNavigate("profile");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`relative w-11 h-11 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer border ${
            currentPage === "profile"
              ? "bg-amber-400 text-black border-amber-500"
              : "bg-neutral-900 text-amber-400 border-white/20 hover:bg-neutral-850"
          }`}
          title="My Orders & Profile"
        >
          <User className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Shopping Cart button */}
        <button
          id="header-cart-toggle"
          onClick={onCartClick}
          className="relative w-11 h-11 flex items-center justify-center bg-white hover:bg-neutral-100 text-black rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
          {cartCount > 0 && (
            <motion.span
              key={cartCount}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5.5 h-5.5 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white shadow-md font-sans"
            >
              {cartCount}
            </motion.span>
          )}
        </button>
      </div>
    </header>
  );
}
