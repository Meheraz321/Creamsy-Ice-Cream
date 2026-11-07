import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";
import { Flavor, CartItem } from "./types";
import { FLAVORS } from "./data";

// Custom Modular Components
import MascotIntro from "./components/MascotIntro";
import Header from "./components/Header";
import Ticker from "./components/Ticker";
import FloatingDecorations from "./components/FloatingDecorations";
import ProductGrid from "./components/ProductGrid";
import Moments from "./components/Moments";
import FAQAccordion from "./components/FAQAccordion";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import AdminPanel from "./components/AdminPanel";
import UserProfile from "./components/UserProfile";

interface FlyingItem {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  image: string;
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeFlavorId, setActiveFlavorId] = useState("chocolate");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  // Get current flavor metadata
  const currentFlavor = FLAVORS.find((f) => f.id === activeFlavorId) || FLAVORS[0];

  // Flavor navigation controls
  const handleNextFlavor = () => {
    const currentIndex = FLAVORS.findIndex((f) => f.id === activeFlavorId);
    const nextIndex = (currentIndex + 1) % FLAVORS.length;
    setActiveFlavorId(FLAVORS[nextIndex].id);
  };

  const handlePrevFlavor = () => {
    const currentIndex = FLAVORS.findIndex((f) => f.id === activeFlavorId);
    const prevIndex = (currentIndex - 1 + FLAVORS.length) % FLAVORS.length;
    setActiveFlavorId(FLAVORS[prevIndex].id);
  };

  // Cart operations
  const handleAddProduct = (flavor: Flavor, event?: React.MouseEvent) => {
    // 1. Determine landing/end position at the Header's Cart Button
    const cartBtn = document.getElementById("header-cart-toggle");
    let endX = window.innerWidth - 60;
    let endY = 30;
    if (cartBtn) {
      const rect = cartBtn.getBoundingClientRect();
      endX = rect.left + rect.width / 2;
      endY = rect.top + rect.height / 2;
    }

    // 2. Determine starting position from click or center of screen
    let startX = event ? event.clientX : window.innerWidth / 2;
    let startY = event ? event.clientY : window.innerHeight / 2;

    const newItem: FlyingItem = {
      id: Date.now() + Math.random(),
      startX,
      startY,
      endX,
      endY,
      image: flavor.image,
    };

    setFlyingItems((prev) => [...prev, newItem]);

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.flavorId === flavor.id);
      if (existing) {
        return prevCart.map((item) =>
          item.flavorId === flavor.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevCart,
        {
          flavorId: flavor.id,
          name: flavor.name,
          price: flavor.price,
          image: flavor.image,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateQuantity = (flavorId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.flavorId === flavorId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Directly Order Active Stage Flavor
  const handleOrderActive = (e: React.MouseEvent) => {
    handleAddProduct(currentFlavor, e);
    // Open the cart after the cute throwing animation finishes!
    setTimeout(() => {
      setIsCartOpen(true);
    }, 850);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-400 selection:text-black antialiased overflow-x-hidden">
      {/* MASCOT ANIMATED INTRO SCREEN */}
      <AnimatePresence>
        {showIntro && <MascotIntro onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {/* PRIMARY WEBSITE LAYOUT */}
      {!showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="relative"
        >
          {/* STICKY HEADER */}
          <Header
            cartCount={totalCartCount}
            onCartClick={() => setIsCartOpen(true)}
            currentPage={currentPage}
            onNavigate={setCurrentPage}
          />

          {/* SIDEBAR CART DRAWER */}
          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onClear={handleClearCart}
          />

          {/* MAIN DYNAMIC PAGE CONTENT CONTAINER */}
          <main className="min-h-screen">
            <AnimatePresence mode="wait">
              {currentPage === "home" && (
                <motion.div
                  key="home-page"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {/* SECTION 1: HERO / THE MAIN STAGE */}
                  <section
                    id="hero"
                    className="min-h-screen pt-32 pb-16 flex flex-col justify-between relative overflow-hidden transition-colors duration-1000 ease-in-out"
                    style={{ backgroundColor: currentFlavor.bgColor }}
                  >
                    {/* Ambient Overlay Radial Lighting */}
                    <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/10 to-black/30 pointer-events-none" />

                    {/* Floating Toppings/Emojis specific to active flavor */}
                    <FloatingDecorations emojis={currentFlavor.floatingEmojis} />

                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1 w-full relative z-10">
                      {/* Left Column: Headline Copy */}
                      <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left pt-6 lg:pt-0">
                        
                        {/* 5-Star review pill */}
                        <motion.div
                          className="inline-flex items-center gap-2 bg-black/35 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 self-center lg:self-start mb-6"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, type: "spring" }}
                        >
                          {/* Small overlapping customer avatars */}
                          <div className="flex -space-x-2.5">
                            <img
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80"
                              className="w-6.5 h-6.5 rounded-full border border-white object-cover"
                              alt="Reviewer 1"
                            />
                            <img
                              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80"
                              className="w-6.5 h-6.5 rounded-full border border-white object-cover"
                              alt="Reviewer 2"
                            />
                            <img
                              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80"
                              className="w-6.5 h-6.5 rounded-full border border-white object-cover"
                              alt="Reviewer 3"
                            />
                          </div>
                          <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/20 text-xs font-bold text-white tracking-wide">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>4.8/5 Star Reviews</span>
                          </div>
                        </motion.div>

                        {/* Big Display Headline */}
                        <motion.h1
                          id="main-hero-headline"
                          className="font-display font-black text-5xl md:text-6xl xl:text-7xl tracking-tight text-white mb-6 leading-[1.05] drop-shadow-md"
                          key={currentFlavor.id + "_title"}
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        >
                          Taste Joy in <br />
                          Every Bite
                        </motion.h1>

                        {/* Subtitle Description */}
                        <motion.p
                          className="text-sm md:text-base lg:text-lg text-white/85 max-w-lg leading-relaxed mb-8 font-medium drop-shadow-sm"
                          key={currentFlavor.id + "_desc"}
                          initial={{ opacity: 0, y: 25 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {currentFlavor.description}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                          className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <button
                            id="hero-order-active"
                            onClick={handleOrderActive}
                            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-neutral-100 text-black font-display font-black text-sm uppercase tracking-wider rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                            Order Now ({currentFlavor.price})
                          </button>

                          <button
                            onClick={() => setCurrentPage("menu")}
                            className="w-full sm:w-auto px-8 py-4 bg-black/25 hover:bg-black/40 border border-white/20 text-white font-display font-black text-sm uppercase tracking-wider rounded-full transition-all text-center backdrop-blur-sm cursor-pointer"
                          >
                            See Menu Items
                          </button>
                        </motion.div>

                        {/* Interactive Multi-Flavor Selector Circles */}
                        <motion.div
                          className="flex flex-col items-center lg:items-start gap-3 mt-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-white/70">
                            Switch Signature Flavour
                          </span>
                          <div className="flex items-center gap-3 bg-black/15 p-2 rounded-full border border-white/10 backdrop-blur-sm">
                            {FLAVORS.map((f) => {
                              const isActive = f.id === activeFlavorId;
                              return (
                                <button
                                  key={f.id}
                                  id={`flavor-selector-${f.id}`}
                                  onClick={() => setActiveFlavorId(f.id)}
                                  className={`relative w-12 h-12 rounded-full p-1 border transition-all hover:scale-110 active:scale-90 cursor-pointer ${
                                    isActive
                                      ? "bg-white border-white scale-105 shadow-md shadow-black/20"
                                      : "bg-black/35 border-white/25 hover:border-white/60"
                                  }`}
                                >
                                  <img
                                    src={f.image}
                                    alt={f.name}
                                    className="w-full h-full object-contain rotate-6"
                                    referrerPolicy="no-referrer"
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>

                      </div>

                      {/* Right Column: Hero Stage Ice Cream Cup */}
                      <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[400px] md:min-h-[480px]">
                        
                        {/* Floating Shadow background disc ring */}
                        <motion.div
                          className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-white/5 border border-white/10 blur-sm pointer-events-none z-0"
                          animate={{
                            scale: [1, 1.06, 1],
                            opacity: [0.3, 0.5, 0.3],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 5,
                            ease: "easeInOut",
                          }}
                        />

                        {/* Left Switch Chevron */}
                        <button
                          id="stage-arrow-prev"
                          onClick={handlePrevFlavor}
                          className="absolute left-0 md:left-6 z-20 w-12 h-12 bg-black/30 hover:bg-black/55 backdrop-blur-sm border border-white/25 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-all cursor-pointer shadow-lg"
                        >
                          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                        </button>

                        {/* Central Floating Cup */}
                        <div className="relative z-10 w-80 h-80 md:w-[420px] md:h-[420px] flex items-center justify-center select-none">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentFlavor.id}
                              className="absolute flex items-center justify-center cursor-grab active:cursor-grabbing"
                              initial={{ y: 160, rotate: -20, opacity: 0, scale: 0.85 }}
                              animate={{ y: 0, rotate: 0, opacity: 1, scale: 1 }}
                              exit={{ y: -160, rotate: 20, opacity: 0, scale: 0.85 }}
                              transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 14,
                              }}
                              drag
                              dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                              dragElastic={0.4}
                              whileHover={{ scale: 1.04 }}
                            >
                              <img
                                src={currentFlavor.image}
                                alt={currentFlavor.name}
                                className="w-72 h-72 md:w-[380px] md:h-[380px] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.4)] pointer-events-none"
                                referrerPolicy="no-referrer"
                              />
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* Right Switch Chevron */}
                        <button
                          id="stage-arrow-next"
                          onClick={handleNextFlavor}
                          className="absolute right-0 md:right-6 z-20 w-12 h-12 bg-black/30 hover:bg-black/55 backdrop-blur-sm border border-white/25 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-all cursor-pointer shadow-lg"
                        >
                          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                        </button>

                        {/* Bottom Cup Tag Indicator badge */}
                        <div className="mt-8 z-10">
                          <motion.div
                            key={currentFlavor.id + "_badge"}
                            className="flex items-center gap-2 bg-black/45 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-xl"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.25 }}
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="font-display font-black text-sm tracking-wide text-white">
                              {currentFlavor.displayName}
                            </span>
                            <span className="text-[#80cbc4] font-mono text-xs font-bold pl-2 border-l border-white/20">
                              {currentFlavor.price}
                            </span>
                          </motion.div>
                        </div>

                      </div>
                    </div>

                    {/* LOWER PORTION: INFINITE SCROLLING TICKER MARQUEE */}
                    <div className="w-full mt-10">
                      <Ticker
                        bgColor="bg-neutral-950/40"
                        textColor="text-white/90"
                      />
                    </div>
                  </section>

                  {/* SECTION 2: PRODUCT MENU GRID & QUOTE BANNER */}
                  <ProductGrid
                    onAddProduct={handleAddProduct}
                    onSelectFlavor={setActiveFlavorId}
                    selectedFlavorId={activeFlavorId}
                  />

                  {/* SECTION 3 & 4: INSTAGRAM MOMENTS & TRAVEL POLAROIDS */}
                  <Moments />

                  {/* SECTION 5: FAQs */}
                  <FAQAccordion />

                  {/* SECTION 6: LOVED BY FANS TESTIMONIALS */}
                  <Testimonials />
                </motion.div>
              )}

              {currentPage === "menu" && (
                <motion.div
                  key="menu-page"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <ProductGrid
                    onAddProduct={handleAddProduct}
                    onSelectFlavor={(id) => {
                      setActiveFlavorId(id);
                      setCurrentPage("home");
                    }}
                    selectedFlavorId={activeFlavorId}
                    onNavigate={setCurrentPage}
                  />
                </motion.div>
              )}

              {currentPage === "moments" && (
                <motion.div
                  key="moments-page"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <Moments onNavigate={setCurrentPage} />
                </motion.div>
              )}

              {currentPage === "faq" && (
                <motion.div
                  key="faq-page"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <FAQAccordion onNavigate={setCurrentPage} />
                </motion.div>
              )}

              {currentPage === "reviews" && (
                <motion.div
                  key="reviews-page"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <Testimonials onNavigate={setCurrentPage} />
                </motion.div>
              )}

              {currentPage === "admin" && (
                <motion.div
                  key="admin-page"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <AdminPanel onNavigate={setCurrentPage} />
                </motion.div>
              )}

              {currentPage === "profile" && (
                <motion.div
                  key="profile-page"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <UserProfile onNavigate={setCurrentPage} onAddProduct={handleAddProduct} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* SECTION 7: FOOTER WITH WAVE DIVIDER */}
          <Footer onNavigate={setCurrentPage} />

          {/* PLAYFUL FLOATING CART ANIMATION OVERLAY */}
          <AnimatePresence>
            {flyingItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{
                  position: "fixed",
                  left: item.startX,
                  top: item.startY,
                  x: "-50%",
                  y: "-50%",
                  scale: 0.5,
                  opacity: 1,
                  rotate: 0,
                  zIndex: 9999,
                }}
                animate={{
                  left: item.endX,
                  top: [item.startY, Math.min(item.startY, item.endY) - 150, item.endY],
                  scale: [0.5, 1.2, 0.25],
                  rotate: [0, 180, 360],
                  opacity: [1, 1, 0.9],
                }}
                exit={{
                  opacity: 0,
                  scale: 0.1,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                onAnimationComplete={() => {
                  setFlyingItems((prev) => prev.filter((i) => i.id !== item.id));
                  
                  // Trigger micro-interaction on the header cart button
                  const cartBtn = document.getElementById("header-cart-toggle");
                  if (cartBtn) {
                    cartBtn.classList.add("scale-115", "rotate-12", "bg-amber-400");
                    setTimeout(() => {
                      cartBtn.classList.remove("scale-115", "rotate-12", "bg-amber-400");
                    }, 300);
                  }
                }}
                className="w-14 h-14 rounded-full bg-neutral-900 border-2 border-amber-400 flex items-center justify-center p-2 shadow-[0_8px_24px_rgba(245,158,11,0.3)] pointer-events-none select-none z-[9999]"
              >
                <img
                  src={item.image}
                  alt="flying scoop"
                  className="w-full h-full object-contain filter drop-shadow rotate-12"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </AnimatePresence>

        </motion.div>
      )}
    </div>
  );
}
