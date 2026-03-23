"use client";

import { motion } from "framer-motion";

interface NeuralOrbProps {
  letter: "Z" | "İ" | "H" | "N";
  className?: string;
}

export default function NeuralOrb({ letter, className = "" }: NeuralOrbProps) {
  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      animate={{
        x: [0, 16, -12, 10, 0],
        y: [0, -10, 12, -8, 0],
        opacity: [0.86, 0.98, 0.9, 1, 0.86],
      }}
      transition={{
        duration: 14,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="relative flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/70 bg-cyan-500/20 shadow-[0_0_18px_rgba(34,211,238,0.65),inset_0_0_16px_rgba(34,211,238,0.25)] sm:h-14 sm:w-14 md:h-[60px] md:w-[60px]"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.span
          className="font-mono text-lg font-semibold tracking-[0.2em] text-cyan-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.95)] sm:text-xl md:text-2xl"
          animate={{
            x: [0, 0, 1.6, -1.6, 0],
            opacity: [1, 1, 0.35, 1, 1],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.78, 0.83, 0.88, 1],
          }}
        >
          {letter}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

