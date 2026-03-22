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
      className={`min-h-[44px] min-w-[44px] touch-manipulation rounded-lg text-sm text-zinc-500 transition-colors hover:bg-zinc-800/50 active:bg-zinc-800/70 sm:px-3 ${ui.linkMutedHover}`}
    >
      {label}
    </button>
  );
}
