import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ShieldAlert,
  Truck,
  Ban,
  CheckCircle,
  Phone,
  MapPin,
  User,
  RefreshCw,
  Lock,
  Unlock,
  TrendingUp,
  Clock,
  ShoppingBag,
  Coins,
  ChevronLeft,
  Mail,
  Home
} from "lucide-react";
import { getOrders, updateOrderStatus, FirebaseOrder } from "../lib/firebase";

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [orders, setOrders] = useState<FirebaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Shipped" | "Cancelled">("All");
  const [filterQuery, setFilterQuery] = useState("");

  const CORRECT_PASSCODE = "1357";
  const CREATOR_EMAIL = "muratmondol13@gmail.com";

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === CREATOR_EMAIL && passcode === CORRECT_PASSCODE) {
      setIsAuthorized(true);
      setErrorMsg("");
      fetchOrdersList();
    } else {
      setErrorMsg("Invalid credentials. Access Denied.");
      setPasscode("");
    }
  };

  const fetchOrdersList = async () => {
    setLoading(true);
    try {
      const ordersList = await getOrders();
      setOrders(ordersList);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string | undefined, newStatus: "Pending" | "Shipped" | "Cancelled") => {
    if (!orderId) return;
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update local state to feel instant and real-time
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      );
    } catch (err) {
      alert("Failed to update status. Please try again.");
    }
  };

  // Stats calculators
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;
  const shippedOrdersCount = orders.filter((o) => o.status === "Shipped").length;
  const totalSalesUsd = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.amountUsd, 0);
  const totalSalesBdt = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.amountBdt, 0);

  // Filter orders by tab and query
  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "All" || order.status === activeTab;
    const matchesSearch =
      order.customerName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      order.customerPhone.includes(filterQuery) ||
      order.transactionId.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (order.id && order.id.toLowerCase().includes(filterQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-32 pb-24 bg-neutral-950 text-white font-sans relative">
      {/* Decorative starry background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-neutral-300 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Shop
          </button>
          <div className="flex items-center gap-2 bg-neutral-900 border border-white/10 px-4 py-1.5 rounded-full text-[11px] font-mono font-bold text-amber-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Merchant Gateway Active
          </div>
        </div>

        {!isAuthorized ? (
          /* PASSCODE LOCK SCREEN */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center"
          >
            <div className="w-16 h-16 bg-amber-500/10 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-7 h-7 text-amber-400" />
            </div>

            <h2 className="font-display font-black text-2xl tracking-tight mb-2">Merchant Orders Vault</h2>
            <p className="text-xs text-neutral-400 mb-8 max-w-xs mx-auto">
              Access the secure Creamsy merchant terminal to track customer orders, process dispatches, and manage logistics.
            </p>

            <form onSubmit={handleAuthorize} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-mono font-bold text-neutral-400 block">
                  CREATOR EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="creator@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-all placeholder:text-neutral-700"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-mono font-bold text-neutral-400 block">
                  SECURE PASSCODE
                </label>
                <input
                  type="password"
                  placeholder="••••"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value.replace(/[^0-9]/g, ""))}
                  maxLength={4}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono tracking-widest text-amber-400 focus:outline-none focus:border-amber-400 transition-all placeholder:text-neutral-700"
                />
                <span className="text-[10px] text-neutral-500 font-mono block leading-relaxed">
                  Protected via high-grade security rules. Only authorized creators can access.
                </span>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-500 font-mono font-bold text-left pt-1">
                  ⚠️ {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-4 mt-2 bg-amber-500 hover:bg-amber-600 text-black font-display font-black text-sm tracking-wider uppercase rounded-full shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                Unlock Vault <Unlock className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        ) : (
          /* ADMIN ORDERS DASHBOARD */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header info */}
            <div>
              <h1 className="font-display font-black text-4xl tracking-tight text-white mb-2 flex items-center gap-3">
                Orders Dispatch Vault <ShieldAlert className="w-8 h-8 text-amber-500" />
              </h1>
              <p className="text-sm text-neutral-400">
                Monitor incoming bKash, Nagad, Rocket, and COD ice cream orders and update fulfillment statuses in real-time.
              </p>
            </div>

            {/* STATISTICS CARDS BANNER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Sales */}
              <div className="bg-neutral-900 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono uppercase block tracking-wider">Total Revenue</span>
                  <span className="text-xl font-bold font-mono text-amber-400">${totalSalesUsd.toFixed(2)}</span>
                  <span className="text-[10px] text-neutral-500 block font-mono">৳{totalSalesBdt.toLocaleString()} BDT</span>
                </div>
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              {/* Card 2: Total Orders */}
              <div className="bg-neutral-900 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono uppercase block tracking-wider">Total Placed</span>
                  <span className="text-xl font-bold font-mono text-white">{totalOrdersCount}</span>
                  <span className="text-[10px] text-neutral-500 block font-sans">Received items</span>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Card 3: Pending Shipments */}
              <div className="bg-neutral-900 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono uppercase block tracking-wider">Pending Shipment</span>
                  <span className="text-xl font-bold font-mono text-amber-500">{pendingOrdersCount}</span>
                  <span className="text-[10px] text-amber-500/60 block font-mono">Needs dispatch</span>
                </div>
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
                </div>
              </div>

              {/* Card 4: Shipped & Completed */}
              <div className="bg-neutral-900 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono uppercase block tracking-wider">Dispatched count</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">{shippedOrdersCount}</span>
                  <span className="text-[10px] text-emerald-400/60 block font-sans">Delivered/Shipped</span>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* TAB CONTROLS & REFRESH ACTION */}
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
                      {tab === "Pending" && "🟡 "}
                      {tab === "Shipped" && "🟢 "}
                      {tab === "Cancelled" && "🔴 "}
                      {tab}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                {/* Search input filter */}
                <input
                  type="text"
                  placeholder="Search by name, phone, txn..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="bg-neutral-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 transition-all w-full md:w-60"
                />

                {/* Refresh button */}
                <button
                  onClick={fetchOrdersList}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all disabled:opacity-50 cursor-pointer"
                  title="Reload Orders"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* ORDERS TABLE/LIST */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin mb-4" />
                <span className="text-xs font-mono text-neutral-400">Syncing with Creamsy Secure Cloud...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-neutral-900 border border-dashed border-white/15 rounded-3xl py-16 text-center">
                <span className="text-4xl mb-4 block">📦</span>
                <h3 className="font-display font-bold text-lg text-white mb-1">No Orders Found</h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  No orders match your filter criteria or there are no checkouts completed yet. Try matching other status parameters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const itemsSummary = order.items
                    .map((it) => `${it.name} (x${it.quantity})`)
                    .join(", ");

                  return (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-neutral-900 border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all flex flex-col md:flex-row justify-between gap-6"
                    >
                      {/* Left: Customer & Delivery Details */}
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-md">
                            Ref: {order.id?.slice(-6).toUpperCase() || "NEW"}
                          </span>
                          <span className="text-xs text-neutral-500 font-mono">
                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded-full ${
                              order.status === "Shipped"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : order.status === "Cancelled"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {order.status === "Shipped" ? "🚚 Shipped" : order.status === "Cancelled" ? "❌ Cancelled" : "⏳ Pending"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Name & Phone */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-white">
                              <User className="w-3.5 h-3.5 text-neutral-400" />
                              {order.customerName}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                              <Phone className="w-3.5 h-3.5 text-neutral-400" />
                              {order.customerPhone}
                            </div>
                          </div>

                          {/* Address */}
                          <div className="flex gap-2 text-xs text-neutral-400 leading-relaxed">
                            <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                            <span>{order.customerAddress}</span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-neutral-950/50 p-3.5 rounded-xl border border-white/5 text-xs text-neutral-300">
                          <span className="font-bold text-white block mb-1">🛒 Ordered Items:</span>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between font-mono">
                                <span>{item.name} <span className="text-amber-500">x{item.quantity}</span></span>
                                <span className="text-neutral-500">{item.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Payment Receipt & Fulfillment Actions */}
                      <div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 space-y-4">
                        <div className="space-y-2 text-xs font-mono">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Method:</span>
                            <span className="text-white font-bold">{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Txn ID:</span>
                            <span className="text-amber-400 font-bold break-all">{order.transactionId}</span>
                          </div>
                          <div className="flex justify-between border-t border-white/5 pt-2">
                            <span className="text-neutral-500">Total USD:</span>
                            <span className="text-white font-bold">${order.amountUsd.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Total BDT:</span>
                            <span className="text-amber-400 font-bold">৳{order.amountBdt.toLocaleString()} BDT</span>
                          </div>
                        </div>

                        {/* Action controllers */}
                        <div className="space-y-2 pt-2">
                          {order.status === "Pending" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateStatus(order.id, "Cancelled")}
                                className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-1 cursor-pointer border border-red-500/15"
                                title="Cancel Order"
                              >
                                <Ban className="w-3.5 h-3.5" /> Cancel
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(order.id, "Shipped")}
                                className="flex-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-xl text-xs font-black tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10"
                                title="Ship and Dispatch Order"
                              >
                                <Truck className="w-3.5 h-3.5" /> Ship Order
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(order.id, "Pending")}
                              className="w-full py-2 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer border border-white/10"
                            >
                              <Clock className="w-3.5 h-3.5 text-neutral-400" /> Revert to Pending
                            </button>
                          )}
                        </div>
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
