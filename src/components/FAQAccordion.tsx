import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle, ArrowLeft, Send, Check } from "lucide-react";
import { FAQS } from "../data";

interface FAQAccordionProps {
  onNavigate?: (page: string) => void;
}

export default function FAQAccordion({ onNavigate }: FAQAccordionProps) {
  const [faqList, setFaqList] = useState(FAQS);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    // Simulate auto-responding or publishing the question immediately!
    const newFaq = {
      question: customQuestion.trim(),
      answer: "Thanks for asking! Our master scoopers have received your query at " + (customEmail || "your email") + " and will send a detailed recipe review within 30 minutes. Stay frosty! 🍦"
    };

    setFaqList([...faqList, newFaq]);
    setOpenIndex(faqList.length); // open the newly added question!
    setCustomQuestion("");
    setCustomEmail("");
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
  };

  return (
    <section id="faq" className="py-24 bg-teal-950 text-white relative overflow-hidden min-h-screen">
      {/* Decorative vectors */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-neutral-900 to-transparent opacity-50" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-[#004d40]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Back navigation button if onNavigate is provided */}
        {onNavigate && (
          <motion.button
            id="faq-back-home"
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
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#80cbc4] bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Curiosity & Scoops
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-display font-black tracking-tight mt-4 mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            FAQ's
          </motion.h2>
          <motion.p
            className="text-teal-200/60 text-sm md:text-base leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Got questions about our gourmet cups? Here is everything you need to know before your next spoonful arrives.
          </motion.p>
        </div>

        {/* Accordions */}
        <div className="space-y-4 max-w-3xl mx-auto mb-16">
          {faqList.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={idx}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? "bg-[#004d40] border-[#00796b]/50 shadow-lg shadow-black/10"
                    : "bg-[#002d24] border-white/5 hover:border-white/10 hover:bg-[#00382c]"
                }`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                {/* Accordion trigger header */}
                <button
                  id={`faq-trigger-${idx}`}
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4 text-[#80cbc4]" />
                    </div>
                    <span className="font-display font-bold text-sm md:text-base leading-snug text-teal-50">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="ml-4 p-1.5 rounded-full bg-white/5 text-teal-200"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Accordion content body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-6 md:px-6 md:pb-7 text-teal-100/80 text-xs md:text-sm leading-relaxed border-t border-white/5 pt-4 font-medium pl-14">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Question Form Stacked */}
        <div className="max-w-3xl mx-auto bg-[#002d24]/60 p-6 md:p-8 rounded-3xl border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">💬</span>
            <div>
              <h3 className="font-display font-black text-xl text-teal-50">Still Have Questions?</h3>
              <p className="text-xs text-teal-200/50">Send us a message and our active gourmet scoopers will answer instantly.</p>
            </div>
          </div>

          <form onSubmit={handleAskQuestion} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-200/60 block mb-1">
                  Your email address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-teal-950 border border-white/10 text-white placeholder-teal-800 text-xs focus:outline-none focus:border-[#80cbc4] transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-200/60 block mb-1">
                  Your question (published instantly!)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Do you ship to California? 📦"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-teal-950 border border-white/10 text-white placeholder-teal-800 text-xs focus:outline-none focus:border-[#80cbc4] transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              {submitSuccess ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Question published successfully to our accordion!
                </span>
              ) : (
                <span className="text-xs text-teal-200/40">Note: Questions are instantly answered with AI help!</span>
              )}
              <button
                type="submit"
                className="px-6 py-3 bg-[#80cbc4] hover:bg-teal-300 text-black font-display font-black text-xs uppercase tracking-wider rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                Ask Question
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}
