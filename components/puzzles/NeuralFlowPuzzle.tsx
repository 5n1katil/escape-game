"use client";

import {
  useCallback,
  useId,
  useMemo,
  useState,
  type ReactElement,
} from "react";

export interface NeuralFlowPuzzleProps {
  onSolve: () => void;
  onWrong?: () => void;
}

const SIZE = 5;
/** 0=N, 1=E, 2=S, 3=W */
const DR = [-1, 0, 1, 0] as const;
const DC = [0, 1, 0, -1] as const;

type TileKind = "straight" | "L" | "T" | "cross";

/** Open sides at rotation 0 (before CW rotation steps). */
const BASE_OPEN: Record<TileKind, readonly number[]> = {
  straight: [0, 2],
  L: [0, 1],
  T: [0, 1, 3],
  cross: [0, 1, 2, 3],
};

function openSides(kind: TileKind, rot: number): number[] {
  return BASE_OPEN[kind].map((d) => (d + rot) % 4);
}

function pathConnectsInputToOutput(
  kinds: TileKind[][],
  rots: number[][]
): boolean {
  if (!openSides(kinds[0][0], rots[0][0]).includes(0)) return false;

  const visited = new Set<string>();
  const queue: [number, number][] = [[0, 0]];

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const sides = openSides(kinds[r][c], rots[r][c]);

    if (r === SIZE - 1 && c === SIZE - 1) {
      if (sides.includes(2)) return true;
      continue;
    }

    for (const d of sides) {
      const nr = r + DR[d];
      const nc = c + DC[d];
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) continue;
      const opp = (d + 2) % 4;
      if (!openSides(kinds[nr][nc], rots[nr][nc]).includes(opp)) continue;
      queue.push([nr, nc]);
    }
  }

  return false;
}

/**
 * Designed solution: edge path along top row then down right column to (4,4).
 * Off-path: mostly vertical straights; center uses cross/T for fractured-network look
 * (still isolated from the main corridor in the solved configuration).
 */
const SOL_KIND: TileKind[][] = [
  ["L", "straight", "straight", "straight", "L"],
  ["straight", "T", "straight", "straight", "straight"],
  ["straight", "straight", "cross", "straight", "straight"],
  ["straight", "straight", "straight", "L", "straight"],
  ["straight", "straight", "straight", "straight", "straight"],
];

const SOL_ROT: number[][] = [
  [0, 1, 1, 1, 2],
  [0, 2, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 3, 0],
  [0, 0, 0, 0, 0],
];

function scrambleRotations(): number[][] {
  return SOL_ROT.map((row) =>
    row.map((sol) => {
      const bump = 1 + Math.floor(Math.random() * 3);
      return (sol + bump) % 4;
    })
  );
}

/** SVG pipe segments in unit space 0–100, center 50; drawn for rotation 0 base shapes. */
function TileSvg({
  kind,
  rot,
  uniqueId,
}: {
  kind: TileKind;
  rot: number;
  uniqueId: string;
}) {
  const gradId = `${uniqueId}-grad`;
  const filtId = `${uniqueId}-filt`;
  const stroke = `url(#${gradId})`;
  const common = {
    fill: "none" as const,
    strokeWidth: 9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    filter: `url(#${filtId})`,
  };

  let paths: ReactElement | ReactElement[];
  switch (kind) {
    case "straight":
      paths = <path d="M 50 12 L 50 88" {...common} stroke={stroke} />;
      break;
    case "L":
      paths = <path d="M 50 12 L 50 50 L 88 50" {...common} stroke={stroke} />;
      break;
    case "T":
      paths = [
        <path key="h" d="M 12 50 L 88 50" {...common} stroke={stroke} />,
        <path key="v" d="M 50 12 L 50 50" {...common} stroke={stroke} />,
      ];
      break;
    case "cross":
      paths = [
        <path key="v" d="M 50 12 L 50 88" {...common} stroke={stroke} />,
        <path key="h" d="M 12 50 L 88 50" {...common} stroke={stroke} />,
      ];
      break;
  }

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.95" />
        </linearGradient>
        <filter id={filtId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g
        style={{
          transform: `rotate(${rot * 90}deg)`,
          transformOrigin: "50px 50px",
        }}
        className="transition-transform duration-300 ease-out"
      >
        {paths}
      </g>
    </svg>
  );
}

export default function NeuralFlowPuzzle({ onSolve, onWrong }: NeuralFlowPuzzleProps) {
  const baseId = useId().replace(/:/g, "");

  const [rots, setRots] = useState<number[][]>(() => scrambleRotations());
  const [error, setError] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  const kinds = useMemo(() => SOL_KIND, []);

  const rotateCell = useCallback(
    (r: number, c: number) => {
      if (solved) return;
      setError(null);
      setRots((prev) =>
        prev.map((row, ri) =>
          ri === r ? row.map((v, ci) => (ci === c ? (v + 1) % 4 : v)) : row
        )
      );
    },
    [solved]
  );

  const handleSubmit = useCallback(() => {
    if (solved) return;
    setError(null);

    if (pathConnectsInputToOutput(kinds, rots)) {
      setSolved(true);
      onSolve();
    } else {
      setError(
        "DİJİTAL SİNAPS KOPUKLUĞU TESPİT EDİLDİ. AĞ REDDEDİLDİ."
      );
      onWrong?.();
    }
  }, [solved, kinds, rots, onSolve, onWrong]);

  return (
    <div className="space-y-5 rounded-xl border border-cyan-500/35 bg-slate-950/90 p-3 shadow-[0_0_40px_rgba(6,182,212,0.08)] sm:p-5">
      <div className="relative mx-auto w-full max-w-md">
        {/* Input node — top-left */}
        <div
          className="pointer-events-none absolute -left-1 -top-2 z-10 flex flex-col items-center sm:-left-2 sm:-top-3"
          aria-hidden
        >
          <div className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400/90 sm:text-xs">
            Giriş
          </div>
          <div className="mt-0.5 h-3 w-3 rounded-full border-2 border-cyan-300 bg-cyan-400/40 shadow-[0_0_14px_rgba(34,211,238,0.85)] animate-pulse sm:h-3.5 sm:w-3.5" />
        </div>
        {/* Output node — bottom-right */}
        <div
          className="pointer-events-none absolute -bottom-2 -right-1 z-10 flex flex-col items-center sm:-bottom-3 sm:-right-2"
          aria-hidden
        >
          <div className="h-3 w-3 rounded-full border-2 border-cyan-300 bg-cyan-500/35 shadow-[0_0_12px_rgba(6,182,212,0.75)] sm:h-3.5 sm:w-3.5" />
          <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-cyan-400/90 sm:text-xs">
            Çıkış
          </div>
        </div>

        <div
          className="grid aspect-square w-full grid-cols-5 gap-1 rounded-lg border border-cyan-500/25 bg-slate-900/90 p-1.5 sm:gap-2 sm:p-2"
          role="grid"
          aria-label="Nöral akış ızgarası"
        >
          {Array.from({ length: SIZE }, (_, r) =>
            Array.from({ length: SIZE }, (_, c) => {
              const kind = kinds[r][c];
              const rot = rots[r][c];
              const uid = `${baseId}-t${r}-${c}`;
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  role="gridcell"
                  onClick={() => rotateCell(r, c)}
                  disabled={solved}
                  className="relative aspect-square min-h-0 min-w-0 touch-manipulation rounded-md border border-cyan-500/20 bg-slate-950/95 shadow-inner shadow-black/40 transition-[border-color,box-shadow] hover:border-cyan-400/55 hover:shadow-[0_0_16px_rgba(34,211,238,0.2)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60"
                  aria-label={`Nöral segment ${r + 1}-${c + 1}, döndürmek için tıklayın`}
                >
                  <TileSvg kind={kind} rot={rot} uniqueId={uid} />
                </button>
              );
            })
          )}
        </div>
      </div>

      <p className="text-center text-xs text-cyan-200/70 sm:text-sm">
        Her kareyi tıklayarak 90° saat yönünde döndürün. Girişten (üst) çıkışa
        (alt) kesintisiz cyan hat oluşturun.
      </p>

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
        disabled={solved}
        className="min-h-[52px] w-full touch-manipulation rounded-xl border-2 border-zinc-600/55 bg-slate-900/60 px-4 py-3 text-center text-base font-semibold text-zinc-100 shadow-sm shadow-black/25 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/90 hover:bg-cyan-500/[0.12] hover:text-cyan-50 hover:shadow-[0_0_18px_rgba(34,211,238,0.45),0_0_28px_rgba(6,182,212,0.25)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:min-h-[56px] sm:px-6 sm:py-4 md:text-lg"
      >
        AĞI SENKRONİZE ET
      </button>
    </div>
  );
}
