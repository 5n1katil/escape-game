import type { VisualThemeId } from "@/data/games";
import { getGameBySlug } from "@/data/games";

export type { VisualThemeId };

export function getVisualThemeForSlug(slug: string): VisualThemeId {
  return getGameBySlug(slug)?.visualTheme ?? "temple";
}

/** Tüm oyun UI sınıfları — temple (amber) / cyber (cyan-neon). */
export const THEME_UI = {
  temple: {
    spinner: "border-amber-500 border-t-transparent",
    linkMutedHover: "hover:text-amber-500",
    hub: {
      backLink: "hover:text-amber-500",
      stickyBarBorder: "border-amber-900/45",
      desktopCountSection: "border-amber-900/45",
      mobileMapWrap: "border-amber-900/40",
      mobileMapTitleBar: "border-amber-900/35",
      sectionTitle: "text-amber-500/90",
      storySectionBorder: "border-amber-900/35",
      roomsSectionBorder: "border-amber-900/35",
      roomOpenItem:
        "border-amber-800/40 bg-zinc-800/50 cursor-pointer hover:border-amber-600/35 hover:bg-zinc-800 transition-colors",
      roomOpenBadge: "bg-amber-900/30 text-amber-400",
      roomGoLabel: "text-amber-500/70",
      finalWrap: "border-amber-700/40 bg-amber-950/30",
      finalTitle: "text-amber-400",
      finalInput:
        "focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/80 focus:ring-offset-2 focus:ring-offset-amber-950/50",
      finalSubmit:
        "bg-amber-600 py-3 text-lg font-semibold text-white shadow-md shadow-amber-900/35 transition-all duration-300 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
      finalSecondary:
        "border-amber-700/50 bg-amber-950/40 py-2.5 text-sm font-medium text-amber-200/90 transition-colors hover:bg-amber-900/50",
      asideBorder: "border-amber-900/40",
    },
    roomMap: {
      currentCell:
        "border-amber-500 bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/40",
      availableCell: "border-amber-500/60 bg-amber-950/30 text-amber-400/90",
      stripCurrentTitle: "text-amber-100",
      fillCurrentTitle: "text-amber-100",
      rowHoverCurrent:
        "hover:border-amber-500/45 hover:bg-amber-500/[0.08] hover:shadow-[0_0_22px_rgba(245,158,11,0.18)]",
      rowHoverAvailable:
        "hover:border-amber-500/40 hover:bg-amber-950/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.16)] hover:translate-x-px",
      asideRing: "ring-amber-950/30",
      asideFramed: "border-amber-900/30",
      progressTitle: "text-amber-500/90",
      currentRowFrame: "rounded-lg bg-amber-500/5 ring-1 ring-amber-500/35",
      navigableFocus:
        "focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900",
      hubLink:
        "border-amber-700/50 bg-amber-950/30 px-3 py-2.5 text-center text-sm font-medium text-amber-200/90 transition-colors duration-200 hover:bg-amber-900/40 hover:text-amber-100",
      hubLinkCompact:
        "mt-3 flex w-full shrink-0 items-center justify-center rounded-lg border border-amber-700/50 bg-amber-950/30 px-3 py-2 text-center text-xs font-medium text-amber-200/90 transition-all duration-200 hover:border-amber-600/60 hover:bg-amber-900/45 hover:text-amber-50 hover:shadow-[0_0_18px_rgba(245,158,11,0.12)] sm:text-sm",
      slimAsideRing: "ring-amber-950/40",
      defaultCurrentBg: "bg-amber-500/10 ring-1 ring-amber-500/30",
      defaultCurrentCell:
        "border-amber-500 bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/40",
      defaultAvailableCell: "border-amber-500/60 bg-amber-950/30 text-amber-400/90",
      defaultHubLinkBottom:
        "mt-3 flex w-full items-center justify-center rounded-lg border border-amber-700/50 bg-amber-950/30 text-center font-medium text-amber-200/90 transition-colors hover:bg-amber-900/40 hover:text-amber-100",
    },
    templeMap: {
      lockedOverlay:
        "pointer-events-none absolute flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-md border-2 border-purple-400/65 bg-black/48 ring-1 ring-amber-400/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.15)] backdrop-blur-[2px] sm:gap-1",
      lockedIcon:
        "h-8 w-8 shrink-0 text-amber-100 drop-shadow-[0_0_10px_rgba(251,191,36,0.65)] sm:h-9 sm:w-9",
      lockedNum:
        "text-sm font-extrabold tabular-nums text-amber-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] sm:text-base",
      openBase:
        "map-room-open absolute flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border-2 border-amber-300/95 bg-black/25 text-2xl font-black tabular-nums text-white touch-manipulation outline-none transition-all duration-300 hover:animate-none hover:!border-amber-500 hover:!bg-amber-500/30 hover:shadow-[0_0_25px_rgba(245,158,11,0.9)] focus-visible:animate-none focus-visible:!border-amber-500 focus-visible:!bg-amber-500/30 focus-visible:shadow-[0_0_25px_rgba(245,158,11,0.9)] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 sm:text-3xl",
      openActive: "ring-2 ring-amber-300 ring-offset-2 ring-offset-zinc-950/80 z-[1]",
      containRing: "ring-amber-900/35",
    },
    countdown: {
      mobileBar: "border-b border-amber-500/40 bg-black/70 px-3 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-4",
      mobileLabel:
        "shrink-0 text-[10px] font-extrabold uppercase leading-tight tracking-[0.12em] text-amber-400 sm:text-xs sm:tracking-[0.16em]",
      mobileTime:
        "font-mono text-3xl font-black tabular-nums tracking-tight text-amber-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.55)] sm:text-4xl",
      compactBox:
        "w-full shrink-0 rounded-xl border-2 border-amber-500/50 bg-black/60 px-3 py-4 shadow-[0_0_36px_rgba(245,158,11,0.18),inset_0_1px_0_rgba(251,191,36,0.08)] sm:px-4 sm:py-5",
      compactLabel:
        "text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-400/95 sm:text-xs sm:tracking-[0.22em]",
      compactTime:
        "text-center font-mono text-5xl font-black tabular-nums tracking-tight text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] lg:text-6xl",
      hubBox:
        "w-full shrink-0 rounded-xl border-2 border-amber-500/45 bg-black/55 px-3 py-2.5 shadow-[0_0_28px_rgba(245,158,11,0.14),inset_0_1px_0_rgba(251,191,36,0.08)] sm:px-4 sm:py-3",
      hubLabel:
        "text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-400/95 sm:text-[11px] sm:tracking-[0.2em]",
      hubTime:
        "text-center font-mono text-4xl font-black tabular-nums tracking-tight text-amber-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.55)] sm:text-5xl lg:text-[2.75rem]",
    },
    escapeRoom: {
      codeBox: "rounded-lg border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-left",
      codeLabel: "text-sm font-semibold text-amber-400/90",
      codeValue: "min-w-0 flex-1 break-all font-mono text-base font-bold tracking-wide text-amber-200 sm:text-lg",
      copyBtn:
        "inline-flex shrink-0 touch-manipulation items-center justify-center gap-1.5 rounded-md border border-amber-500/30 bg-[#020617] px-3 py-2 text-sm font-medium text-amber-400 shadow-none transition-all duration-200 hover:border-amber-500/45 hover:bg-amber-500/10 hover:text-amber-300 hover:shadow-[0_0_14px_rgba(245,158,11,0.2)] active:scale-[0.97] sm:min-w-[7.5rem]",
      copyBtnLabel: "text-xs font-semibold tracking-tight text-amber-200 sm:text-sm",
      winWrap:
        "mx-auto w-full max-w-3xl space-y-6 rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-8 text-center sm:px-8 sm:py-10 lg:max-w-none",
      winTitle: "text-2xl font-bold text-amber-400 sm:text-3xl md:text-4xl",
      winCard: "space-y-3 rounded-lg border border-amber-500/20 bg-zinc-900/40 px-4 py-4 text-left",
      winCardTitle: "text-center text-lg font-semibold text-amber-300",
      winCta:
        "inline-flex min-h-[48px] min-w-[160px] touch-manipulation items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-amber-500 active:scale-95",
      textInput:
        "w-full rounded-lg border-2 border-zinc-600/50 bg-black/40 px-4 py-3 text-base text-zinc-100 shadow-inner shadow-black/20 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/80 focus:ring-offset-2 focus:ring-offset-zinc-950 sm:py-3.5 sm:text-lg",
      primaryBtn:
        "w-full min-h-[48px] touch-manipulation rounded-lg bg-amber-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-amber-900/30 transition-all duration-300 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none active:scale-[0.98] sm:py-4 sm:text-lg",
      choiceBtn:
        "min-h-[52px] w-full touch-manipulation rounded-xl border-2 border-zinc-600/55 bg-slate-900/60 px-6 py-4 text-left text-lg font-semibold text-zinc-100 shadow-sm shadow-black/25 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/90 hover:bg-amber-500/[0.12] hover:text-amber-50 hover:shadow-[0_0_18px_rgba(251,191,36,0.4),0_0_28px_rgba(245,158,11,0.22),0_8px_24px_rgba(0,0,0,0.35)] active:scale-[0.98] md:text-xl",
      imageChoiceCard:
        "group flex min-h-[100px] flex-col overflow-hidden rounded-xl border-2 border-zinc-600/50 bg-zinc-800/40 shadow-sm shadow-black/25 transition-all duration-300 hover:border-amber-500/80 hover:bg-zinc-800/60 hover:shadow-[0_0_24px_rgba(245,158,11,0.15)] sm:min-h-[120px]",
      imageChoiceIcon:
        "flex h-14 w-14 items-center justify-center rounded-full bg-amber-950/50 text-3xl text-amber-400/80",
      imageChoiceCaption: "text-center text-sm font-medium text-zinc-100 group-hover:text-amber-100",
      imageChoiceSelect:
        "min-h-[44px] w-full touch-manipulation border-t-2 border-zinc-600/40 bg-zinc-800/50 px-4 py-2.5 text-sm font-semibold text-amber-300 transition-all duration-300 hover:border-amber-500/70 hover:bg-amber-500/15 hover:text-amber-200 hover:shadow-[inset_0_0_20px_rgba(245,158,11,0.08)] active:scale-[0.98]",
      attemptBadge: "rounded-full border-2 border-amber-500/60 bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-400",
      descMuted: "text-sm text-amber-500/80",
      storyHeading: "mb-3 text-sm font-semibold uppercase tracking-wider text-amber-500/90",
      puzzlePanel: "rounded-xl border border-amber-500/30 bg-amber-950/30 px-5 py-5 sm:px-6 sm:py-6",
      puzzlePrompt: "text-center text-lg font-semibold text-amber-400 sm:text-xl",
      lightboxClose:
        "absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-white shadow-lg transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400",
    },
    result: {
      spinner: "border-amber-500 border-t-transparent",
      gameTitleBar: "text-sm font-medium uppercase tracking-wider text-amber-500/90",
      mainTitle: "mt-2 text-2xl font-bold text-amber-400 sm:text-3xl",
      avatarBorder: "border-amber-500/45",
      scoreCard: "rounded-xl border border-amber-500/25 bg-amber-950/20 px-4 py-5 sm:px-6 sm:py-6",
      scoreTitle: "text-center text-lg font-semibold text-amber-300 sm:text-xl",
      breakdownTitle: "text-center text-base font-semibold text-amber-500/90 sm:text-lg",
      tabActive: "bg-amber-600 text-white",
      tabInactive: "bg-zinc-800 text-zinc-300",
      rowScore: "tabular-nums text-amber-400/90",
      lbAvatarBorder: "border-amber-500/45",
      sectionTitle: "text-base font-semibold text-amber-500/90 sm:text-lg",
      btnGhost:
        "inline-flex min-h-[52px] min-w-[220px] flex-shrink-0 items-center justify-center rounded-xl border-2 border-amber-700/60 bg-transparent px-8 py-3.5 text-lg font-semibold text-amber-100/90 transition-colors hover:border-amber-600/80 hover:bg-amber-900/20 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-[0.98]",
      btnPrimary:
        "inline-flex min-h-[52px] min-w-[220px] flex-shrink-0 items-center justify-center rounded-xl bg-amber-600 px-8 py-3.5 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-[0.98]",
    },
    gameOver: {
      spinner: "border-amber-500 border-t-transparent",
      card: "w-full max-w-md rounded-2xl border border-amber-700/50 bg-zinc-900 px-6 py-8 shadow-xl sm:px-8 sm:py-10",
      title: "text-center text-xl font-bold text-amber-400 sm:text-2xl",
      primaryBtn:
        "min-h-[48px] rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-500 active:scale-[0.98]",
    },
    intro: {
      backButton:
        "rounded-xl border border-amber-700/50 bg-amber-950/80 px-4 py-2.5 text-base font-medium text-amber-200 shadow-lg backdrop-blur-sm transition-colors hover:border-amber-600/60 hover:bg-amber-900/70 hover:text-amber-100 active:scale-[0.98] sm:min-h-[44px] sm:px-4",
      panelGradient: "bg-gradient-to-b from-amber-950/80 via-amber-950/60 to-amber-950/90",
      h1: "mb-3 text-2xl font-bold tracking-tight text-amber-100 sm:text-3xl md:text-4xl",
      audioBox: "rounded-lg border border-amber-700/40 bg-amber-900/30 px-3 py-2.5",
      audioLabel: "mb-2 text-sm font-medium text-amber-200/90",
      audioRow: "flex items-center gap-2 rounded-lg border border-amber-700/40 bg-amber-900/30 px-3 py-2",
      audioRowText: "text-sm text-amber-200/80",
      sectionHeading: "mb-2 text-sm font-semibold uppercase tracking-wider text-amber-400/90 sm:text-base",
      bodyText: "whitespace-pre-line text-base leading-relaxed text-amber-100/90 sm:text-base",
      rulesList: "list-inside list-disc space-y-1.5 text-base leading-relaxed text-amber-100/90 sm:text-base",
    },
    introModal: {
      outerGlow:
        "pointer-events-none absolute -inset-1 rounded-[1.35rem] bg-gradient-to-br from-amber-400/35 via-amber-600/15 to-transparent opacity-90 blur-sm sm:-inset-2 sm:rounded-[1.75rem] lg:-inset-3",
      frame:
        "relative overflow-hidden rounded-3xl border-2 border-amber-500/55 bg-gradient-to-b from-zinc-900/98 via-zinc-950/98 to-black/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(251,191,36,0.12)] ring-2 ring-amber-400/25 sm:p-10 md:p-12 lg:p-14 xl:p-16 sm:rounded-[1.75rem]",
      corner: "border-amber-400/50",
      outerShadowGlow:
        "pointer-events-none absolute inset-0 rounded-3xl shadow-[0_0_100px_rgba(245,158,11,0.22),0_0_180px_rgba(180,83,9,0.12)] sm:rounded-[1.75rem]",
      radialOverlay:
        "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,191,36,0.14),transparent_55%)]",
      modalTitle:
        "text-balance text-xl font-bold leading-tight tracking-tight text-amber-300 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl",
      modalBody:
        "mt-6 max-w-3xl text-pretty text-sm leading-relaxed text-zinc-200 sm:mt-8 sm:text-base md:text-lg md:leading-relaxed lg:mt-10 lg:text-xl lg:leading-relaxed",
      modalBodySecond:
        "mt-5 max-w-3xl text-pretty text-sm leading-relaxed text-zinc-200 sm:mt-6 sm:text-base md:text-lg md:leading-relaxed lg:text-xl lg:leading-relaxed",
      modalCta:
        "ranking-modal-cta mt-8 min-h-[48px] w-full max-w-md touch-manipulation rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_32px_rgba(245,158,11,0.45),0_12px_28px_rgba(0,0,0,0.45)] ring-2 ring-amber-400/40 transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:shadow-[0_0_48px_rgba(251,191,36,0.55),0_16px_36px_rgba(0,0,0,0.5)] hover:ring-amber-300/50 active:scale-[0.98] sm:mt-10 sm:min-h-[56px] sm:max-w-lg sm:py-4 sm:text-base lg:mt-12 lg:min-h-[64px] lg:max-w-xl lg:text-lg",
      btnGhost:
        "flex-1 min-h-[56px] touch-manipulation rounded-xl border-2 border-amber-700/60 bg-transparent px-6 py-4 text-lg font-semibold text-amber-100/90 transition-colors hover:border-amber-600/80 hover:bg-amber-900/20 active:scale-[0.98] sm:min-h-[64px] sm:text-xl",
      btnPrimary:
        "flex-1 min-h-[56px] touch-manipulation rounded-xl bg-amber-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-amber-900/30 transition-all hover:bg-amber-500 hover:shadow-amber-500/25 active:scale-[0.98] sm:min-h-[64px] sm:text-xl",
      startMain:
        "w-full min-h-[64px] touch-manipulation rounded-xl bg-amber-600 px-8 py-5 text-xl font-bold text-white shadow-lg shadow-amber-900/40 transition-all hover:bg-amber-500 hover:shadow-amber-500/30 active:scale-[0.98] sm:min-h-[72px] sm:text-2xl",
    },
    gameRoom: {
      sidebar:
        "box-border flex w-full min-w-0 flex-col gap-4 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#111827] to-[#0b1120] p-5 shadow-[0_0_35px_rgba(245,158,11,0.12)] xl:fixed xl:top-28 xl:z-[35] xl:max-h-[calc(100vh-7.5rem)] xl:w-[400px] xl:overflow-hidden xl:pr-1 xl:shadow-[0_0_40px_rgba(245,158,11,0.14)] xl:right-[max(1rem,calc((100vw-1800px)/2+3.5rem))]",
      contentCard:
        "w-full min-w-0 rounded-2xl border border-amber-500/10 bg-[#0b1120]/80 p-5 shadow-[0_0_30px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6 lg:p-8 xl:p-10",
      tacticalPanel:
        "room-tactical-panel flex min-h-0 w-full min-w-0 flex-1 flex-col gap-3 overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-zinc-900/85 via-zinc-950/95 to-zinc-950 p-4 shadow-[0_0_48px_rgba(245,158,11,0.1),inset_0_1px_0_rgba(251,191,36,0.12)] ring-1 ring-amber-950/45 sm:gap-3.5 sm:p-5",
    },
    roomPage: {
      mapStripBorder: "border-amber-900/40",
      mapTitle: "text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/90",
      headerLinkHover: "hover:text-amber-500",
    },
  },
  cyber: {
    spinner: "border-cyan-400 border-t-transparent",
    linkMutedHover: "hover:text-cyan-400",
    hub: {
      backLink: "hover:text-cyan-400",
      stickyBarBorder: "border-cyan-900/50",
      desktopCountSection: "border-cyan-800/45",
      mobileMapWrap: "border-cyan-800/45",
      mobileMapTitleBar: "border-cyan-800/40",
      sectionTitle: "text-cyan-400/95",
      storySectionBorder: "border-cyan-800/40",
      roomsSectionBorder: "border-cyan-800/40",
      roomOpenItem:
        "border-cyan-700/45 bg-zinc-900/50 cursor-pointer hover:border-cyan-500/40 hover:bg-zinc-800/80 transition-colors",
      roomOpenBadge: "bg-cyan-950/50 text-cyan-300",
      roomGoLabel: "text-cyan-400/80",
      finalWrap: "border-cyan-600/45 bg-cyan-950/35",
      finalTitle: "text-cyan-300",
      finalInput:
        "focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:ring-offset-2 focus:ring-offset-cyan-950/40",
      finalSubmit:
        "bg-cyan-600 py-3 text-lg font-semibold text-white shadow-md shadow-cyan-900/40 transition-all duration-300 hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
      finalSecondary:
        "border-cyan-600/55 bg-cyan-950/45 py-2.5 text-sm font-medium text-cyan-100/90 transition-colors hover:bg-cyan-900/40",
      asideBorder: "border-cyan-900/45",
    },
    roomMap: {
      currentCell:
        "border-cyan-400 bg-cyan-500/20 text-cyan-200 ring-2 ring-cyan-400/45",
      availableCell: "border-cyan-500/55 bg-cyan-950/35 text-cyan-300/95",
      stripCurrentTitle: "text-cyan-100",
      fillCurrentTitle: "text-cyan-100",
      rowHoverCurrent:
        "hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_0_22px_rgba(34,211,238,0.22)]",
      rowHoverAvailable:
        "hover:border-cyan-500/45 hover:bg-cyan-950/45 hover:shadow-[0_0_20px_rgba(34,211,238,0.18)] hover:translate-x-px",
      asideRing: "ring-cyan-950/40",
      asideFramed: "border-cyan-800/35",
      progressTitle: "text-cyan-400/95",
      currentRowFrame: "rounded-lg bg-cyan-500/8 ring-1 ring-cyan-400/40",
      navigableFocus:
        "focus-visible:ring-2 focus-visible:ring-cyan-400/65 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900",
      hubLink:
        "border-cyan-700/50 bg-cyan-950/35 px-3 py-2.5 text-center text-sm font-medium text-cyan-100/90 transition-colors duration-200 hover:bg-cyan-900/45 hover:text-cyan-50",
      hubLinkCompact:
        "mt-3 flex w-full shrink-0 items-center justify-center rounded-lg border border-cyan-700/50 bg-cyan-950/35 px-3 py-2 text-center text-xs font-medium text-cyan-100/90 transition-all duration-200 hover:border-cyan-500/55 hover:bg-cyan-900/50 hover:text-cyan-50 hover:shadow-[0_0_18px_rgba(34,211,238,0.2)] sm:text-sm",
      slimAsideRing: "ring-cyan-950/45",
      defaultCurrentBg: "bg-cyan-500/10 ring-1 ring-cyan-400/35",
      defaultCurrentCell:
        "border-cyan-400 bg-cyan-500/20 text-cyan-200 ring-2 ring-cyan-400/45",
      defaultAvailableCell: "border-cyan-500/55 bg-cyan-950/35 text-cyan-300/95",
      defaultHubLinkBottom:
        "mt-3 flex w-full items-center justify-center rounded-lg border border-cyan-700/50 bg-cyan-950/35 text-center font-medium text-cyan-100/90 transition-colors hover:bg-cyan-900/45 hover:text-cyan-50",
    },
    templeMap: {
      lockedOverlay:
        "pointer-events-none absolute flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-md border-2 border-violet-500/60 bg-black/48 ring-1 ring-cyan-400/35 shadow-[inset_0_0_20px_rgba(0,0,0,0.15)] backdrop-blur-[2px] sm:gap-1",
      lockedIcon:
        "h-8 w-8 shrink-0 text-cyan-200 drop-shadow-[0_0_10px_rgba(34,211,238,0.65)] sm:h-9 sm:w-9",
      lockedNum:
        "text-sm font-extrabold tabular-nums text-cyan-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] sm:text-base",
      openBase:
        "map-room-open absolute flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border-2 border-cyan-300/90 bg-black/25 text-2xl font-black tabular-nums text-white touch-manipulation outline-none transition-all duration-300 hover:animate-none hover:!border-cyan-400 hover:!bg-cyan-500/25 hover:shadow-[0_0_25px_rgba(34,211,238,0.85)] focus-visible:animate-none focus-visible:!border-cyan-400 focus-visible:!bg-cyan-500/25 focus-visible:shadow-[0_0_25px_rgba(34,211,238,0.85)] focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 sm:text-3xl",
      openActive: "ring-2 ring-cyan-300 ring-offset-2 ring-offset-zinc-950/80 z-[1]",
      containRing: "ring-cyan-900/40",
    },
    countdown: {
      mobileBar: "border-b border-cyan-500/45 bg-black/70 px-3 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-4",
      mobileLabel:
        "shrink-0 text-[10px] font-extrabold uppercase leading-tight tracking-[0.12em] text-cyan-400 sm:text-xs sm:tracking-[0.16em]",
      mobileTime:
        "font-mono text-3xl font-black tabular-nums tracking-tight text-cyan-300 drop-shadow-[0_0_14px_rgba(34,211,238,0.55)] sm:text-4xl",
      compactBox:
        "w-full shrink-0 rounded-xl border-2 border-cyan-500/50 bg-black/60 px-3 py-4 shadow-[0_0_36px_rgba(34,211,238,0.2),inset_0_1px_0_rgba(34,211,238,0.1)] sm:px-4 sm:py-5",
      compactLabel:
        "text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-cyan-400/95 sm:text-xs sm:tracking-[0.22em]",
      compactTime:
        "text-center font-mono text-5xl font-black tabular-nums tracking-tight text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.55)] lg:text-6xl",
      hubBox:
        "w-full shrink-0 rounded-xl border-2 border-cyan-500/45 bg-black/55 px-3 py-2.5 shadow-[0_0_28px_rgba(34,211,238,0.16),inset_0_1px_0_rgba(34,211,238,0.08)] sm:px-4 sm:py-3",
      hubLabel:
        "text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-400/95 sm:text-[11px] sm:tracking-[0.2em]",
      hubTime:
        "text-center font-mono text-4xl font-black tabular-nums tracking-tight text-cyan-300 drop-shadow-[0_0_14px_rgba(34,211,238,0.5)] sm:text-5xl lg:text-[2.75rem]",
    },
    escapeRoom: {
      codeBox: "rounded-lg border border-cyan-500/40 bg-cyan-950/30 px-4 py-3 text-left",
      codeLabel: "text-sm font-semibold text-cyan-300/95",
      codeValue: "min-w-0 flex-1 break-all font-mono text-base font-bold tracking-wide text-cyan-100 sm:text-lg",
      copyBtn:
        "inline-flex shrink-0 touch-manipulation items-center justify-center gap-1.5 rounded-md border border-cyan-500/35 bg-[#020617] px-3 py-2 text-sm font-medium text-cyan-300 shadow-none transition-all duration-200 hover:border-cyan-400/55 hover:bg-cyan-500/10 hover:text-cyan-200 hover:shadow-[0_0_14px_rgba(34,211,238,0.25)] active:scale-[0.97] sm:min-w-[7.5rem]",
      copyBtnLabel: "text-xs font-semibold tracking-tight text-cyan-100 sm:text-sm",
      winWrap:
        "mx-auto w-full max-w-3xl space-y-6 rounded-xl border border-cyan-500/30 bg-cyan-950/20 px-4 py-8 text-center sm:px-8 sm:py-10 lg:max-w-none",
      winTitle: "text-2xl font-bold text-cyan-300 sm:text-3xl md:text-4xl",
      winCard: "space-y-3 rounded-lg border border-cyan-500/25 bg-zinc-900/40 px-4 py-4 text-left",
      winCardTitle: "text-center text-lg font-semibold text-cyan-200",
      winCta:
        "inline-flex min-h-[48px] min-w-[160px] touch-manipulation items-center justify-center rounded-lg bg-cyan-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-cyan-500 active:scale-95",
      textInput:
        "w-full rounded-lg border-2 border-zinc-600/50 bg-black/40 px-4 py-3 text-base text-zinc-100 shadow-inner shadow-black/20 placeholder:text-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:ring-offset-2 focus:ring-offset-zinc-950 sm:py-3.5 sm:text-lg",
      primaryBtn:
        "w-full min-h-[48px] touch-manipulation rounded-lg bg-cyan-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-cyan-900/35 transition-all duration-300 hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-400/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none active:scale-[0.98] sm:py-4 sm:text-lg",
      choiceBtn:
        "min-h-[52px] w-full touch-manipulation rounded-xl border-2 border-zinc-600/55 bg-slate-900/60 px-6 py-4 text-left text-lg font-semibold text-zinc-100 shadow-sm shadow-black/25 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/90 hover:bg-cyan-500/[0.12] hover:text-cyan-50 hover:shadow-[0_0_18px_rgba(34,211,238,0.45),0_0_28px_rgba(6,182,212,0.25),0_8px_24px_rgba(0,0,0,0.35)] active:scale-[0.98] md:text-xl",
      imageChoiceCard:
        "group flex min-h-[100px] flex-col overflow-hidden rounded-xl border-2 border-zinc-600/50 bg-zinc-800/40 shadow-sm shadow-black/25 transition-all duration-300 hover:border-cyan-500/75 hover:bg-zinc-800/60 hover:shadow-[0_0_24px_rgba(34,211,238,0.18)] sm:min-h-[120px]",
      imageChoiceIcon:
        "flex h-14 w-14 items-center justify-center rounded-full bg-cyan-950/55 text-3xl text-cyan-300/90",
      imageChoiceCaption: "text-center text-sm font-medium text-zinc-100 group-hover:text-cyan-100",
      imageChoiceSelect:
        "min-h-[44px] w-full touch-manipulation border-t-2 border-zinc-600/40 bg-zinc-800/50 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition-all duration-300 hover:border-cyan-500/65 hover:bg-cyan-500/12 hover:text-cyan-100 hover:shadow-[inset_0_0_20px_rgba(34,211,238,0.1)] active:scale-[0.98]",
      attemptBadge: "rounded-full border-2 border-cyan-500/55 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-300",
      descMuted: "text-sm text-cyan-500/85",
      storyHeading: "mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-400/95",
      puzzlePanel: "rounded-xl border border-cyan-500/30 bg-cyan-950/28 px-5 py-5 sm:px-6 sm:py-6",
      puzzlePrompt: "text-center text-lg font-semibold text-cyan-300 sm:text-xl",
      lightboxClose:
        "absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-white shadow-lg transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-400",
    },
    result: {
      spinner: "border-cyan-400 border-t-transparent",
      gameTitleBar: "text-sm font-medium uppercase tracking-wider text-cyan-400/95",
      mainTitle: "mt-2 text-2xl font-bold text-cyan-300 sm:text-3xl",
      avatarBorder: "border-cyan-500/50",
      scoreCard: "rounded-xl border border-cyan-500/30 bg-cyan-950/20 px-4 py-5 sm:px-6 sm:py-6",
      scoreTitle: "text-center text-lg font-semibold text-cyan-200 sm:text-xl",
      breakdownTitle: "text-center text-base font-semibold text-cyan-400/95 sm:text-lg",
      tabActive: "bg-cyan-600 text-white",
      tabInactive: "bg-zinc-800 text-zinc-300",
      rowScore: "tabular-nums text-cyan-300/95",
      lbAvatarBorder: "border-cyan-500/50",
      sectionTitle: "text-base font-semibold text-cyan-400/95 sm:text-lg",
      btnGhost:
        "inline-flex min-h-[52px] min-w-[220px] flex-shrink-0 items-center justify-center rounded-xl border-2 border-cyan-600/60 bg-transparent px-8 py-3.5 text-lg font-semibold text-cyan-100/95 transition-colors hover:border-cyan-500/80 hover:bg-cyan-900/25 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-[0.98]",
      btnPrimary:
        "inline-flex min-h-[52px] min-w-[220px] flex-shrink-0 items-center justify-center rounded-xl bg-cyan-600 px-8 py-3.5 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-[0.98]",
    },
    gameOver: {
      spinner: "border-cyan-400 border-t-transparent",
      card: "w-full max-w-md rounded-2xl border border-cyan-600/50 bg-zinc-900 px-6 py-8 shadow-xl sm:px-8 sm:py-10",
      title: "text-center text-xl font-bold text-cyan-300 sm:text-2xl",
      primaryBtn:
        "min-h-[48px] rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-cyan-500 active:scale-[0.98]",
    },
    intro: {
      backButton:
        "rounded-xl border border-cyan-700/50 bg-cyan-950/85 px-4 py-2.5 text-base font-medium text-cyan-100 shadow-lg backdrop-blur-sm transition-colors hover:border-cyan-500/60 hover:bg-cyan-900/70 hover:text-white active:scale-[0.98] sm:min-h-[44px] sm:px-4",
      panelGradient: "bg-gradient-to-b from-cyan-950/85 via-slate-950/70 to-zinc-950/95",
      h1: "mb-3 text-2xl font-bold tracking-tight text-cyan-100 sm:text-3xl md:text-4xl",
      audioBox: "rounded-lg border border-cyan-700/45 bg-cyan-950/40 px-3 py-2.5",
      audioLabel: "mb-2 text-sm font-medium text-cyan-100/95",
      audioRow: "flex items-center gap-2 rounded-lg border border-cyan-700/45 bg-cyan-950/40 px-3 py-2",
      audioRowText: "text-sm text-cyan-200/90",
      sectionHeading: "mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-400/95 sm:text-base",
      bodyText: "whitespace-pre-line text-base leading-relaxed text-cyan-50/95 sm:text-base",
      rulesList: "list-inside list-disc space-y-1.5 text-base leading-relaxed text-cyan-50/95 sm:text-base",
    },
    introModal: {
      outerGlow:
        "pointer-events-none absolute -inset-1 rounded-[1.35rem] bg-gradient-to-br from-cyan-400/35 via-teal-600/20 to-transparent opacity-90 blur-sm sm:-inset-2 sm:rounded-[1.75rem] lg:-inset-3",
      frame:
        "relative overflow-hidden rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-b from-zinc-900/98 via-zinc-950/98 to-black/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(34,211,238,0.12)] ring-2 ring-cyan-400/30 sm:p-10 md:p-12 lg:p-14 xl:p-16 sm:rounded-[1.75rem]",
      corner: "border-cyan-400/55",
      outerShadowGlow:
        "pointer-events-none absolute inset-0 rounded-3xl shadow-[0_0_100px_rgba(34,211,238,0.22),0_0_180px_rgba(13,148,136,0.14)] sm:rounded-[1.75rem]",
      radialOverlay:
        "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.16),transparent_55%)]",
      modalTitle:
        "text-balance text-xl font-bold leading-tight tracking-tight text-cyan-200 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl",
      modalBody:
        "mt-6 max-w-3xl text-pretty text-sm leading-relaxed text-cyan-100/90 sm:mt-8 sm:text-base md:text-lg md:leading-relaxed lg:mt-10 lg:text-xl lg:leading-relaxed",
      modalBodySecond:
        "mt-5 max-w-3xl text-pretty text-sm leading-relaxed text-cyan-100/90 sm:mt-6 sm:text-base md:text-lg md:leading-relaxed lg:text-xl lg:leading-relaxed",
      modalCta:
        "ranking-modal-cta mt-8 min-h-[48px] w-full max-w-md touch-manipulation rounded-2xl bg-gradient-to-b from-cyan-500 to-teal-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_32px_rgba(34,211,238,0.45),0_12px_28px_rgba(0,0,0,0.45)] ring-2 ring-cyan-400/40 transition-all duration-300 hover:from-cyan-400 hover:to-teal-500 hover:shadow-[0_0_48px_rgba(45,212,191,0.45),0_16px_36px_rgba(0,0,0,0.5)] hover:ring-cyan-300/50 active:scale-[0.98] sm:mt-10 sm:min-h-[56px] sm:max-w-lg sm:py-4 sm:text-base lg:mt-12 lg:min-h-[64px] lg:max-w-xl lg:text-lg",
      btnGhost:
        "flex-1 min-h-[56px] touch-manipulation rounded-xl border-2 border-cyan-600/60 bg-transparent px-6 py-4 text-lg font-semibold text-cyan-100/95 transition-colors hover:border-cyan-500/80 hover:bg-cyan-900/25 active:scale-[0.98] sm:min-h-[64px] sm:text-xl",
      btnPrimary:
        "flex-1 min-h-[56px] touch-manipulation rounded-xl bg-cyan-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-cyan-900/35 transition-all hover:bg-cyan-500 hover:shadow-cyan-400/25 active:scale-[0.98] sm:min-h-[64px] sm:text-xl",
      startMain:
        "w-full min-h-[64px] touch-manipulation rounded-xl bg-cyan-600 px-8 py-5 text-xl font-bold text-white shadow-lg shadow-cyan-900/45 transition-all hover:bg-cyan-500 hover:shadow-cyan-400/30 active:scale-[0.98] sm:min-h-[72px] sm:text-2xl",
    },
    gameRoom: {
      sidebar:
        "box-border flex w-full min-w-0 flex-col gap-4 rounded-2xl border border-cyan-500/25 bg-gradient-to-b from-[#0c1929] to-[#0a1628] p-5 shadow-[0_0_35px_rgba(34,211,238,0.14)] xl:fixed xl:top-28 xl:z-[35] xl:max-h-[calc(100vh-7.5rem)] xl:w-[400px] xl:overflow-hidden xl:pr-1 xl:shadow-[0_0_40px_rgba(34,211,238,0.16)] xl:right-[max(1rem,calc((100vw-1800px)/2+3.5rem))]",
      contentCard:
        "w-full min-w-0 rounded-2xl border border-cyan-500/15 bg-[#0b1120]/85 p-5 shadow-[0_0_30px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6 lg:p-8 xl:p-10",
      tacticalPanel:
        "room-tactical-panel flex min-h-0 w-full min-w-0 flex-1 flex-col gap-3 overflow-hidden rounded-2xl border-2 border-cyan-500/45 bg-gradient-to-b from-zinc-900/85 via-zinc-950/95 to-zinc-950 p-4 shadow-[0_0_48px_rgba(34,211,238,0.12),inset_0_1px_0_rgba(34,211,238,0.1)] ring-1 ring-cyan-950/50 sm:gap-3.5 sm:p-5",
    },
    roomPage: {
      mapStripBorder: "border-cyan-900/45",
      mapTitle: "text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/95",
      headerLinkHover: "hover:text-cyan-400",
    },
  },
} as const;

export type GameUiTokens = (typeof THEME_UI)[VisualThemeId];

export function getThemeUi(theme: VisualThemeId): GameUiTokens {
  return THEME_UI[theme];
}
