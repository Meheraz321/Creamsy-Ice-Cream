import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Smartphone,
  Lock,
  Unlock,
  LogOut,
  ShoppingBag,
  TrendingUp,
  Clock,
  ChevronLeft,
  RefreshCw,
  Search,
  Star,
  Compass,
  ArrowRight,
  Sparkles,
  Award,
  Truck,
  Heart,
  HelpCircle,
  RotateCcw
} from "lucide-react";
import { getCustomerOrders, registerCustomer, loginCustomer, FirebaseOrder } from "../lib/firebase";
import { FLAVORS } from "../data";
import { Flavor } from "../types";

interface UserProfileProps {
  onNavigate: (page: string) => void;
  onAddProduct: (flavor: Flavor, event?: React.MouseEvent) => void;
}

export default function UserProfile({ onNavigate, onAddProduct }: UserProfileProps) {
  // Authentication states
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; phone: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Orders states
  const [orders, setOrders] = useState<FirebaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Shipped" | "Cancelled">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Load existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("creamsy_user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUserProfile(parsed);
      setIsLoggedIn(true);
      fetchCustomerOrdersList(parsed.phone);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMsg("Please enter a valid 11-digit Bangladeshi mobile number starting with 01.");
      return;
    }

    if (pin.length < 4) {
      setErrorMsg("PIN must be at least 4 digits.");
      return;
    }

    setAuthLoading(true);

    try {
      if (authMode === "signup") {
        if (!name.trim()) {
          setErrorMsg("Please enter your name.");
          setAuthLoading(false);
          return;
        }
        const user = await registerCustomer(name.trim(), phone, pin);
        const userData = { name: user.name, phone: user.phone };
        localStorage.setItem("creamsy_user", JSON.stringify(userData));
        setUserProfile(userData);
        setIsLoggedIn(true);
        fetchCustomerOrdersList(user.phone);
      } else {
        const user = await loginCustomer(phone, pin);
        const userData = { name: user.name, phone: user.phone };
        localStorage.setItem("creamsy_user", JSON.stringify(userData));
        setUserProfile(userData);
        setIsLoggedIn(true);
        fetchCustomerOrdersList(user.phone);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || "Authentication failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("creamsy_user");
    setUserProfile(null);
    setIsLoggedIn(false);
    setOrders([]);
    setPhone("");
    setName("");
    setPin("");
  };

  const fetchCustomerOrdersList = async (userPhone: string) => {
    setLoading(true);
    try {
      const customerOrders = await getCustomerOrders(userPhone);
      setOrders(customerOrders);
    } catch (err) {
      console.error("Failed to load customer orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reorder flow
  const handleReorder = (order: FirebaseOrder) => {
    order.items.forEach((item) => {
      const flavorObj = FLAVORS.find((f) => f.id === item.flavorId);
      if (flavorObj) {
        // Add multiple copies if quantity is greater than 1
        for (let i = 0; i < item.quantity; i++) {
          onAddProduct(flavorObj);
        }
      }
    });

    // Notify user with elegant toast style notification
    const feedback = document.getElementById("reorder-feedback");
    if (feedback) {
      feedback.classList.remove("opacity-0", "translate-y-2");
      feedback.classList.add("opacity-100", "translate-y-0");
      setTimeout(() => {
        feedback.classList.remove("opacity-100", "translate-y-0");
        feedback.classList.add("opacity-0", "translate-y-2");
      }, 2500);
    }
  };

  // Stats calculation
  const totalOrders = orders.length;
  const totalSpentUsd = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.amountUsd, 0);
  const totalSpentBdt = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.amountBdt, 0);

  // Tier calculation based on total order count
  const getTier = (count: number) => {
    if (count === 0) return { title: "Scoop Adventurer", badge: "🍦", color: "text-neutral-400 bg-neutral-900 border-neutral-800" };
    if (count <= 2) return { title: "Silver Scooper", badge: "🥈", color: "text-slate-300 bg-slate-900 border-slate-800" };
    if (count <= 5) return { title: "Golden Cone Elite", badge: "🥇", color: "text-amber-400 bg-amber-950/40 border-amber-500/20" };
    return { title: "Emerald Sundae Master", badge: "👑", color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/20" };
  };

  const tier = getTier(totalOrders);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "All" || order.status === activeTab;
    const matchesSearch =
      order.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((it) => it.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-32 pb-24 bg-neutral-950 text-white font-sans relative">
      {/* Decorative starry background glow */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 w-[450px] h-[450px] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />

      {/* Reorder feedback toast */}
      <div
        id="reorder-feedback"
        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-amber-400 text-black px-6 py-3 rounded-full font-display font-black text-xs uppercase tracking-wider shadow-[0_12px_40px_rgba(245,158,11,0.4)] z-50 pointer-events-none opacity-0 translate-y-2 transition-all duration-300 flex items-center gap-2 border border-amber-300"
      >
        <Sparkles className="w-4 h-4 fill-black" />
        Scoops Added to Basket Successfully!
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-neutral-300 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </button>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-bold text-rose-400 transition-all cursor-pointer"
            >
              Sign Out <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {!isLoggedIn ? (
          /* LOGIN OR SIGN UP PORTAL */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Visual accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-rose-400" />

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-500/10 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="w-7 h-7 text-amber-400" />
              </div>
              <h2 className="font-display font-black text-2xl tracking-tight mb-2">Creamsy Club Portal</h2>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                {authMode === "login" 
                  ? "Log in to check your orders, track live shipping status, and earn loyalty tiers." 
                  : "Sign up today to create a persistent profile, save your order history, and unlock elite perks."}
              </p>
            </div>

            {/* Login / Sign Up Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-neutral-950 rounded-2xl mb-6 border border-white/5">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setErrorMsg("");
                }}
                className={`py-2 text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
                  authMode === "login"
                    ? "bg-amber-400 text-black shadow-md font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signup");
                  setErrorMsg("");
                }}
                className={`py-2 text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
                  authMode === "signup"
                    ? "bg-amber-400 text-black shadow-md font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              {authMode === "signup" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-neutral-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-all placeholder:text-neutral-750"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-400 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
                  PHONE NUMBER (BANGLADESH)
                </label>
                <input
                  type="text"
                  placeholder="017XXXXXXXX"
                  maxLength={11}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-amber-400 transition-all placeholder:text-neutral-750"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  SECURITY PIN (4-6 DIGITS)
                </label>
                <input
                  type="password"
                  placeholder="••••"
                  maxLength={6}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono tracking-widest focus:outline-none focus:border-amber-400 transition-all placeholder:text-neutral-750"
                />
                <span className="text-[10px] text-neutral-500 font-mono block leading-relaxed">
                  {authMode === "signup"
                    ? "Choose a numerical PIN to secure your account."
                    : "Enter your account security PIN."}
                </span>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-500 font-mono font-bold">
                  ⚠️ {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-display font-black text-sm tracking-wider uppercase rounded-full shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
              >
                {authLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : authMode === "login" ? (
                  <>
                    Log In <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Create Account & Log In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 border-t border-white/5 pt-6 text-center">
              <span className="text-[10px] font-mono text-neutral-500">
                🔒 Secured via Firebase Firestore database synchronization
              </span>
            </div>
          </motion.div>
        ) : (
          /* LOGGED-IN CUSTOMER PROFILE DASHBOARD */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* PROFILE BANNER / MEMBER CARD */}
            <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Starry background glow */}
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-amber-400 shadow-inner">
                  <User className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="font-display font-black text-2xl tracking-tight text-white">{userProfile?.name}</h2>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold font-mono rounded-full border ${tier.color} flex items-center gap-1`}>
                      <span>{tier.badge}</span> {tier.title}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" /> {userProfile?.phone}
                  </p>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-3 md:gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
                <div className="text-center md:text-left">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Purchases</span>
                  <span className="text-lg md:text-xl font-bold font-mono text-white">{totalOrders}</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Total USD</span>
                  <span className="text-lg md:text-xl font-bold font-mono text-amber-400">${totalSpentUsd.toFixed(2)}</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-wider">Spent BDT</span>
                  <span className="text-lg md:text-xl font-bold font-mono text-white">৳{totalSpentBdt.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* TAB CONTROLS, SEARCH, AND REFRESH */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900 border border-white/10 p-4 rounded-2xl">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
                {(["All", "Pending", "Shipped", "Cancelled"] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-xs font-bold font-display rounded-full tracking-wide transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-black"
                          : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {tab === "Pending" && "⏳ "}
                      {tab === "Shipped" && "🚚 "}
                      {tab === "Cancelled" && "❌ "}
                      {tab}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-60">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-neutral-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 transition-all w-full"
                  />
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  onClick={() => fetchCustomerOrdersList(userProfile?.phone || "")}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all disabled:opacity-50 cursor-pointer"
                  title="Reload My Orders"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* CUSTOMER ORDERS TIMELINE */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin mb-4" />
                <span className="text-xs font-mono text-neutral-400">Fetching order histories...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-neutral-900 border border-dashed border-white/15 rounded-3xl py-16 text-center">
                <span className="text-4xl mb-4 block">🍧</span>
                <h3 className="font-display font-bold text-lg text-white mb-1">No Orders Found</h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto mb-6">
                  {searchQuery
                    ? "No previous purchases matched your search terms."
                    : "You haven't placed any ice cream scoops yet. Go ahead and treat yourself!"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => onNavigate("home")}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black rounded-full text-xs font-black tracking-wide transition-all cursor-pointer"
                  >
                    Browse Fluffy Flavours
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-neutral-900/80 border border-white/10 rounded-2xl p-5 md:p-6 hover:border-amber-400/20 transition-all space-y-5"
                    >
                      {/* Top status bar */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/5 pb-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold text-amber-400 tracking-wider">
                            ORDER REF: {order.id?.slice(-8).toUpperCase() || "NEW"}
                          </span>
                          <div className="text-xs text-neutral-400 font-mono">
                            {new Date(order.createdAt).toLocaleString()}
                          </div>
                        </div>

                        {/* Status chip */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500 font-mono">Status:</span>
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide font-mono ${
                              order.status === "Shipped"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : order.status === "Cancelled"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                            }`}
                          >
                            {order.status === "Shipped" ? "🚚 Shipped" : order.status === "Cancelled" ? "❌ Cancelled" : "⏳ Pending"}
                          </span>
                        </div>
                      </div>

                      {/* Middle: Grid layout with items & delivery details */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Items breakdown (Column span: 7) */}
                        <div className="lg:col-span-7 space-y-3">
                          <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Ordered Scoops</h4>
                          <div className="space-y-2 bg-neutral-950/45 p-3 rounded-xl border border-white/5">
                            {order.items.map((item, i) => {
                              const fObj = FLAVORS.find((f) => f.id === item.flavorId);
                              return (
                                <div key={i} className="flex items-center justify-between text-xs font-mono py-1.5 first:pt-0 last:pb-0 border-b border-white/5 last:border-b-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-base">{fObj?.floatingEmojis[0] || "🍦"}</span>
                                    <span>
                                      <span className="text-white font-bold">{item.name}</span>{" "}
                                      <span className="text-amber-500 font-black">x{item.quantity}</span>
                                    </span>
                                  </div>
                                  <span className="text-neutral-400">{item.price}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order Tracking Stepper (Column span: 5) */}
                        <div className="lg:col-span-5 space-y-3">
                          <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Fulfillment Pipeline</h4>
                          
                          {order.status === "Cancelled" ? (
                            <div className="bg-rose-500/5 border border-rose-500/15 p-4 rounded-xl text-center space-y-1">
                              <span className="text-base">❌</span>
                              <h5 className="text-xs font-bold text-rose-400">Order Cancelled</h5>
                              <p className="text-[10px] text-neutral-400 leading-relaxed">
                                This order has been cancelled by the merchant. Refunds or updates will be processed as per policies.
                              </p>
                            </div>
                          ) : (
                            /* Stepper tracking flow */
                            <div className="bg-neutral-950/20 p-4 rounded-xl border border-white/5 relative">
                              {/* Horizontal or Vertical tracking stepper */}
                              <div className="flex items-center justify-between relative z-10 font-mono text-[9px] font-bold">
                                {/* Stage 1 */}
                                <div className="flex flex-col items-center text-center space-y-1.5 flex-1">
                                  <div className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center font-black">
                                    ✓
                                  </div>
                                  <span className="text-amber-400">Placed</span>
                                </div>

                                {/* Connector */}
                                <div className={`h-0.5 flex-1 -mt-4 transition-all ${order.status === "Shipped" ? "bg-emerald-400" : "bg-neutral-800"}`} />

                                {/* Stage 2 */}
                                <div className="flex flex-col items-center text-center space-y-1.5 flex-1">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black ${
                                    order.status === "Shipped" ? "bg-emerald-400 text-black" : "bg-neutral-800 text-neutral-500 border border-white/5"
                                  }`}>
                                    {order.status === "Shipped" ? "✓" : "⏳"}
                                  </div>
                                  <span className={order.status === "Shipped" ? "text-emerald-400" : "text-neutral-500"}>Processing</span>
                                </div>

                                {/* Connector */}
                                <div className={`h-0.5 flex-1 -mt-4 transition-all ${order.status === "Shipped" ? "bg-emerald-400" : "bg-neutral-800"}`} />

                                {/* Stage 3 */}
                                <div className="flex flex-col items-center text-center space-y-1.5 flex-1">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black ${
                                    order.status === "Shipped" ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "bg-neutral-800 text-neutral-500 border border-white/5"
                                  }`}>
                                    {order.status === "Shipped" ? "🚚" : "📦"}
                                  </div>
                                  <span className={order.status === "Shipped" ? "text-emerald-400" : "text-neutral-500"}>Shipped</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom Receipt bar with reorder action */}
                      <div className="bg-neutral-950/45 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-white/5">
                        <div className="flex items-center gap-6 text-xs font-mono w-full sm:w-auto justify-between sm:justify-start">
                          <div>
                            <span className="text-neutral-500 text-[10px] block uppercase">Txn ID</span>
                            <span className="text-neutral-300 font-bold">{order.transactionId}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 text-[10px] block uppercase">Method</span>
                            <span className="text-white font-bold">{order.paymentMethod}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 text-[10px] block uppercase">Order Cost</span>
                            <span className="text-amber-400 font-bold">${order.amountUsd.toFixed(2)} / ৳{order.amountBdt.toLocaleString()} BDT</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleReorder(order)}
                          className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-neutral-100 text-black font-display font-black text-xs uppercase tracking-wider rounded-full shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" /> Reorder Scoop
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
