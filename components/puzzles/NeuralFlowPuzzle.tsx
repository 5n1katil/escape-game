"use client";

import { useCallback, useId, useState } from "react";

export interface NeuralFlowPuzzleProps {
  onSolve: () => void;
  onWrong?: () => void;
}

const SIZE = 5;
/** 0=N, 1=E, 2=S, 3=W */
const DR = [-1, 0, 1, 0] as const;
const DC = [0, 1, 0, -1] as const;

type TileKind = "straight" | "L" | "T" | "cross";

/** Each cell: kind + rot (0,1,2,3 = 0°,90°,180°,270°). */
type CellState = { kind: TileKind; rot: number };

/** Open sides at rotation 0. T has stem down = E,S,W. */
const BASE_OPEN: Record<TileKind, readonly number[]> = {
  straight: [0, 2],
  L: [0, 1],
  T: [1, 2, 3],
  cross: [0, 1, 2, 3],
};

function openSides(kind: TileKind, rot: number): number[] {
  return BASE_OPEN[kind].map((d) => (d + rot) % 4);
}

function pathConnectsInputToOutput(grid: CellState[][]): boolean {
  const cell = grid[0]?.[0];
  if (!cell || !openSides(cell.kind, cell.rot).includes(0)) return false;

  const visited = new Set<string>();
  const queue: [number, number][] = [[0, 0]];

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const cell = grid[r]?.[c];
    if (!cell) continue;
    const sides = openSides(cell.kind, cell.rot);

    if (r === SIZE - 1 && c === SIZE - 1) {
      if (sides.includes(2)) return true;
      continue;
    }

    for (const d of sides) {
      const nr = r + DR[d];
      const nc = c + DC[d];
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) continue;
      const ncell = grid[nr]?.[nc];
      if (!ncell) continue;
      const opp = (d + 2) % 4;
      if (!openSides(ncell.kind, ncell.rot).includes(opp)) continue;
      queue.push([nr, nc]);
    }
  }

  return false;
}

/** Brute-force hardcoded 5x5 grid. All 25 cells explicitly defined. Path: (0,0)→(1,0)→(2,0)→(2,1)→...→(4,4). Scrambled. */
const INITIAL_GRID: CellState[][] = [
  [
    { kind: "straight", rot: 1 },
    { kind: "L", rot: 2 },
    { kind: "T", rot: 3 },
    { kind: "cross", rot: 0 },
    { kind: "L", rot: 1 },
  ],
  [
    { kind: "straight", rot: 2 },
    { kind: "cross", rot: 2 },
    { kind: "L", rot: 0 },
    { kind: "T", rot: 1 },
    { kind: "straight", rot: 3 },
  ],
  [
    { kind: "L", rot: 3 },
    { kind: "straight", rot: 0 },
    { kind: "straight", rot: 0 },
    { kind: "straight", rot: 0 },
    { kind: "L", rot: 1 },
  ],
  [
    { kind: "T", rot: 0 },
    { kind: "L", rot: 2 },
    { kind: "cross", rot: 1 },
    { kind: "straight", rot: 2 },
    { kind: "straight", rot: 1 },
  ],
  [
    { kind: "L", rot: 2 },
    { kind: "straight", rot: 1 },
    { kind: "T", rot: 2 },
    { kind: "L", rot: 0 },
    { kind: "straight", rot: 2 },
  ],
];

/** Bulletproof SVG paths — full extent 0–100, bright cyan, no filter. */
function TileSvg({ kind, rot }: { kind: TileKind; rot: number }) {
  const pathProps = {
    fill: "none" as const,
    stroke: "#22d3ee" as const,
    strokeWidth: 8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const dMap: Record<TileKind, string> = {
    straight: "M 50 0 L 50 100",
    L: "M 50 0 L 50 50 L 100 50",
    T: "M 0 50 L 100 50 M 50 50 L 50 100",
    cross: "M 50 0 L 50 100 M 0 50 L 100 50",
  };

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden preserveAspectRatio="xMidYMid meet">
      <g
        transform={`rotate(${rot * 90} 50 50)`}
        className="transition-transform duration-300 ease-out"
      >
        <path d={dMap[kind] ?? dMap.cross} {...pathProps} />
      </g>
    </svg>
  );
}

/** Deep clone for immutable updates. */
function cloneGrid(grid: CellState[][]): CellState[][] {
  return grid.map((row) => row.map((cell) => ({ kind: cell.kind, rot: cell.rot })));
}

export default function NeuralFlowPuzzle({ onSolve, onWrong }: NeuralFlowPuzzleProps) {
  const baseId = useId().replace(/:/g, "");

  const [grid, setGrid] = useState<CellState[][]>(() => cloneGrid(INITIAL_GRID));
  const [error, setError] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  const rotateCell = useCallback(
    (r: number, c: number) => {
      if (solved) return;
      setError(null);
      setGrid((prev) => {
        const next = cloneGrid(prev);
        const cell = next[r]?.[c];
        if (cell) cell.rot = (cell.rot + 1) % 4;
        return next;
      });
    },
    [solved]
  );

  const handleSubmit = useCallback(() => {
    if (solved) return;
    setError(null);

    if (pathConnectsInputToOutput(grid)) {
      setSolved(true);
      onSolve();
    } else {
      setError(
        "DİJİTAL SİNAPS KOPUKLUĞU TESPİT EDİLDİ. AĞ REDDEDİLDİ."
      );
      onWrong?.();
    }
  }, [solved, grid, onSolve, onWrong]);

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
              const cell = grid[r]?.[c] ?? { kind: "cross" as TileKind, rot: 0 };
              const tileId = `${baseId}-${r}-${c}`;
              return (
                <button
                  key={tileId}
                  type="button"
                  role="gridcell"
                  onClick={() => rotateCell(r, c)}
                  disabled={solved}
                  className="relative aspect-square min-h-0 min-w-0 touch-manipulation rounded-md border border-cyan-500/20 bg-slate-950/95 shadow-inner shadow-black/40 transition-[border-color,box-shadow] hover:border-cyan-400/55 hover:shadow-[0_0_16px_rgba(34,211,238,0.2)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60"
                  aria-label={`Nöral segment ${r + 1}-${c + 1}, döndürmek için tıklayın`}
                >
                  <TileSvg kind={cell.kind} rot={cell.rot} />
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
