"use client";

import { useGameUi } from "@/components/GameVisualThemeProvider";
import { clearGameState } from "@/lib/gameStorage";

interface RestartButtonProps {
  slug: string;
  label: string;
}

export default function RestartButton({ slug, label }: RestartButtonProps) {
  const { ui } = useGameUi();
  function handleClick() {
    clearGameState(slug);
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`min-h-[50px] min-w-[50px] touch-manipulation rounded-xl border border-zinc-700/70 bg-zinc-900/70 px-3 text-sm font-medium text-zinc-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/70 hover:bg-cyan-500/10 hover:text-cyan-100 active:translate-y-0 active:scale-[0.98] sm:px-4 md:text-base ${ui.linkMutedHover}`}
    >
      {label}
    </button>
  );
}
