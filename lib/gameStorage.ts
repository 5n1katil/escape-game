/**
 * Game storage - delegates to gameSession for persistent session data.
 * Kept for backward compatibility with existing components.
 */
import {
  clearSession,
  createSession,
  getRemainingTime,
  getSession,
  updateSession,
} from "./gameSession";

export function getStoredCurrentRoom(slug: string): number | null {
  const session = getSession(slug);
  if (!session) return null;
  return session.currentRoomId;
}

export function setStoredCurrentRoom(slug: string, roomId: number): void {
  updateSession(slug, { currentRoomId: roomId });
}

export function getStoredAttempts(slug: string, roomId?: number): number | null {
  const session = getSession(slug);
  if (!session) return null;
  const rid = roomId ?? session.currentRoomId;
  return session.attemptsByRoom[rid] ?? 0;
}

export function setStoredAttempts(
  slug: string,
  value: number,
  roomId?: number
): void {
  const session = getSession(slug);
  if (!session) return;
  const rid = roomId ?? session.currentRoomId;
  updateSession(slug, {
    attemptsByRoom: { ...session.attemptsByRoom, [rid]: value },
  });
}

export function getStoredRemainingTime(slug: string): number | null {
  const session = getSession(slug);
  if (!session) return null;
  return getRemainingTime(session);
}

export function setStoredRemainingTime(slug: string, value: number): void {
  // Session uses startedAt; remainingTime is computed. We persist elapsed instead.
  // For timer tick accuracy, we could store "lastSyncedAt" - but getRemainingTime
  // already computes from startedAt. No need to persist remainingTime.
}

export function getStoredEscaped(slug: string): boolean | null {
  const session = getSession(slug);
  if (!session) return null;
  return session.escaped;
}

export function setStoredEscaped(slug: string, value: boolean): void {
  updateSession(slug, { escaped: value });
}

export function getStoredMaxSolvedRoomIndex(
  slug: string,
  roomIds?: number[]
): number {
  const ids = roomIds ?? [1, 2, 3, 4, 5, 6];
  const session = getSession(slug);
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
  const session = getSession(slug);
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
  updateSession(slug, {
    solvedRoomIds: newSolved,
    unlockedRoomIds: newUnlocked,
    roomsSolvedFirstTry: newRoomsSolvedFirstTry,
  });
}

export function initGameState(slug: string, durationSeconds: number): void {
  createSession(slug, durationSeconds, 1);
}

export function clearGameState(slug: string): void {
  clearSession(slug);
}
