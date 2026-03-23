"use client";

import { isCorrectFinalCode } from "@/lib/rooms";
import { useMemo, useState } from "react";

export interface TripleEncryptionTerminalProps {
  onSolve: () => void;
  onWrong?: () => void;
}

type Phase = 1 | 2 | 3;

const TARGET_WORD = "ZİHİN";
const KEYPAD_TARGET = "150";
const LOGIC_OPTIONS = ["AND", "OR", "NOT"] as const;

export default function TripleEncryptionTerminal({
  onSolve,
  onWrong,
}: TripleEncryptionTerminalProps) {
  const [phase, setPhase] = useState<Phase>(1);
  const [logicPick, setLogicPick] = useState<string[]>([]);
  const [pin, setPin] = useState("");
  const [word, setWord] = useState("");
  const [error, setError] = useState<string | null>(null);

  const logicSequence = useMemo(() => ["AND", "NOT", "OR"], []);

  function fail(message: string) {
    setError(message);
    onWrong?.();
  }

  function handleLogicPick(op: (typeof LOGIC_OPTIONS)[number]) {
    if (phase !== 1) return;
    const next = [...logicPick, op];
    setLogicPick(next);
    setError(null);

    const idx = next.length - 1;
    if (logicSequence[idx] !== op) {
      setLogicPick([]);
      fail("MANTIK KAPISI HATASI: ŞİFRELEME SIFIRLANDI.");
      return;
    }

    if (next.length === logicSequence.length) {
      setPhase(2);
    }
  }

  function pressKey(k: string) {
    if (phase !== 2) return;
    setError(null);
    if (k === "C") {
      setPin("");
      return;
    }
    if (k === "OK") {
      if (pin === KEYPAD_TARGET) {
        setPhase(3);
      } else {
        setPin("");
        fail("NUMERİK ANAHTAR REDDEDİLDİ.");
      }
      return;
    }
    if (pin.length >= 6) return;
    setPin((p) => p + k);
  }

  function submitWord(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!word.trim()) return;
    if (isCorrectFinalCode(TARGET_WORD, word)) {
      onSolve();
      return;
    }
    setWord("");
    fail("SON ANAHTAR HATALI: ERİŞİM ENGELLENDİ.");
  }

  return (
    <div className="space-y-5 rounded-xl border border-cyan-500/35 bg-slate-950/90 p-4 shadow-[0_0_40px_rgba(6,182,212,0.08)] sm:p-6">
      <p className="text-center text-xs uppercase tracking-[0.22em] text-cyan-400/80">
        Triple Encryption Terminal
      </p>

      {phase === 1 && (
        <div className="space-y-4">
          <p className="text-center text-sm text-cyan-200/90">
            Faz 1: Mantık kapılarını doğru sırayla seçin.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {LOGIC_OPTIONS.map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => handleLogicPick(op)}
                className="min-h-[52px] touch-manipulation rounded-lg border border-cyan-500/45 bg-slate-900/75 font-mono text-cyan-300 transition-all hover:border-cyan-300 hover:bg-cyan-500/10"
              >
                {op}
              </button>
            ))}
          </div>
          <p className="text-center font-mono text-xs tracking-[0.2em] text-cyan-500/80">
            {logicPick.join(" > ") || "_"}
          </p>
        </div>
      )}

      {phase === 2 && (
        <div className="space-y-4">
          <p className="text-center text-sm text-cyan-200/90">
            Faz 2: Sayısal kilidi çözün.
          </p>
          <div className="rounded-lg border border-cyan-500/40 bg-slate-900/80 p-4 text-center font-mono text-2xl tracking-[0.25em] text-cyan-300">
            {pin || "_ _ _"}
          </div>
          <div className="mx-auto grid max-w-xs grid-cols-3 gap-2">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "OK"].map(
              (k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => pressKey(k)}
                  className="min-h-[50px] touch-manipulation rounded-md border border-cyan-500/35 bg-slate-900/75 font-mono text-cyan-200 transition-all hover:border-cyan-300 hover:bg-cyan-500/10"
                >
                  {k}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {phase === 3 && (
        <form onSubmit={submitWord} className="space-y-4">
          <p className="text-center font-mono text-sm tracking-wider text-cyan-300">
            _FINAL TERMINAL // IDENTITY KEY REQUIRED
          </p>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="w-full touch-manipulation rounded-xl border-2 border-cyan-500/50 bg-slate-900/80 p-5 text-center font-mono text-2xl uppercase tracking-widest text-cyan-300 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_25px_rgba(34,211,238,0.45)]"
            placeholder="ZİHİN"
            autoComplete="off"
            autoFocus
          />
          <button
            type="submit"
            disabled={!word.trim()}
            className="min-h-[56px] w-full touch-manipulation rounded-xl border-2 border-zinc-600/55 bg-slate-900/60 px-6 py-4 text-center text-base font-semibold text-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/90 hover:bg-cyan-500/[0.12] hover:text-cyan-50 hover:shadow-[0_0_18px_rgba(34,211,238,0.45),0_0_28px_rgba(6,182,212,0.25)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            ANAHTARI DOĞRULA
          </button>
        </form>
      )}

      {error && (
        <p role="alert" className="text-center text-sm font-semibold text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

