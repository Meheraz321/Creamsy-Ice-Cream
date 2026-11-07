import { motion } from "motion/react";

interface FloatingDecorationsProps {
  emojis: string[];
}

export default function FloatingDecorations({ emojis }: FloatingDecorationsProps) {
  // Fixed positions in percentages to stay responsive
  const positions = [
    { top: "15%", left: "10%", delay: 0, scale: 1.2 },
    { top: "25%", right: "12%", delay: 0.5, scale: 1.4 },
    { bottom: "18%", left: "15%", delay: 0.8, scale: 1.1 },
    { bottom: "22%", right: "18%", delay: 0.3, scale: 1.3 },
    { top: "50%", left: "5%", delay: 1.1, scale: 1.0 },
  ];

  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
      {emojis.slice(0, positions.length).map((emoji, idx) => {
        const pos = positions[idx];
        return (
          <motion.div
            key={idx}
            className="absolute text-3xl md:text-4xl filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: pos.scale,
              opacity: [0.65, 0.9, 0.65],
              y: [0, -30, 0],
              rotate: [0, 20, -15, 0],
            }}
            transition={{
              scale: { type: "spring", stiffness: 80, damping: 10, delay: pos.delay },
              y: {
                repeat: Infinity,
                duration: 4 + idx * 1.2,
                ease: "easeInOut",
              },
              rotate: {
                repeat: Infinity,
                duration: 6 + idx * 1.5,
                ease: "easeInOut",
              },
              opacity: {
                repeat: Infinity,
                duration: 3 + idx * 1.0,
                ease: "easeInOut",
              },
            }}
          >
            {emoji}
          </motion.div>
        );
      })}
    </div>
  );
}
