function getSessionStorageKey(playerKey: string, gameSlug: string): string {
  return `gameSession:${playerKey}:${gameSlug}`;
}

export interface GameSession {
  gameSlug: string;
  startedAt: number;
  durationSeconds: number;
  /** Süre cezası (yanlış cevap): toplam eklenen saniye. */
  penaltySeconds: number;
  currentRoomId: number;
  solvedRoomIds: number[];
  unlockedRoomIds: number[];
  attemptsByRoom: Record<number, number>;
  hintUsedCount: number;
  roomsSolvedFirstTry: number;
  escaped: boolean;
}

/** Skor kırılımı: ekranda veya debug'da gösterim için. */
export interface ScoreBreakdown {
  baseStartScore: number;
  roomCompletionScore: number;
  firstTryBonus: number;
  speedBonus: number;
  mistakesPenalty: number;
  hintsPenalty: number;
  finalBaseScore: number;
}

export interface ScoreResult {
  finalScore: number;
  remainingTime: number;
  totalAttempts: number;
  roomsSolvedFirstTry: number;
  roomsSolvedSecondTry: number;
  scoreBreakdown: ScoreBreakdown;
}

/**
 * Leaderboard-ready result for a completed game run.
 * Use createGameResult(session, playerName) to build from a session.
 */
export interface GameResult {
  gameSlug: string;
  playerName: string;
  finalScore: number;
  remainingTime: number;
  totalAttempts: number;
  attemptsByRoom: Record<number, number>;
  roomsSolvedFirstTry: number;
  hintUsedCount: number;
  completedAt: number;
}

/** Build a GameResult from a completed session. */
export function createGameResult(
  session: GameSession,
  playerName: string = ""
): GameResult {
  const score = calculateScore(session);
  const totalAttempts =
    Object.values(session.attemptsByRoom).reduce((a, b) => a + b, 0);

  return {
    gameSlug: session.gameSlug,
    playerName,
    finalScore: score.finalScore,
    remainingTime: score.remainingTime,
    totalAttempts,
    attemptsByRoom: { ...session.attemptsByRoom },
    roomsSolvedFirstTry: score.roomsSolvedFirstTry,
    hintUsedCount: session.hintUsedCount ?? 0,
    completedAt: Date.now(),
  };
}

const BASE_START_SCORE = 500;
const ROOM_COMPLETION_PER_ROOM = 180;
const FIRST_TRY_BONUS_PER_ROOM = 70;
const SPEED_BONUS_MAX = 700;
const MISTAKES_PENALTY_PER = 35;
const HINTS_PENALTY_PER = 90;

/**
 * Skor kırılımını hesaplar. totalTime = oyun süresi (saniye, config'den).
 * baseScore = 500 + (solvedRooms*180) + (roomsSolvedFirstTry*70) + round(700*remainingTime/totalTime) - (mistakes*35) - (hintsUsed*90)
 */
export function computeScoreBreakdown(
  solvedRooms: number,
  roomsSolvedFirstTry: number,
  remainingTime: number,
  totalTime: number,
  mistakes: number,
  hintsUsed: number
): ScoreBreakdown {
  const baseStartScore = BASE_START_SCORE;
  const roomCompletionScore = solvedRooms * ROOM_COMPLETION_PER_ROOM;
  const firstTryBonus = roomsSolvedFirstTry * FIRST_TRY_BONUS_PER_ROOM;
  const speedRatio = totalTime > 0 ? remainingTime / totalTime : 0;
  const speedBonus = Math.round(SPEED_BONUS_MAX * speedRatio);
  const mistakesPenalty = mistakes * MISTAKES_PENALTY_PER;
  const hintsPenalty = hintsUsed * HINTS_PENALTY_PER;
  const finalBaseScore = Math.max(
    0,
    baseStartScore +
      roomCompletionScore +
      firstTryBonus +
      speedBonus -
      mistakesPenalty -
      hintsPenalty
  );
  return {
    baseStartScore,
    roomCompletionScore,
    firstTryBonus,
    speedBonus,
    mistakesPenalty,
    hintsPenalty,
    finalBaseScore,
  };
}

/** Calculate final score from session. Uses new differentiated formula. */
export function calculateScore(session: GameSession): ScoreResult {
  const remainingTime = getRemainingTime(session);
  const totalTime = session.durationSeconds;
  const totalAttempts = Object.values(session.attemptsByRoom).reduce(
    (a, b) => a + b,
    0
  );

  let roomsSolvedFirstTry = 0;
  let roomsSolvedSecondTry = 0;
  for (const roomId of session.solvedRoomIds) {
    const attempts = session.attemptsByRoom[roomId] ?? 0;
    if (attempts === 0) roomsSolvedFirstTry++;
    else if (attempts === 1) roomsSolvedSecondTry++;
  }

  const solvedRooms = session.solvedRoomIds.length;
  const hintsUsed = session.hintUsedCount ?? 0;

  const scoreBreakdown = computeScoreBreakdown(
    solvedRooms,
    roomsSolvedFirstTry,
    remainingTime,
    totalTime,
    totalAttempts,
    hintsUsed
  );

  if (typeof console !== "undefined" && console.log) {
    console.log("[score] breakdown", {
      solvedRooms,
      roomsSolvedFirstTry,
      remainingTime,
      totalTime,
      speedBonus: scoreBreakdown.speedBonus,
      mistakesPenalty: scoreBreakdown.mistakesPenalty,
      hintsPenalty: scoreBreakdown.hintsPenalty,
      finalBaseScore: scoreBreakdown.finalBaseScore,
    });
  }

  return {
    finalScore: scoreBreakdown.finalBaseScore,
    remainingTime,
    totalAttempts,
    roomsSolvedFirstTry,
    roomsSolvedSecondTry,
    scoreBreakdown,
  };
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (value === null) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getSession(playerKey: string, gameSlug: string): GameSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(getSessionStorageKey(playerKey, gameSlug));
  const session = safeParse<GameSession | null>(raw, null);
  if (!session || session.gameSlug !== gameSlug) return null;
  return session;
}

export function hasSession(playerKey: string, gameSlug: string): boolean {
  return getSession(playerKey, gameSlug) !== null;
}

/** Creates game session and starts timer (startedAt = now). Call only when user clicks "Oyunu Başlat". */
export function createSession(
  playerKey: string,
  gameSlug: string,
  durationSeconds: number,
  firstRoomId: number
): void {
  if (typeof window === "undefined") return;
  const session: GameSession = {
    gameSlug,
    startedAt: Date.now(), // timer starts at this moment
    durationSeconds,
    penaltySeconds: 0,
    currentRoomId: firstRoomId,
    solvedRoomIds: [],
    unlockedRoomIds: [firstRoomId],
    attemptsByRoom: {},
    hintUsedCount: 0,
    roomsSolvedFirstTry: 0,
    escaped: false,
  };
  localStorage.setItem(
    getSessionStorageKey(playerKey, gameSlug),
    JSON.stringify(session)
  );
}

export function updateSession(
  playerKey: string,
  gameSlug: string,
  updates: Partial<Pick<GameSession, "currentRoomId" | "solvedRoomIds" | "unlockedRoomIds" | "attemptsByRoom" | "hintUsedCount" | "roomsSolvedFirstTry" | "escaped" | "penaltySeconds">>
): void {
  if (typeof window === "undefined") return;
  const session = getSession(playerKey, gameSlug);
  if (!session) return;
  const next: GameSession = { ...session, ...updates };
  localStorage.setItem(
    getSessionStorageKey(playerKey, gameSlug),
    JSON.stringify(next)
  );
}

export function clearSession(playerKey: string, gameSlug: string): void {
  if (typeof window === "undefined") return;
  const session = getSession(playerKey, gameSlug);
  if (session) {
    localStorage.removeItem(getSessionStorageKey(playerKey, gameSlug));
  }
}

/** Remaining time in seconds, computed from startedAt minus penalty. */
export function getRemainingTime(session: GameSession): number {
  const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
  const penalty = session.penaltySeconds ?? 0;
  return Math.max(0, session.durationSeconds - elapsed - penalty);
}

/**
 * Completion time in seconds (bitirme süresi): elapsed time to finish the game.
 * Used for leaderboard and future averageCompletionTime (e.g. "Tüm Odadan Kaçış Oyunları").
 */
export function getCompletionTime(session: GameSession): number {
  const remaining = getRemainingTime(session);
  const penalty = session.penaltySeconds ?? 0;
  return Math.max(0, session.durationSeconds - penalty - remaining);
}
