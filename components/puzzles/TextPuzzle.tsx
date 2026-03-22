"use client";

import { isCorrectAnswer } from "@/lib/rooms";
import { useCallback, useState } from "react";

export interface TextPuzzleProps {
  answer: string;
  onSolve: () => void;
  onWrong?: () => void;
}

const WRONG_MSG =
  "GEÇERSİZ ÇIKIŞ KODU. SİLİNME İŞLEMİ BAŞLATILIYOR...";

export default function TextPuzzle({
  answer,
  onSolve,
  onWrong,
}: TextPuzzleProps) {
  const [value, setValue] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);
      const trimmed = value.trim();
      if (!trimmed) return;

      if (isCorrectAnswer({ answer }, trimmed)) {
        onSolve();
      } else {
        setSubmitError(WRONG_MSG);
        setValue("");
        onWrong?.();
      }
    },
    [answer, value, onSolve, onWrong]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="cyber-text-puzzle-input" className="sr-only">
          Sistem kodu
        </label>
        <input
          id="cyber-text-puzzle-input"
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSubmitError(null);
          }}
          placeholder="_SİSTEM KODUNU GİRİN..."
          autoComplete="off"
          autoFocus
          spellCheck={false}
          className="w-full touch-manipulation rounded-xl border-2 border-cyan-500/50 bg-slate-900/80 p-6 text-center font-mono text-2xl uppercase tracking-widest text-cyan-400 transition-all placeholder:text-cyan-900/50 focus:border-cyan-400 focus:shadow-[0_0_25px_rgba(34,211,238,0.5)] focus:outline-none md:text-3xl"
          aria-invalid={!!submitError}
          aria-describedby={submitError ? "text-puzzle-error" : undefined}
        />
        {submitError ? (
          <p
            id="text-puzzle-error"
            role="alert"
            className="mt-3 text-center text-sm font-semibold uppercase tracking-wide text-red-400 sm:text-base"
          >
            {submitError}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={!value.trim()}
        className="mt-4 min-h-[56px] w-full touch-manipulation rounded-xl border-2 border-zinc-600/55 bg-slate-900/60 px-6 py-4 text-center text-base font-semibold text-zinc-100 shadow-sm shadow-black/25 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/90 hover:bg-cyan-500/[0.12] hover:text-cyan-50 hover:shadow-[0_0_18px_rgba(34,211,238,0.45),0_0_28px_rgba(6,182,212,0.25)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 md:text-lg"
      >
        KODU ONAYLA VE SİSTEME GİR
      </button>
    </form>
  );
}
