"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface MatrixPuzzleProps {
  onSolve: () => void;
}

const SIZE = 9;
const DIM_COUNT = 3;

function pickRandomDimIndices(): number[] {
  const idx = Array.from({ length: SIZE }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, DIM_COUNT);
}

export default function MatrixPuzzle({ onSolve }: MatrixPuzzleProps) {
  const [active, setActive] = useState<boolean[] | null>(null);
  const solvedRef = useRef(false);

  useEffect(() => {
    setActive(() => {
      const dim = new Set(pickRandomDimIndices());
      return Array.from({ length: SIZE }, (_, i) => !dim.has(i));
    });
  }, []);

  useEffect(() => {
    if (!active || solvedRef.current) return;
    if (active.every(Boolean)) {
      solvedRef.current = true;
      onSolve();
    }
  }, [active, onSolve]);

  const handleCell = useCallback((i: number) => {
    if (!active || solvedRef.current) return;
    setActive((prev) => {
      if (!prev || prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });
  }, [active]);

  if (!active) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-cyan-500/30 bg-slate-950/80">
        <p className="text-sm text-cyan-500/70">Matris yükleniyor…</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-cyan-200/85">
        Sonuk hucrelere dokunarak tum sinapslari{" "}
        <span className="text-cyan-400">aktif</span> yapin.
      </p>
      <div
        className="mx-auto grid max-w-xs grid-cols-3 gap-2 sm:max-w-sm sm:gap-3"
        role="grid"
        aria-label="Sinaps matrisi"
      >
        {active.map((on, i) => (
          <button
            key={i}
            type="button"
            role="gridcell"
            onClick={() => handleCell(i)}
            disabled={on}
            className={
              on
                ? "min-h-[52px] rounded-lg border-2 border-cyan-400/70 bg-cyan-500/20 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all sm:min-h-[60px]"
                : "min-h-[52px] rounded-lg border-2 border-slate-700 bg-slate-900/80 text-slate-600 transition-all hover:border-cyan-600/50 hover:bg-slate-800 active:scale-[0.98] sm:min-h-[60px]"
            }
            aria-pressed={on}
            aria-label={on ? `Hücre ${i + 1} aktif` : `Hücre ${i + 1} sönük`}
          >
            <span className="text-lg font-mono" aria-hidden>
              {on ? "◆" : "○"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
