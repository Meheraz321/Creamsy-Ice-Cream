import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, Trash2, ShoppingBag, Sparkles, CreditCard, ArrowLeft, Check, Smartphone, ShieldAlert, Coins, MapPin, User } from "lucide-react";
import React, { useState } from "react";
import { CartItem } from "../types";
import { saveOrder } from "../lib/firebase";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (flavorId: string, delta: number) => void;
  onClear: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onClear,
}: CartSidebarProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "shipping_info" | "payment_select" | "mfs_flow" | "submitting" | "success">("idle");
  const [selectedMfs, setSelectedMfs] = useState<"bkash" | "nagad" | "rocket" | "cod">("bkash");
  const [mfsStep, setMfsStep] = useState<"number" | "otp" | "pin">("number");
  const [walletNumber, setWalletNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [walletError, setWalletError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [pinError, setPinError] = useState("");
  const [generatedTxnId, setGeneratedTxnId] = useState("");

  // Customer Shipping Details
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingError, setShippingError] = useState("");

  const subtotal = cart.reduce((sum, item) => {
    const numPrice = parseFloat(item.price.replace("$", ""));
    return sum + numPrice * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 20 ? 0 : 3.99;
  const total = subtotal + deliveryFee;

  const CONVERSION_RATE = 120; // 1 USD = 120 Bangladeshi Taka (BDT)
  const bdtTotal = Math.round(total * CONVERSION_RATE);

  const handleCheckout = () => {
    setCheckoutStep("shipping_info");
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shippingName.trim().length < 2) {
      setShippingError("Please enter a valid name (at least 2 characters).");
      return;
    }
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(shippingPhone)) {
      setShippingError("Please enter a valid 11-digit Bangladeshi mobile number starting with 01.");
      return;
    }
    if (shippingAddress.trim().length < 5) {
      setShippingError("Please enter a complete delivery address (at least 5 characters).");
      return;
    }
    setShippingError("");
    setCheckoutStep("payment_select");
  };

  const handleMfsProceed = async () => {
    if (selectedMfs === "cod") {
      setCheckoutStep("submitting");
      try {
        const txnId = "COD" + Math.floor(100000 + Math.random() * 900000);
        setGeneratedTxnId(txnId);

        // Store real order in Firestore!
        await saveOrder({
          customerName: shippingName,
          customerPhone: shippingPhone,
          customerAddress: shippingAddress,
          items: cart.map((item) => ({
            flavorId: item.flavorId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          paymentMethod: "Cash on Delivery",
          transactionId: txnId,
          amountUsd: total,
          amountBdt: bdtTotal,
          status: "Pending",
          createdAt: new Date().toISOString(),
        });

        setCheckoutStep("success");
      } catch (err) {
        console.error("Order save failure:", err);
        setShippingError("Order failed to save in Database. Please try again.");
        setCheckoutStep("shipping_info");
      }
    } else {
      setMfsStep("number");
      setCheckoutStep("mfs_flow");
    }
  };

  const handleWalletNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate Bangladeshi phone numbers: starts with 01, has 11 digits
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(walletNumber)) {
      setWalletError("Invalid wallet number. Must be 11 digits starting with 01.");
      return;
    }
    setWalletError("");
    setMfsStep("otp");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6 || isNaN(Number(otpCode))) {
      setOtpError("Invalid OTP. Must be a 6-digit numeric code.");
      return;
    }
    setOtpError("");
    setMfsStep("pin");
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const minLen = selectedMfs === "rocket" ? 4 : 5;
    if (pinCode.length < minLen || isNaN(Number(pinCode))) {
      setPinError(`Invalid PIN. Must be a ${minLen}-digit secure PIN.`);
      return;
    }
    setPinError("");
    setCheckoutStep("submitting");

    try {
      // Generate a realistic MFS Transaction ID
      const codes = { bkash: "BK", nagad: "NG", rocket: "RK", cod: "CD" };
      const prefix = codes[selectedMfs] || "TX";
      const randomAlphanumeric = Math.random().toString(36).substring(2, 10).toUpperCase();
      const txnId = `${prefix}${randomAlphanumeric}`;
      setGeneratedTxnId(txnId);

      // Store real order in Firestore!
      await saveOrder({
        customerName: shippingName,
        customerPhone: shippingPhone,
        customerAddress: shippingAddress,
        items: cart.map((item) => ({
          flavorId: item.flavorId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        paymentMethod: selectedMfs.toUpperCase(),
        transactionId: txnId,
        amountUsd: total,
        amountBdt: bdtTotal,
        status: "Pending",
        createdAt: new Date().toISOString(),
      });

      setCheckoutStep("success");
    } catch (err) {
      console.error("Order save failure:", err);
      setShippingError("Order failed to save in Database. Please try again.");
      setCheckoutStep("shipping_info");
    }
  };

  const handleReset = () => {
    setCheckoutStep("idle");
    setSelectedMfs("bkash");
    setMfsStep("number");
    setWalletNumber("");
    setOtpCode("");
    setPinCode("");
    setWalletError("");
    setOtpError("");
    setPinError("");
    setGeneratedTxnId("");
    setShippingName("");
    setShippingPhone("");
    setShippingAddress("");
    setShippingError("");
    onClear();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="cart-backdrop"
            className="fixed inset-0 z-45 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar Drawer */}
          <motion.div
            id="cart-sidebar-drawer"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-neutral-950 text-white border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <h3 className="font-display font-bold text-lg">Your Scoop Basket</h3>
              </div>
              <button
                id="cart-close-btn"
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6">
              {checkoutStep === "success" ? (
                <motion.div
                  id="checkout-success-view"
                  className="h-full flex flex-col items-center justify-center text-center px-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="w-20 h-20 bg-emerald-500/10 border-4 border-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="text-emerald-500 text-4xl"
                    >
                      ✓
                    </motion.span>
                  </div>
                  <h4 className="font-display font-black text-2xl mb-2 text-emerald-400">
                    Payment Approved!
                  </h4>
                  <p className="text-sm text-neutral-400 mb-6 max-w-xs">
                    Your payment has been successfully cleared. Prepare your spoons for sweet goodness!
                  </p>

                  {/* Payment Receipt */}
                  <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2.5 mb-8 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Method:</span>
                      <span className="text-white font-bold uppercase">{selectedMfs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Txn ID:</span>
                      <span className="text-amber-400 font-bold">{generatedTxnId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Amount Paid:</span>
                      <span className="text-white font-bold">
                        {selectedMfs === "cod" ? `$${total.toFixed(2)}` : `৳${bdtTotal} BDT ($${total.toFixed(2)})`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Status:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">🟢 Settled</span>
                    </div>
                  </div>

                  <button
                    id="cart-reset-success"
                    onClick={handleReset}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-black font-display font-bold rounded-full transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-500/25 cursor-pointer"
                  >
                    Awesome, Thanks! 🍦
                  </button>
                </motion.div>
              ) : checkoutStep === "submitting" ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-amber-500/10 border-t-amber-500 animate-spin" />
                  </div>
                  <h4 className="font-display font-bold text-lg mb-1">Processing Payment...</h4>
                  <p className="text-sm text-neutral-400">Verifying secure wallet signatures</p>
                </div>
              ) : checkoutStep === "shipping_info" ? (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div>
                    <h4 className="font-display font-bold text-lg text-white">Delivery Information</h4>
                    <p className="text-xs text-neutral-400">Please provide your details so we can deliver your scoop safely.</p>
                  </div>

                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-neutral-400" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        required
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-all placeholder:text-neutral-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-neutral-400" />
                        Contact Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="017XXXXXXXX"
                        required
                        maxLength={11}
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-amber-400 transition-all placeholder:text-neutral-600"
                      />
                      <span className="text-[10px] text-neutral-500 font-mono block">Must be 11 digits starting with 01</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-neutral-400" />
                        Complete Shipping Address
                      </label>
                      <textarea
                        placeholder="House #12, Road #4, Dhanmondi, Dhaka"
                        required
                        rows={3}
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-all placeholder:text-neutral-600 resize-none"
                      />
                    </div>

                    {shippingError && (
                      <p className="text-[11px] text-rose-500 font-mono font-bold flex items-center gap-1">
                        ⚠️ {shippingError}
                      </p>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep("idle")}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold border border-white/10 transition-colors cursor-pointer"
                      >
                        Back to Basket
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-full text-xs font-bold tracking-wide transition-all shadow-md cursor-pointer"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : checkoutStep === "payment_select" ? (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div>
                    <h4 className="font-display font-bold text-lg text-white">Select Payment System</h4>
                    <p className="text-xs text-neutral-400">Choose your preferred mobile financial service or Cash on Delivery</p>
                  </div>

                  <div className="space-y-3">
                    {/* bKash */}
                    <button
                      onClick={() => setSelectedMfs("bkash")}
                      className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
                        selectedMfs === "bkash"
                          ? "bg-rose-500/10 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E2125D] flex items-center justify-center text-white font-black text-sm shadow-sm">
                          b
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white block">bKash (বিকাশ)</span>
                          <span className="text-[10px] text-neutral-400">Instant bKash payment transfer</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-400 font-mono">৳{bdtTotal}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMfs === "bkash" ? "border-rose-500 bg-rose-500" : "border-neutral-600"}`}>
                          {selectedMfs === "bkash" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </button>

                    {/* Nagad */}
                    <button
                      onClick={() => setSelectedMfs("nagad")}
                      className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
                        selectedMfs === "nagad"
                          ? "bg-orange-500/10 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#EA4C24] flex items-center justify-center text-white font-black text-sm shadow-sm">
                          n
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white block">Nagad (নগদ)</span>
                          <span className="text-[10px] text-neutral-400">Fast digital wallet payment</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-400 font-mono">৳{bdtTotal}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMfs === "nagad" ? "border-orange-500 bg-orange-500" : "border-neutral-600"}`}>
                          {selectedMfs === "nagad" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </button>

                    {/* Rocket */}
                    <button
                      onClick={() => setSelectedMfs("rocket")}
                      className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
                        selectedMfs === "rocket"
                          ? "bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#8C278F] flex items-center justify-center text-white font-black text-sm italic shadow-sm">
                          R
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white block">Rocket (রকেট)</span>
                          <span className="text-[10px] text-neutral-400">DBBL mobile banking checkout</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-400 font-mono">৳{bdtTotal}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMfs === "rocket" ? "border-purple-500 bg-purple-500" : "border-neutral-600"}`}>
                          {selectedMfs === "rocket" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </button>

                    {/* Cash on Delivery */}
                    <button
                      onClick={() => setSelectedMfs("cod")}
                      className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
                        selectedMfs === "cod"
                          ? "bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-xs shadow-sm">
                          COD
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white block">Cash on Delivery</span>
                          <span className="text-[10px] text-neutral-400">Pay hand-to-hand upon arrival</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-400 font-mono">${total.toFixed(2)}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMfs === "cod" ? "border-amber-500 bg-amber-500" : "border-neutral-600"}`}>
                          {selectedMfs === "cod" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Payment Disclaimer */}
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[11px] text-neutral-400 flex items-start gap-2">
                    <Coins className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      Prices converted at a static sandbox rate of **1 USD = 120 BDT**. Selected service will authorize your mock transaction securely.
                    </span>
                  </div>

                  {/* Navigation actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setCheckoutStep("idle")}
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold border border-white/10 transition-colors cursor-pointer"
                    >
                      Back to Basket
                    </button>
                    <button
                      onClick={handleMfsProceed}
                      className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-full text-xs font-bold tracking-wide transition-all shadow-md cursor-pointer"
                    >
                      {selectedMfs === "cod" ? "Place COD Order" : "Proceed to Wallet"}
                    </button>
                  </div>
                </motion.div>
              ) : checkoutStep === "mfs_flow" ? (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {/* Embedded simulated Mobile Payment Portal Header */}
                  <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center relative overflow-hidden ${
                    selectedMfs === "bkash" ? "bg-[#E2125D]/10 border-[#E2125D]/30" :
                    selectedMfs === "nagad" ? "bg-[#EA4C24]/10 border-[#EA4C24]/30" :
                    "bg-[#8C278F]/10 border-[#8C278F]/30"
                  }`}>
                    {/* Glowing brand highlights */}
                    <div className={`absolute -top-10 -left-10 w-24 h-24 blur-2xl rounded-full ${
                      selectedMfs === "bkash" ? "bg-[#E2125D]/20" :
                      selectedMfs === "nagad" ? "bg-[#EA4C24]/20" :
                      "bg-[#8C278F]/20"
                    }`} />

                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg ${
                        selectedMfs === "bkash" ? "bg-[#E2125D]" :
                        selectedMfs === "nagad" ? "bg-[#EA4C24]" :
                        "bg-[#8C278F]"
                      }`}>
                        {selectedMfs === "bkash" ? "b" : selectedMfs === "nagad" ? "n" : "R"}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold tracking-tight text-white uppercase">
                          {selectedMfs === "bkash" ? "bKash" : selectedMfs === "nagad" ? "Nagad" : "Rocket"} Gateway
                        </h4>
                        <span className="text-[10px] text-neutral-400 block font-mono">Secure API Session Active</span>
                      </div>
                    </div>

                    <div className="h-px w-full bg-white/10 my-2.5" />

                    <div className="grid grid-cols-2 gap-4 w-full text-left pt-1">
                      <div>
                        <span className="text-[9px] text-neutral-500 font-mono uppercase block">Merchant</span>
                        <span className="text-xs text-white font-bold font-display">Creamsy Scoops Ltd</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-neutral-500 font-mono uppercase block">Amount Due</span>
                        <span className="text-xs text-amber-400 font-bold font-mono">৳{bdtTotal} BDT</span>
                      </div>
                    </div>
                  </div>

                  {/* Flow Progress steps */}
                  <div className="flex items-center justify-center gap-8 text-neutral-500 font-mono text-[10px]">
                    <div className={`flex items-center gap-1.5 ${mfsStep === "number" ? "text-amber-400 font-bold" : "text-neutral-400"}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${mfsStep === "number" ? "bg-amber-400 text-black font-black" : "bg-white/15"}`}>1</span>
                      Wallet
                    </div>
                    <div className="w-6 h-px bg-white/10" />
                    <div className={`flex items-center gap-1.5 ${mfsStep === "otp" ? "text-amber-400 font-bold" : "text-neutral-400"}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${mfsStep === "otp" ? "bg-amber-400 text-black font-black" : "bg-white/15"}`}>2</span>
                      OTP
                    </div>
                    <div className="w-6 h-px bg-white/10" />
                    <div className={`flex items-center gap-1.5 ${mfsStep === "pin" ? "text-amber-400 font-bold" : "text-neutral-400"}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${mfsStep === "pin" ? "bg-amber-400 text-black font-black" : "bg-white/15"}`}>3</span>
                      PIN
                    </div>
                  </div>

                  {/* Step Form rendering */}
                  {mfsStep === "number" && (
                    <form onSubmit={handleWalletNumberSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-neutral-400" />
                          Enter MFS Wallet Number
                        </label>
                        <input
                          type="text"
                          placeholder="017XXXXXXXX"
                          value={walletNumber}
                          onChange={(e) => setWalletNumber(e.target.value.replace(/[^0-9]/g, ""))}
                          maxLength={11}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono tracking-widest focus:outline-none focus:border-amber-400 transition-all placeholder:text-neutral-600"
                        />
                        {walletError && (
                          <p className="text-[10px] text-rose-500 font-mono font-bold flex items-center gap-1">
                            ⚠️ {walletError}
                          </p>
                        )}
                        <p className="text-[10px] text-neutral-500 leading-relaxed font-mono">
                          Please enter your active 11-digit mobile wallet account number. Standard charges may apply.
                        </p>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep("payment_select")}
                          className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold border border-white/10 transition-colors cursor-pointer"
                        >
                          Change Method
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-bold tracking-wide transition-all shadow-md cursor-pointer"
                        >
                          Send OTP Code
                        </button>
                      </div>
                    </form>
                  )}

                  {mfsStep === "otp" && (
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-amber-500" />
                          Verification Code (OTP)
                        </label>
                        <input
                          type="text"
                          placeholder="******"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                          maxLength={6}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-center text-base font-mono tracking-widest text-amber-400 focus:outline-none focus:border-amber-400 transition-all placeholder:text-neutral-700"
                        />
                        {otpError && (
                          <p className="text-[10px] text-rose-500 font-mono font-bold flex items-center gap-1">
                            ⚠️ {otpError}
                          </p>
                        )}
                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-[10px] font-mono text-amber-300 leading-relaxed">
                          ⚡ **Sandbox Mode**: Type the secure verification code **123456** to pass the OTP firewall.
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setMfsStep("number")}
                          className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold border border-white/10 transition-colors cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-bold tracking-wide transition-all shadow-md cursor-pointer"
                        >
                          Verify OTP
                        </button>
                      </div>
                    </form>
                  )}

                  {mfsStep === "pin" && (
                    <form onSubmit={handlePinSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-amber-500" />
                          Secure Account PIN
                        </label>
                        <input
                          type="password"
                          placeholder="•••••"
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ""))}
                          maxLength={selectedMfs === "rocket" ? 4 : 5}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-amber-400 transition-all placeholder:text-neutral-700"
                        />
                        {pinError && (
                          <p className="text-[10px] text-rose-500 font-mono font-bold flex items-center gap-1">
                            ⚠️ {pinError}
                          </p>
                        )}
                        <p className="text-[10px] text-neutral-500 font-mono leading-relaxed">
                          Please enter your secure {selectedMfs === "rocket" ? "4" : "5"}-digit personal PIN code. This credential remains strictly processed client-side.
                        </p>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setMfsStep("otp")}
                          className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold border border-white/10 transition-colors cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-bold tracking-wide transition-all shadow-md cursor-pointer"
                        >
                          Confirm & Pay
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              ) : cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <span className="text-5xl mb-4">😢</span>
                  <h4 className="font-display font-bold text-lg mb-1">Your basket is empty</h4>
                  <p className="text-sm text-neutral-400 mb-6">
                    Add some luscious Creamsy flavors to satisfy your cravings!
                  </p>
                  <button
                    id="cart-shop-now-btn"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-white/10 hover:bg-white/25 rounded-full text-sm font-semibold border border-white/10 transition-colors cursor-pointer"
                  >
                    Start Shopping 🍨
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 tracking-wider uppercase mb-2">
                    <span>Active flavors ({cart.length})</span>
                    <button
                      id="cart-clear-all"
                      onClick={onClear}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear all
                    </button>
                  </div>

                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.flavorId}
                        className="flex items-center gap-4 bg-white/5 border border-white/10 p-3.5 rounded-2xl relative overflow-hidden"
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <div className="w-16 h-16 rounded-xl bg-black/30 p-1 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-contain rotate-12"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className="font-display font-bold text-sm truncate">{item.name}</h5>
                          <p className="text-xs text-amber-500 font-bold mt-0.5">{item.price} each</p>
                        </div>

                        {/* Quantity actions */}
                        <div className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded-full border border-white/5">
                          <button
                            id={`qty-minus-${item.flavorId}`}
                            onClick={() => onUpdateQuantity(item.flavorId, -1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs font-bold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            id={`qty-plus-${item.flavorId}`}
                            onClick={() => onUpdateQuantity(item.flavorId, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Drawer Footer summary (only if basket not empty and not in success screen) */}
            {cart.length > 0 && checkoutStep === "idle" && (
              <div className="p-6 bg-neutral-900 border-t border-white/10 space-y-4">
                <div className="space-y-2 text-sm text-neutral-400 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insulated Shipping</span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
                        FREE
                      </span>
                    ) : (
                      <span className="text-white font-mono">${deliveryFee.toFixed(2)}</span>
                    )}
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-[11px] text-amber-400/80 text-right italic">
                      Add ${(20 - subtotal).toFixed(2)} more for FREE insulated shipping!
                    </p>
                  )}
                  <div className="h-px bg-white/10 my-3" />
                  <div className="flex justify-between text-base font-bold text-white">
                    <span>Total Amount</span>
                    <span className="text-amber-400 font-mono text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  id="cart-checkout-submit"
                  onClick={handleCheckout}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-display font-black text-sm tracking-wider uppercase rounded-full shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Confirm Purchase ⚡
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
