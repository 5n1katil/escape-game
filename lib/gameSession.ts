const SESSION_KEY = "escape-game-session";

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

export interface ScoreResult {
  finalScore: number;
  remainingTime: number;
  totalAttempts: number;
  roomsSolvedFirstTry: number;
  roomsSolvedSecondTry: number;
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

/** Calculate final score from session. */
export function calculateScore(session: GameSession): ScoreResult {
  const remainingTime = getRemainingTime(session);
  const remainingMinutes = Math.floor(remainingTime / 60);
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

  let score = 1000;
  score += remainingMinutes * 10;
  score += roomsSolvedFirstTry * 50;
  score += roomsSolvedSecondTry * 20;
  score -= totalAttempts * 15;
  score -= (session.hintUsedCount ?? 0) * 40;
  score = Math.max(0, score);

  return {
    finalScore: score,
    remainingTime,
    totalAttempts,
    roomsSolvedFirstTry,
    roomsSolvedSecondTry,
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

export function getSession(gameSlug: string): GameSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  const session = safeParse<GameSession | null>(raw, null);
  if (!session || session.gameSlug !== gameSlug) return null;
  return session;
}

export function hasSession(gameSlug: string): boolean {
  return getSession(gameSlug) !== null;
}

/** Creates game session and starts timer (startedAt = now). Call only when user clicks "Oyunu Başlat". */
export function createSession(
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
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function updateSession(
  gameSlug: string,
  updates: Partial<Pick<GameSession, "currentRoomId" | "solvedRoomIds" | "unlockedRoomIds" | "attemptsByRoom" | "hintUsedCount" | "roomsSolvedFirstTry" | "escaped" | "penaltySeconds">>
): void {
  if (typeof window === "undefined") return;
  const session = getSession(gameSlug);
  if (!session) return;
  const next: GameSession = { ...session, ...updates };
  localStorage.setItem(SESSION_KEY, JSON.stringify(next));
}

export function clearSession(gameSlug: string): void {
  if (typeof window === "undefined") return;
  const session = getSession(gameSlug);
  if (session) {
    localStorage.removeItem(SESSION_KEY);
  }
}

/** Remaining time in seconds, computed from startedAt minus penalty. */
export function getRemainingTime(session: GameSession): number {
  const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
  const penalty = session.penaltySeconds ?? 0;
  return Math.max(0, session.durationSeconds - elapsed - penalty);
}
