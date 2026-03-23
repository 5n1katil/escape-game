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

/**
 * Hardcoded 5×5 — all 25 cells explicit. rot = 0|1|2|3 → 0°,90°,180°,270°.
 * Solution path (when rotated correctly): (0,0)→(1,0)→(2,0)→(2,1)→(2,2)→(2,3)→(2,4)→(3,4)→(4,4).
 * Below state is scrambled; path cells use kinds that can align to that corridor.
 */
const INITIAL_GRID: CellState[][] = [
  // row 0 — (0,0) path: straight
  [
    { kind: "straight", rot: 1 },
    { kind: "cross", rot: 3 },
    { kind: "T", rot: 2 },
    { kind: "L", rot: 1 },
    { kind: "straight", rot: 2 },
  ],
  // row 1 — (1,0) path: straight
  [
    { kind: "straight", rot: 2 },
    { kind: "L", rot: 3 },
    { kind: "cross", rot: 1 },
    { kind: "T", rot: 0 },
    { kind: "L", rot: 2 },
  ],
  // row 2 — path across (2,0)…(2,4)
  [
    { kind: "L", rot: 3 },
    { kind: "straight", rot: 0 },
    { kind: "straight", rot: 0 },
    { kind: "straight", rot: 0 },
    { kind: "L", rot: 1 },
  ],
  // row 3 — (3,4) path: straight
  [
    { kind: "T", rot: 3 },
    { kind: "cross", rot: 0 },
    { kind: "L", rot: 1 },
    { kind: "straight", rot: 3 },
    { kind: "straight", rot: 1 },
  ],
  // row 4 — (4,4) path: straight
  [
    { kind: "L", rot: 0 },
    { kind: "straight", rot: 3 },
    { kind: "T", rot: 1 },
    { kind: "cross", rot: 2 },
    { kind: "straight", rot: 2 },
  ],
];

if (
  INITIAL_GRID.length !== SIZE ||
  INITIAL_GRID.some((row) => row.length !== SIZE)
) {
  throw new Error("NeuralFlowPuzzle: INITIAL_GRID must be 5×5");
}

/** SVG paths — plain cyan lines for stable performance. */
function TileSvg({ kind, rot }: { kind: TileKind; rot: number }) {
  const dMap: Record<TileKind, string> = {
    straight: "M 50 0 L 50 100",
    L: "M 50 0 L 50 50 L 100 50",
    T: "M 0 50 L 100 50 M 50 50 L 50 100",
    cross: "M 50 0 L 50 100 M 0 50 L 100 50",
  };

  const d = dMap[kind] ?? dMap.cross;

  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform={`rotate(${rot * 90} 50 50)`}
        className="transition-transform duration-300 ease-out"
      >
        <path
          d={d}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/** Deep clone — always 5×5 from INITIAL_GRID shape. */
function cloneGrid(grid: CellState[][]): CellState[][] {
  return grid.map((row) =>
    row.map((cell) => ({
      kind: cell.kind,
      rot: ((cell.rot % 4) + 4) % 4,
    }))
  );
}

function createInitialGridFromSeed(): CellState[][] {
  return cloneGrid(INITIAL_GRID);
}

export default function NeuralFlowPuzzle({ onSolve, onWrong }: NeuralFlowPuzzleProps) {
  const baseId = useId().replace(/:/g, "");

  const [grid, setGrid] = useState<CellState[][]>(() => createInitialGridFromSeed());
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
      <div className="relative mx-auto w-full max-w-[min(90vw,400px)]">
        {/* GİRİŞ — North edge of (0,0), chevron down into grid. Centered over col 0. */}
        <div
          className="pointer-events-none absolute left-0 top-0 z-10 flex w-[20%] flex-col items-center"
          style={{ transform: "translateY(-100%)" }}
          aria-hidden
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 sm:text-xs">
            GİRİŞ
          </span>
          <span className="mt-0.5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]">▼</span>
          <div className="mt-0.5 h-2.5 w-2.5 rounded-full border-2 border-cyan-400 bg-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse sm:h-3 sm:w-3" />
        </div>

        {/* ÇIKIŞ — South edge of (4,4), chevron down out of grid. Centered over col 4. */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 z-10 flex w-[20%] flex-col items-center"
          style={{ transform: "translateY(100%)" }}
          aria-hidden
        >
          <div className="h-2.5 w-2.5 rounded-full border-2 border-cyan-400 bg-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] sm:h-3 sm:w-3" />
          <span className="mt-0.5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]">▼</span>
          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-cyan-300 sm:text-xs">
            ÇIKIŞ
          </span>
        </div>

        <div
          className="relative grid aspect-square w-full grid-cols-5 gap-1 rounded-lg border border-cyan-500/25 bg-slate-900/90 p-1.5 sm:gap-2 sm:p-2"
          role="grid"
          aria-label="Nöral akış ızgarası"
        >
          {Array.from({ length: SIZE }, (_, r) =>
            Array.from({ length: SIZE }, (_, c) => {
              const cell = grid[r][c];
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
