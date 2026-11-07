import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Quote, ArrowLeft, Send, Check } from "lucide-react";
import { REVIEWS } from "../data";

interface TestimonialsProps {
  onNavigate?: (page: string) => void;
}

export default function Testimonials({ onNavigate }: TestimonialsProps) {
  const [reviewsList, setReviewsList] = useState(REVIEWS);
  const [customName, setCustomName] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [customRating, setCustomRating] = useState(5);
  const [customText, setCustomText] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customText.trim()) return;

    const newReview = {
      id: "review_" + Date.now(),
      name: customName.trim(),
      role: customRole.trim() || "Flavor Connoisseur",
      rating: customRating,
      text: customText.trim()
    };

    setReviewsList([...reviewsList, newReview]);
    setCustomName("");
    setCustomRole("");
    setCustomText("");
    setCustomRating(5);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 2500);
  };

  return (
    <section id="reviews" className="py-24 bg-[#FAF6F0] text-neutral-900 relative overflow-hidden min-h-screen">
      {/* Wave top border transition */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Back navigation button if onNavigate is provided */}
        {onNavigate && (
          <motion.button
            id="reviews-back-home"
            onClick={() => onNavigate("home")}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-neutral-900/5 hover:bg-neutral-900/10 text-neutral-700 hover:text-black transition-all text-xs font-mono font-bold border border-neutral-900/10 cursor-pointer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Main Stage</span>
          </motion.button>
        )}

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#004d40] bg-[#004d40]/5 px-3 py-1.5 rounded-full border border-[#004d40]/10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Spreading Smiles
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-display font-black tracking-tight mt-4 mb-4 text-neutral-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Loved By Ice Cream Fans
          </motion.h2>
          <motion.p
            className="text-neutral-600 text-sm md:text-base leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Don't just take our word for it—see what our passionate sweet scoop lovers have to say!
          </motion.p>
        </div>

        {/* Testimonials Grid with playful tilt angles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <AnimatePresence initial={false}>
            {reviewsList.map((review, idx) => {
              // Apply a slight alternating tilt angle to match the playful aesthetic in the video
              const tilts = ["-rotate-1 group-hover:rotate-1", "rotate-1 group-hover:-rotate-1", "-rotate-2 group-hover:-rotate-1"];
              const tiltClass = tilts[idx % tilts.length];

              return (
                <motion.div
                  key={review.id}
                  className={`group relative bg-white border border-neutral-200/60 p-8 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.02)] transition-all flex flex-col justify-between ${tiltClass}`}
                  initial={{ opacity: 0, scale: 0.95, y: 25 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Quote Accent icon */}
                  <div className="absolute top-6 right-8 text-neutral-100 group-hover:text-[#004d40]/10 transition-colors pointer-events-none">
                    <Quote className="w-12 h-12 fill-current" />
                  </div>

                  <div>
                    {/* Stars rating */}
                    <div className="flex items-center gap-1 mb-5 text-amber-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-neutral-700 font-sans italic text-sm md:text-base leading-relaxed relative z-10 mb-6">
                      "{review.text}"
                    </p>
                  </div>

                  {/* Reviewer Details */}
                  <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-display font-black text-sm text-[#004d40]">
                      {review.name[0]}
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-xs md:text-sm text-neutral-900 leading-none mb-1">
                        {review.name}
                      </h5>
                      <span className="text-[10px] md:text-xs font-mono font-medium text-neutral-400">
                        {review.role}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Live Feedback Creator Form Panel */}
        <div className="max-w-xl mx-auto bg-white border border-neutral-200/80 p-6 md:p-8 rounded-3xl shadow-lg relative">
          <div className="flex items-center gap-3 mb-6 border-b border-neutral-100 pb-4">
            <span className="text-2xl">✍️</span>
            <div>
              <h3 className="font-display font-black text-lg text-neutral-900">Share Your Experience</h3>
              <p className="text-xs text-neutral-400">Add your signature star rating and tell us how your sweet cup tasted.</p>
            </div>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Diana Prince"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-400 text-xs focus:outline-none focus:border-[#004d40] focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Your Role / Profession
                </label>
                <input
                  type="text"
                  placeholder="Gourmet Foodie"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-400 text-xs focus:outline-none focus:border-[#004d40] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Stars rating selector */}
            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Choose Star Rating ({customRating} Stars)
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => {
                  const isGold = val <= customRating;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCustomRating(val)}
                      className="text-2xl hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${isGold ? "fill-amber-400 text-amber-400" : "text-neutral-300"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Your Review Text
              </label>
              <textarea
                required
                rows={3}
                placeholder="Absolutely incredible! The grass-fed cream is velvety and the packaging keeps it frozen solid..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-400 text-xs focus:outline-none focus:border-[#004d40] focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-2 border-t border-neutral-100">
              {submitSuccess ? (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Published instantly to the feed!
                </span>
              ) : (
                <span className="text-[10px] text-neutral-400">Join 12,000+ happy customers.</span>
              )}
              <button
                type="submit"
                className="px-6 py-3 bg-[#004d40] hover:bg-[#002d24] text-white font-display font-black text-xs uppercase tracking-wider rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Review
              </button>
            </div>
          </form>
        </div>

        {/* Client-centric Smile Icon below */}
        <div className="flex justify-center mt-12">
          <motion.span
            className="text-4xl text-[#004d40]/40"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            ☺
          </motion.span>
        </div>
      </div>
    </section>
  );
}
