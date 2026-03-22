"use client";

import { useGameUi } from "@/components/GameVisualThemeProvider";
import { useState } from "react";

export interface SliderPuzzleProps {
  onSolve: () => void;
  onWrong?: () => void;
}

const LABELS = ["Alfa", "Beta", "Teta", "Delta"] as const;
const TARGETS: [number, number, number, number] = [45, 15, 60, 30];
const TOTAL_MHZ = 150;

export default function SliderPuzzle({ onSolve, onWrong }: SliderPuzzleProps) {
  const { ui } = useGameUi();
  const er = ui.escapeRoom;
  const [values, setValues] = useState([30, 25, 50, 45]);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    setError(null);
    const ok =
      values[0] === TARGETS[0] &&
      values[1] === TARGETS[1] &&
      values[2] === TARGETS[2] &&
      values[3] === TARGETS[3];

    if (ok) {
      onSolve();
    } else {
      setError(
        "UYUMSUZLUK: BAĞLANTI REDDEDİLDİ. TEKRAR DENEYİN."
      );
      onWrong?.();
    }
  }

  return (
    <div className="space-y-6 rounded-xl border border-cyan-500/35 bg-slate-950/90 p-4 shadow-[0_0_40px_rgba(6,182,212,0.08)] sm:p-6">
      <p className="text-center text-sm text-cyan-200/90">
        Nöral frekansları {TOTAL_MHZ} MHz toplam kapasiteye göre dengeleyin.
      </p>
      <div className="space-y-5">
        {LABELS.map((label, i) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-cyan-500/80 sm:text-sm">
              <span>{label}</span>
              <span className="font-mono tabular-nums text-cyan-300">
                {values[i]} MHz
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={values[i]}
              onChange={(e) => {
                const n = Number(e.target.value);
                setValues((prev) => {
                  const next = [...prev];
                  next[i] = n;
                  return next;
                });
                setError(null);
              }}
              className="h-3 w-full cursor-pointer touch-manipulation appearance-none rounded-full bg-slate-800 accent-cyan-400 sm:h-2 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(34,211,238,0.8)] sm:[&::-webkit-slider-thumb]:h-4 sm:[&::-webkit-slider-thumb]:w-4"
              aria-label={`${label} frekansı`}
            />
          </div>
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className="px-2 py-2 text-center text-xs font-semibold uppercase leading-snug tracking-wide text-red-400 sm:px-3 sm:text-sm md:text-base md:tracking-wider"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        className={`min-h-[52px] w-full touch-manipulation rounded-xl border-2 border-zinc-600/55 bg-slate-900/60 px-4 py-3 text-center text-base font-semibold text-zinc-100 shadow-sm shadow-black/25 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/90 hover:bg-cyan-500/[0.12] hover:text-cyan-50 hover:shadow-[0_0_18px_rgba(34,211,238,0.45),0_0_28px_rgba(6,182,212,0.25)] active:scale-[0.98] sm:min-h-[56px] sm:px-6 sm:py-4 md:text-lg`}
      >
        SENKRONİZASYONU BAŞLAT
      </button>
    </div>
  );
}
