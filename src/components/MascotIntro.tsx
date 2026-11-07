import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MASCOT_IMAGE, FLAVORS } from "../data";

interface MascotIntroProps {
  onComplete: () => void;
}

export default function MascotIntro({ onComplete }: MascotIntroProps) {
  const [stage, setStage] = useState<"rings" | "mascot" | "cups" | "exit">("rings");

  useEffect(() => {
    // Stage 1: Pulsating rings (0 to 1.2s)
    const t1 = setTimeout(() => {
      setStage("mascot");
    }, 1200);

    // Stage 2: Mascot appears and then cups spring around it (1.2s to 2.8s)
    const t2 = setTimeout(() => {
      setStage("cups");
    }, 2500);

    // Stage 3: Smooth transition and complete
    const t3 = setTimeout(() => {
      setStage("exit");
    }, 5500);

    const t4 = setTimeout(() => {
      onComplete();
    }, 6200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  // Coordinates for placing 5 cups in a circle around the mascot
  const getCircleCoords = (index: number, total: number, radius: number) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2; // Start from top
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <AnimatePresence>
      {stage !== "exit" && (
        <motion.div
          id="mascot-intro-screen"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* STAGE 1: CONCENTRIC RIPPLE RINGS */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {stage === "rings" && (
              <>
                {/* Outermost red ring */}
                <motion.div
                  className="absolute rounded-full border border-orange-500/25 bg-red-600/10"
                  style={{ width: 650, height: 650 }}
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.9, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                />
                {/* Middle Orange ring */}
                <motion.div
                  className="absolute rounded-full border border-orange-500/40 bg-orange-500/20"
                  style={{ width: 450, height: 450 }}
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0.95, 0.7] }}
                  transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut", delay: 0.1 }}
                />
                {/* Inner Red ring */}
                <motion.div
                  className="absolute rounded-full border border-red-500/60 bg-red-600/40"
                  style={{ width: 280, height: 280 }}
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                />
                {/* Center black core */}
                <motion.div
                  className="absolute rounded-full bg-black shadow-2xl"
                  style={{ width: 120, height: 120 }}
                  initial={{ scale: 0.1 }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                />
              </>
            )}
          </div>

          {/* STAGE 2 & 3: MASCOT & SPRINGING ICE CREAM CUPS */}
          <div className="relative flex flex-col items-center justify-center">
            {/* The Mascot */}
            <AnimatePresence>
              {(stage === "mascot" || stage === "cups") && (
                <motion.div
                  id="intro-mascot-logo"
                  className="relative z-10 flex flex-col items-center justify-center"
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                  <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-neutral-900 border-4 border-orange-500 p-2 overflow-hidden flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.3)]">
                    <img
                      src={MASCOT_IMAGE}
                      alt="Creamsy Mascot"
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Styled Badge Title like "Creamsy" in video */}
                  <motion.div
                    className="mt-6 bg-amber-500 text-black font-display font-black text-2xl md:text-3xl px-8 py-2 rounded-full tracking-wider shadow-lg uppercase border-2 border-white flex items-center gap-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    🍨 Creamsy
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Circular Cups spring around mascot */}
            <AnimatePresence>
              {stage === "cups" && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  {FLAVORS.map((flavor, index) => {
                    const coords = getCircleCoords(index, FLAVORS.length, 210);
                    return (
                      <motion.div
                        key={flavor.id}
                        className="absolute flex flex-col items-center justify-center"
                        style={{
                          left: "50%",
                          top: "50%",
                          marginLeft: -48, // offset half width (96px/2)
                          marginTop: -48,  // offset half height
                        }}
                        initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                        animate={{
                          x: coords.x,
                          y: coords.y,
                          scale: 1,
                          opacity: 1,
                        }}
                        exit={{ x: coords.x * 1.5, y: coords.y * 1.5, scale: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 12,
                          delay: index * 0.15,
                        }}
                      >
                        <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                          <img
                            src={flavor.image}
                            alt={flavor.name}
                            className="w-20 h-20 object-contain drop-shadow-md rotate-12"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        {/* Tiny Badge */}
                        <span className="mt-1 px-2 py-0.5 rounded-full bg-black/75 text-white font-display font-medium text-[10px] whitespace-nowrap border border-white/10">
                          {flavor.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Skip button in top corner */}
          <button
            id="intro-skip-btn"
            onClick={() => {
              setStage("exit");
              onComplete();
            }}
            className="absolute top-6 right-6 z-30 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-display text-sm font-semibold rounded-full border border-white/20 transition-all cursor-pointer"
          >
            Skip Intro ⚡
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
