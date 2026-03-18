/**
 * Game storage - delegates to gameSession for persistent session data.
 * Kept for backward compatibility with existing components.
 */
import type { ScoreBreakdown } from "./gameSession";
import {
  clearSession,
  createSession,
  getRemainingTime,
  getSession,
  hasSession,
  updateSession,
} from "./gameSession";

const PLAYER_KEY_PREFIX = "escape-game-player:"; // legacy (slug-based)
const ACTIVE_PLAYER_KEY = "escape-game-active-playerKey";
const ACTIVE_PLAYER_NAME = "escape-game-active-playerName";
const COMPLETED_GAME_RESULT_PREFIX = "completedGameResult:";

export function toPlayerKey(input: string | null | undefined): string {
  const safe = normalizePlayerName(input).trim().replace(/[.#$/\[\]]/g, "_");
  return safe.length > 0 ? safe : "Dedektif";
}

function getPlayerKeyForSlug(slug: string): string {
  return getActivePlayerKey() ?? toPlayerKey(getStoredPlayerName(slug));
}

/**
 * Oyun bittiği anda alınan tek snapshot. Hem result ekranında gösterilir hem saveScore'a aynen gider.
 * Refresh sonrası aynı değerlerin kalması için localStorage'da saklanır.
 */
export interface FinalGameResult {
  score: number;
  completionTime: number;
  remainingTime: number;
  mistakes: number;
  playerName: string;
  slug: string;
  roomsSolvedFirstTry: number;
  roomsSolvedSecondTry: number;
  /** İsteğe bağlı: skor kırılımı (sonuç ekranı / debug). */
  scoreBreakdown?: ScoreBreakdown;
}

export function getCompletedGameResult(
  playerKey: string,
  slug: string
): FinalGameResult | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`${COMPLETED_GAME_RESULT_PREFIX}${playerKey}:${slug}`);
  if (raw === null) return null;
  try {
    const data = JSON.parse(raw) as unknown;
    if (data && typeof data === "object" && "score" in data && "slug" in data) {
      return data as FinalGameResult;
    }
  } catch {
    // ignore
  }
  return null;
}

export function setCompletedGameResult(slug: string, data: FinalGameResult): void {
  if (typeof window === "undefined") return;
  const playerKey = getPlayerKeyForSlug(slug);
  localStorage.setItem(
    `${COMPLETED_GAME_RESULT_PREFIX}${playerKey}:${slug}`,
    JSON.stringify(data)
  );
}

export function clearCompletedGameResult(slug: string): void {
  if (typeof window === "undefined") return;
  const playerKey = getPlayerKeyForSlug(slug);
  localStorage.removeItem(`${COMPLETED_GAME_RESULT_PREFIX}${playerKey}:${slug}`);
}

export function normalizePlayerName(input: string | null | undefined): string {
  const trimmed = (input ?? "").trim();
  return trimmed.length > 0 ? trimmed : "Dedektif";
}

export function getActivePlayerKey(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ACTIVE_PLAYER_KEY);
  const key = (raw ?? "").trim();
  return key.length > 0 ? key : null;
}

export function getActivePlayerName(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ACTIVE_PLAYER_NAME);
  const name = (raw ?? "").trim();
  return name.length > 0 ? name : null;
}

export function getStoredPlayerName(slug: string): string | null {
  if (typeof window === "undefined") return null;
  // Prefer active player identity (user-scoped). Legacy slug-based key only for seeding.
  const active = getActivePlayerName();
  if (active) return active;
  const raw = localStorage.getItem(`${PLAYER_KEY_PREFIX}${slug}`);
  const trimmed = (raw ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function setStoredPlayerName(slug: string, name: string): void {
  if (typeof window === "undefined") return;
  const normalized = normalizePlayerName(name);
  const playerKey = toPlayerKey(normalized);
  localStorage.setItem(ACTIVE_PLAYER_NAME, normalized);
  localStorage.setItem(ACTIVE_PLAYER_KEY, playerKey);
  // Legacy write (slug-based) kept for backward compatibility; session/result keys are playerKey-scoped.
  localStorage.setItem(`${PLAYER_KEY_PREFIX}${slug}`, normalized);
}

export function getStoredCurrentRoom(slug: string): number | null {
  const session = getSession(getPlayerKeyForSlug(slug), slug);
  if (!session) return null;
  return session.currentRoomId;
}

export function setStoredCurrentRoom(slug: string, roomId: number): void {
  updateSession(getPlayerKeyForSlug(slug), slug, { currentRoomId: roomId });
}

export function getStoredAttempts(slug: string, roomId?: number): number | null {
  const session = getSession(getPlayerKeyForSlug(slug), slug);
  if (!session) return null;
  const rid = roomId ?? session.currentRoomId;
  return session.attemptsByRoom[rid] ?? 0;
}

export function setStoredAttempts(
  slug: string,
  value: number,
  roomId?: number
): void {
  const playerKey = getPlayerKeyForSlug(slug);
  const session = getSession(playerKey, slug);
  if (!session) return;
  const rid = roomId ?? session.currentRoomId;
  updateSession(playerKey, slug, {
    attemptsByRoom: { ...session.attemptsByRoom, [rid]: value },
  });
}

export function getStoredRemainingTime(slug: string): number | null {
  const session = getSession(getPlayerKeyForSlug(slug), slug);
  if (!session) return null;
  return getRemainingTime(session);
}

export function setStoredRemainingTime(slug: string, value: number): void {
  // Session uses startedAt; remainingTime is computed. We persist elapsed instead.
  // For timer tick accuracy, we could store "lastSyncedAt" - but getRemainingTime
  // already computes from startedAt. No need to persist remainingTime.
}

export function getStoredEscaped(slug: string): boolean | null {
  const session = getSession(getPlayerKeyForSlug(slug), slug);
  if (!session) return null;
  return session.escaped;
}

export function setStoredEscaped(slug: string, value: boolean): void {
  updateSession(getPlayerKeyForSlug(slug), slug, { escaped: value });
}

/** Yanlış cevap cezası: oda numarasına göre dakika * 60 saniye eklenir. */
export function addPenaltySeconds(slug: string, seconds: number): void {
  const playerKey = getPlayerKeyForSlug(slug);
  const session = getSession(playerKey, slug);
  if (!session) return;
  updateSession(playerKey, slug, {
    penaltySeconds: (session.penaltySeconds ?? 0) + seconds,
  });
}

export function getStoredMaxSolvedRoomIndex(
  slug: string,
  roomIds?: number[]
): number {
  const ids = roomIds ?? [1, 2, 3, 4, 5, 6];
  const session = getSession(getPlayerKeyForSlug(slug), slug);
  if (!session || session.solvedRoomIds.length === 0) return -1;
  const indices = session.solvedRoomIds
    .map((id) => ids.indexOf(id))
    .filter((i) => i >= 0);
  return indices.length > 0 ? Math.max(...indices) : -1;
}

export function setStoredMaxSolvedRoomIndex(
  slug: string,
  roomIndex: number,
  roomIds?: number[],
  attemptsBeforeSolve?: number
): void {
  const ids = roomIds ?? [1, 2, 3, 4, 5, 6];
  const playerKey = getPlayerKeyForSlug(slug);
  const session = getSession(playerKey, slug);
  if (!session) return;
  const roomId = ids[roomIndex];
  if (roomId === undefined) return;
  const newSolved = session.solvedRoomIds.includes(roomId)
    ? session.solvedRoomIds
    : [...session.solvedRoomIds, roomId];
  const nextRoomId = ids[roomIndex + 1];
  const newUnlocked =
    nextRoomId && !session.unlockedRoomIds.includes(nextRoomId)
      ? [...session.unlockedRoomIds, nextRoomId]
      : session.unlockedRoomIds;
  const isFirstTry = (attemptsBeforeSolve ?? 0) === 0;
  const newRoomsSolvedFirstTry = isFirstTry
    ? session.roomsSolvedFirstTry + 1
    : session.roomsSolvedFirstTry;
  updateSession(playerKey, slug, {
    solvedRoomIds: newSolved,
    unlockedRoomIds: newUnlocked,
    roomsSolvedFirstTry: newRoomsSolvedFirstTry,
  });
}

export function initGameState(slug: string, durationSeconds: number): void {
  createSession(getPlayerKeyForSlug(slug), slug, durationSeconds, 1);
}

export function clearGameState(slug: string): void {
  clearSession(getPlayerKeyForSlug(slug), slug);
  clearCompletedGameResult(slug);
}

/** Player-specific session helpers (keyed by playerKey+slug). */
export function getPlayerSession(slug: string) {
  return getSession(getPlayerKeyForSlug(slug), slug);
}

export function hasPlayerSession(slug: string): boolean {
  return hasSession(getPlayerKeyForSlug(slug), slug);
}

export function startNewPlayerSession(slug: string, durationSeconds: number, firstRoomId: number): void {
  createSession(getPlayerKeyForSlug(slug), slug, durationSeconds, firstRoomId);
}

export function restartPlayerSession(slug: string, durationSeconds: number, firstRoomId: number): void {
  const playerKey = getPlayerKeyForSlug(slug);
  clearSession(playerKey, slug);
  clearCompletedGameResult(slug);
  createSession(playerKey, slug, durationSeconds, firstRoomId);
}
