"use client";

import { useEffect, useRef, useState } from "react";

export interface SliderPuzzleProps {
  onSolve: () => void;
  target?: number;
}

const LABELS = ["Alfa", "Beta", "Teta"] as const;

export default function SliderPuzzle({ onSolve, target = 50 }: SliderPuzzleProps) {
  const [values, setValues] = useState([22, 78, 35]);
  const solvedRef = useRef(false);

  useEffect(() => {
    if (solvedRef.current) return;
    const ok = values.every((v) => v === target);
    if (ok) {
      solvedRef.current = true;
      onSolve();
    }
  }, [values, target, onSolve]);

  return (
    <div className="space-y-6 rounded-xl border border-cyan-500/35 bg-slate-950/90 p-4 shadow-[0_0_40px_rgba(6,182,212,0.08)] sm:p-6">
      <p className="text-center text-sm text-cyan-200/90">
        Nöral frekansları{" "}
        <span className="font-mono font-bold text-cyan-400">{target}</span>% değerine kilitleyin.
      </p>
      <div className="space-y-5">
        {LABELS.map((label, i) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-cyan-500/80 sm:text-sm">
              <span>{label}</span>
              <span className="font-mono tabular-nums text-cyan-300">{values[i]}%</span>
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
              }}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(34,211,238,0.8)]"
              aria-label={`${label} frekansı`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
