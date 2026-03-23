"use client";

import { isCorrectFinalCode } from "@/lib/rooms";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export interface ConstellationPuzzleProps {
  onSolve: () => void;
  onWrong?: () => void;
}

type Stage = "constellation" | "collapse" | "terminal";
type NodeDef = {
  id: string;
  letter: "Z" | "İ" | "H" | "N";
  roomId: number;
  x: number;
  y: number;
};

const SEQUENCE = ["Z", "İ", "H", "İ", "N"] as const;
const TARGET_KEY = "ZİHİN";

const MAIN_NODES: NodeDef[] = [
  { id: "n1", letter: "Z", roomId: 1, x: 14, y: 18 },
  { id: "n2", letter: "İ", roomId: 2, x: 82, y: 14 },
  { id: "n3", letter: "H", roomId: 3, x: 72, y: 52 },
  { id: "n4", letter: "İ", roomId: 4, x: 24, y: 56 },
  { id: "n5", letter: "N", roomId: 5, x: 50, y: 84 },
];

const DECOYS = [
  { id: "d1", x: 6, y: 72 },
  { id: "d2", x: 92, y: 36 },
  { id: "d3", x: 58, y: 6 },
  { id: "d4", x: 88, y: 90 },
] as const;

function roomImageFor(id: number): string {
  return `/games/zihin-labirenti/images/oda-${id}.png`;
}

export default function ConstellationPuzzle({ onSolve, onWrong }: ConstellationPuzzleProps) {
  const [stage, setStage] = useState<Stage>("constellation");
  const [sequenceIdx, setSequenceIdx] = useState(0);
  const [connected, setConnected] = useState<number[]>([]);
  const [flashRoom, setFlashRoom] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dissolve, setDissolve] = useState(false);

  const renderedNodes = MAIN_NODES;

  const orderedConnectedPoints = connected
    .map((idx) => renderedNodes[idx])
    .filter(Boolean);

  function triggerFlash(roomId: number) {
    setFlashRoom(roomId);
    setTimeout(() => setFlashRoom(null), 1000);
  }

  function handleMainNodeClick(idx: number) {
    if (stage !== "constellation") return;
    const expected = SEQUENCE[sequenceIdx];
    const picked = MAIN_NODES[idx].letter;
    triggerFlash(MAIN_NODES[idx].roomId);
    setError(null);
    if (picked !== expected) {
      setSequenceIdx(0);
      setConnected([]);
      setError("SIRALAMA HATASI: BELLEK DİZİSİ BOZULDU.");
      onWrong?.();
      return;
    }
    setConnected((prev) => [...prev, idx]);
    const next = sequenceIdx + 1;
    setSequenceIdx(next);
    if (next >= SEQUENCE.length) {
      setTimeout(() => setStage("collapse"), 350);
    }
  }

  function handleDecoyClick() {
    if (stage !== "constellation") return;
    setSequenceIdx(0);
    setConnected([]);
    setError("YANLIŞ DÜĞÜM: SAHTE BELLEK ÇEKİRDEĞİ.");
    onWrong?.();
  }

  useEffect(() => {
    if (stage !== "collapse") return;
    const t1 = setTimeout(() => setStage("terminal"), 1500);
    return () => clearTimeout(t1);
  }, [stage]);

  function handleTerminalSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (isCorrectFinalCode(TARGET_KEY, input)) {
      setDissolve(true);
      setTimeout(() => onSolve(), 1200);
      return;
    }
    setError("KİMLİK ANAHTARI REDDEDİLDİ.");
    setInput("");
    onWrong?.();
  }

  return (
    <div className="relative space-y-5 rounded-xl border border-cyan-500/35 bg-slate-950/90 p-4 shadow-[0_0_40px_rgba(6,182,212,0.08)] sm:p-6">
      {dissolve && (
        <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden rounded-xl bg-black/70">
          <div className="h-full w-full animate-pulse bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),transparent_55%),linear-gradient(to_bottom,rgba(34,211,238,0.15),transparent)]" />
        </div>
      )}

      {flashRoom && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-black/80 p-4">
          <div className="relative max-w-sm overflow-hidden rounded-lg border border-cyan-400/60">
            <img
              src={roomImageFor(flashRoom)}
              alt={`Room ${flashRoom} flash`}
              className="max-h-[48vh] w-full object-contain"
            />
            <div className="absolute inset-0 bg-cyan-400/10 mix-blend-screen" />
            <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 font-mono text-sm text-cyan-200">
              HARF: {SEQUENCE[Math.max(0, sequenceIdx - 1)] ?? "?"}
            </div>
          </div>
        </div>
      )}

      {stage === "constellation" && (
        <div className="space-y-4">
          <p className="text-center text-sm text-cyan-200/85">
            Bellek düğümlerini kronolojik sırayla senkronize edin:
            <span className="ml-2 font-mono tracking-widest text-cyan-300">Z İ H İ N</span>
          </p>
          <div className="relative mx-auto min-h-[480px] w-full max-w-[min(96vw,900px)] overflow-hidden rounded-xl bg-transparent">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              {orderedConnectedPoints.map((p, i) => {
                const prev = orderedConnectedPoints[i - 1];
                if (!prev) return null;
                return (
                  <line
                    key={`${prev.id}-${p.id}`}
                    x1={prev.x}
                    y1={prev.y}
                    x2={p.x}
                    y2={p.y}
                    stroke="#22d3ee"
                    strokeWidth="2.2"
                    className="drop-shadow-[0_0_10px_rgba(34,211,238,0.95)]"
                  />
                );
              })}
            </svg>

            {DECOYS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={handleDecoyClick}
                className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-500/50 bg-rose-500/25 touch-manipulation"
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
                aria-label="Sahte düğüm"
              />
            ))}

            {renderedNodes.map((n, idx) => {
              const isConnected = connected.includes(idx);
              const isNext = SEQUENCE[sequenceIdx] === n.letter;
              return (
                <motion.button
                  key={n.id}
                  type="button"
                  onClick={() => handleMainNodeClick(idx)}
                  animate={{ y: [0, -6, 0, 5, 0] }}
                  transition={{ duration: 8 + idx, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 touch-manipulation rounded-full border-2 text-xs font-bold transition-all ${
                    isConnected
                      ? "border-cyan-200 bg-cyan-500/40 text-cyan-50 shadow-[0_0_16px_rgba(34,211,238,0.85)]"
                      : isNext
                        ? "border-cyan-300 bg-cyan-500/25 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                        : "border-cyan-600/70 bg-slate-950 text-cyan-300"
                  }`}
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  aria-label={`Bellek düğümü ${idx + 1}`}
                >
                  {n.letter}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {stage === "collapse" && (
        <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-xl">
          {MAIN_NODES.map((n, i) => (
            <motion.div
              key={n.id}
              className="absolute h-3 w-3 rounded-full bg-cyan-300"
              initial={{ left: `${n.x}%`, top: `${n.y}%`, opacity: 0.9 }}
              animate={{ left: "50%", top: "50%", opacity: 0.2, scale: 0.2 }}
              transition={{ duration: 1.1, delay: i * 0.08, ease: "easeInOut" }}
            />
          ))}
          <motion.div
            className="h-24 w-24 rounded-full border border-cyan-300/70 bg-cyan-500/25 shadow-[0_0_40px_rgba(34,211,238,0.7)]"
            initial={{ scale: 0.6, opacity: 0.3 }}
            animate={{ scale: [0.6, 1.25, 1], opacity: [0.3, 1, 0.85] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      )}

      {stage === "terminal" && (
        <form onSubmit={handleTerminalSubmit} className="space-y-4">
          <p className="text-center font-mono text-sm tracking-wider text-cyan-300">
            _WAITING FOR IDENTITY KEY...
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-xl border-2 border-cyan-500/50 bg-slate-900/80 p-5 text-center font-mono text-2xl uppercase tracking-widest text-cyan-300 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_25px_rgba(34,211,238,0.45)]"
            placeholder="ZİHİN"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="min-h-[56px] w-full touch-manipulation rounded-xl border-2 border-zinc-600/55 bg-slate-900/60 px-6 py-4 text-center text-base font-semibold text-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/90 hover:bg-cyan-500/[0.12] hover:text-cyan-50 hover:shadow-[0_0_18px_rgba(34,211,238,0.45),0_0_28px_rgba(6,182,212,0.25)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            KİMLİK ANAHTARINI GÖNDER
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

