import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Heart, Instagram, ArrowLeft, Plus, Check, X } from "lucide-react";
import { MOMENTS } from "../data";

interface MomentsProps {
  onNavigate?: (page: string) => void;
}

export default function Moments({ onNavigate }: MomentsProps) {
  const [momentsList, setMomentsList] = useState(MOMENTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [handle, setHandle] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // A list of gorgeous, pre-curated happy ice-cream unsplash templates for selection
  const photoOptions = [
    "https://images.unsplash.com/photo-1501443715934-62488a758605?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1580915411954-282cb1b05b80?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1517093157656-b9ecdf160904?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&q=80&w=600"
  ];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle || !caption) return;

    const newMoment = {
      id: "moment_" + Date.now(),
      imageUrl: photoOptions[selectedPhotoIdx],
      tags: ["#CreamsyJoy", `#${caption.trim().replace(/\s+/g, "")}`, `#${handle.trim().replace("@", "")}`]
    };

    setMomentsList([newMoment, ...momentsList]);
    setUploadSuccess(true);
    setHandle("");
    setCaption("");
    setTimeout(() => {
      setUploadSuccess(false);
      setIsFormOpen(false);
    }, 1800);
  };

  const polaroids = [
    {
      id: "p1",
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400",
      caption: "Mint Choco rocks! 🍃",
      user: "@sarah.bites",
      tilt: "-rotate-3 hover:-rotate-1"
    },
    {
      id: "p2",
      image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=400",
      caption: "Double scoop weekend 🍦",
      user: "@jacob.scoops",
      tilt: "rotate-6 hover:rotate-2"
    },
    {
      id: "p3",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400",
      caption: "Mango Delight pure bliss ✨",
      user: "@lilly.sweet",
      tilt: "-rotate-6 hover:-rotate-2"
    }
  ];

  return (
    <div id="moments" className="min-h-screen bg-neutral-900 text-white">
      {/* SECTION 3: MOMENTS MADE WITH CREAMSY */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Back navigation button if onNavigate is provided */}
          {onNavigate && (
            <motion.button
              id="moments-back-home"
              onClick={() => onNavigate("home")}
              className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all text-xs font-mono font-bold border border-white/10 cursor-pointer animate-fade-in"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Main Stage</span>
            </motion.button>
          )}

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 relative">
            <motion.div
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.2em] text-pink-400 bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-500/25"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@creamsy.scoops</span>
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-display font-black tracking-tight mt-4 mb-4 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Moments Made With Creamsy
            </motion.h2>
            <motion.p
              className="text-neutral-400 text-sm md:text-base leading-relaxed mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Want to be featured? Share your happy scoop on Instagram with <span className="text-pink-400 font-bold">#CreamsyJoy</span> to join the family!
            </motion.p>

            {/* Upload Call To Action Button */}
            <motion.button
              id="trigger-moment-upload"
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-display font-black text-xs uppercase tracking-wider rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Camera className="w-4 h-4" />
              Post Your Happy Scoop
            </motion.button>
          </div>

          {/* Interactive Modal form */}
          <AnimatePresence>
            {isFormOpen && (
              <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-md">
                <motion.div
                  className="bg-neutral-950 border border-white/10 w-full max-w-md rounded-3xl overflow-hidden p-6 relative shadow-2xl"
                  initial={{ scale: 0.9, opacity: 0, y: 40 }}
                  animate={{ scale: 1, opacity: 0 || 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 40 }}
                >
                  <button
                    id="close-upload-modal"
                    onClick={() => setIsFormOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {uploadSuccess ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>
                      <h4 className="font-display font-black text-xl text-white mb-2">Scoop Posted Successfully!</h4>
                      <p className="text-xs text-neutral-400">Your happy moment is now live in our community gallery.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleUploadSubmit} className="space-y-4">
                      <div>
                        <h4 className="font-display font-black text-xl text-white mb-1 flex items-center gap-2">
                          <Camera className="w-5 h-5 text-pink-400" />
                          Share your scoop
                        </h4>
                        <p className="text-xs text-neutral-400">Post a simulated scoop photo to our active moments feed.</p>
                      </div>

                      {/* Photo Selector */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                          Select Scoop Photograph
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {photoOptions.map((url, index) => {
                            const isSel = selectedPhotoIdx === index;
                            return (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedPhotoIdx(index)}
                                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all relative cursor-pointer ${
                                  isSel ? "border-pink-500 scale-95 shadow-md shadow-pink-500/10" : "border-white/10 opacity-60 hover:opacity-100"
                                }`}
                              >
                                <img src={url} alt="Scoop choice" className="w-full h-full object-cover" />
                                {isSel && (
                                  <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-white stroke-[3]" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                            Your @InstagramHandle
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="@clara.eats"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-pink-500 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                            Scoop Caption / Tag
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Berry delicious summer scoop! 🍓"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-pink-500 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white text-xs font-display font-black uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        Publish to Feed 🚀
                      </button>
                    </form>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Grid Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence initial={false}>
              {momentsList.map((item, idx) => (
                <motion.div
                  key={item.id}
                  className="relative group rounded-3xl overflow-hidden aspect-[4/5] bg-neutral-950 border border-white/10"
                  initial={{ opacity: 0, scale: 0.92, y: 25 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -6 }}
                >
                  {/* Image */}
                  <img
                    src={item.imageUrl}
                    alt="Creamsy Happy Moment"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Hover overlay details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    {/* Hearts indicator */}
                    <div className="flex items-center gap-1.5 text-pink-500 font-display font-extrabold text-xs mb-3">
                      <Heart className="w-4 h-4 fill-pink-500" />
                      <span>Loved by hundreds</span>
                    </div>

                    {/* Hash tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-mono font-semibold bg-white/10 text-white px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SECTION 4: JOY THAT TRAVELS WITH YOU (POLAROIDS) */}
      <section className="py-24 bg-[#EADCC9] text-neutral-900 relative overflow-hidden border-t border-black/5">
        {/* Soft background lighting */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left promo callout */}
            <div className="max-w-md text-center lg:text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2 block">
                Travel Companion
              </span>
              <h3 className="font-display font-black text-3xl md:text-4xl tracking-tight mb-4 text-neutral-900">
                Joy That Travels With You
              </h3>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-6">
                Our custom-engineered thermal cups lock in peak sub-zero temperatures, meaning you can pack a box, throw it in your backpack, and scoop fresh velvet cream at any picnic, beach, or road trip.
              </p>
              <div className="flex justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2 bg-neutral-900/5 px-4 py-2 rounded-full border border-neutral-900/10 font-display text-xs font-bold">
                  <span>❄️ 3 Hour Deep Chill</span>
                </div>
                <div className="flex items-center gap-2 bg-neutral-900/5 px-4 py-2 rounded-full border border-neutral-900/10 font-display text-xs font-bold">
                  <span>🍃 Eco-Safe Paper</span>
                </div>
              </div>
            </div>

            {/* Right Polaroids Grid (floating elements) */}
            <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10 pt-4 relative">
              {polaroids.map((p, idx) => (
                <motion.div
                  key={p.id}
                  className={`bg-white p-4 pb-6 rounded-sm shadow-[0_12px_24px_rgba(0,0,0,0.08)] border border-neutral-200/40 w-44 md:w-52 ${p.tilt} cursor-pointer transition-all`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -10, scale: 1.05, shadow: "0_20px_35px_rgba(0,0,0,0.12)" }}
                >
                  {/* Picture frame */}
                  <div className="aspect-square bg-neutral-100 rounded-sm overflow-hidden mb-4 border border-neutral-200">
                    <img
                      src={p.image}
                      alt="Polaroid snapshot"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Caption & User */}
                  <p className="font-display font-extrabold text-xs md:text-sm text-neutral-800 leading-tight mb-1 text-center font-handwriting">
                    "{p.caption}"
                  </p>
                  <p className="text-[10px] font-mono text-neutral-400 text-center">
                    {p.user}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
