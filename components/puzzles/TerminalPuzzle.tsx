"use client";

import { useCallback, useState } from "react";

export interface TerminalPuzzleProps {
  onSolve: () => void;
  onWrong?: () => void;
}

const EXPECTED = "override";

export default function TerminalPuzzle({ onSolve, onWrong }: TerminalPuzzleProps) {
  const [value, setValue] = useState("");
  const [line, setLine] = useState<string | null>(null);

  const submit = useCallback(() => {
    const v = value.trim().toLowerCase();
    if (v === EXPECTED) {
      setLine(null);
      onSolve();
    } else {
      setLine("> ACCESS DENIED: invalid authorization token.");
      onWrong?.();
    }
  }, [value, onSolve, onWrong]);

  return (
    <div className="space-y-4">
      <div
        className="rounded-lg border border-emerald-500/40 bg-black px-4 py-5 font-mono text-sm shadow-[0_0_32px_rgba(16,185,129,0.12)] sm:px-5 sm:py-6 sm:text-base"
        role="region"
        aria-label="Terminal"
      >
        <p className="mb-1 text-[10px] tracking-[0.25em] text-emerald-500/35">
          [MEM.FRAG] H
        </p>
        <p className="mb-4 text-emerald-400/95 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
          Sistem kilitli. Yetki kodunu girin:
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="shrink-0 text-emerald-500/80">&gt;</span>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setLine(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
            autoComplete="off"
            autoFocus
            spellCheck={false}
            className="min-h-[48px] flex-1 touch-manipulation border-b border-emerald-600/50 bg-transparent px-2 py-2 text-sm text-emerald-300 caret-emerald-400 outline-none placeholder:text-emerald-800 focus:border-emerald-400 sm:min-h-[44px] sm:text-base"
            placeholder="komut"
            aria-label="Terminal girişi"
          />
        </div>
        {line && (
          <p className="mt-3 text-xs text-red-400/90 sm:text-sm" role="alert">
            {line}
          </p>
        )}
        <p className="mt-4 text-xs text-emerald-600/80">Enter ile gönder</p>
      </div>
    </div>
  );
}
