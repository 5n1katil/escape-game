import { initializeApp } from "firebase/app";
import { get, getDatabase, ref, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyChKoVNt3S_o1EIHgBMdJB7meGIjrR4h5c",
  authDomain: "n1dedektif-leaderboard.firebaseapp.com",
  databaseURL: "https://n1dedektif-leaderboard-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "n1dedektif-leaderboard",
  storageBucket: "n1dedektif-leaderboard.firebasestorage.app",
  messagingSenderId: "722473343378",
  appId: "1:722473343378:web:05d148f6e42bcfa4bf094b"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

const LEADERBOARD_BASE_PATH = "leaderboards";
const PLAYER_STATS_PATH = "playerGameStats";
const GLOBAL_LEADERBOARD_PATH = "globalLeaderboard";
const USERS_PATH = "users";

/**
 * Saves score to Firebase. Leaderboard stores completion time (bitirme süresi).
 * @param completionTimeSeconds - Bitirme süresi (saniye). Firebase'de "time" anahtarıyla yazılır (geri uyumluluk).
 */
export async function saveScore(
  playerName: string,
  gameKey: string,
  score: number,
  completionTimeSeconds: number,
  mistakes: number,
  memberId?: string | null,
  avatarUrl?: string | null
) {
  console.log("[saveScore] called", {
    playerName,
    gameKey,
    score,
    completionTimeSeconds,
    mistakes,
    memberId,
    avatarUrl,
  });

  const safePlayerName = playerName.trim().replace(/[.#$/\[\]]/g, "_");
  const safeMemberId = String(memberId ?? "").trim().replace(/[.#$/\[\]]/g, "_");
  if (safePlayerName !== playerName.trim()) {
    console.log("[saveScore] sanitized name", { from: playerName.trim(), to: safePlayerName });
  }

  const safeGameKey = String(gameKey ?? "").trim() || "unknown-game";
  // Primary identity key: memberId, fallback: playerName key for backward compatibility.
  const identityKey = safeMemberId || safePlayerName || "Dedektif";
  console.log("SAVE identityKey:", identityKey, "memberId:", memberId ?? null);
  const type = "escape_room";

  // Multi-game leaderboard path:
  // leaderboards/{type}/{gameKey}/{playerKey}
  const leaderboardPath = `${LEADERBOARD_BASE_PATH}/${type}/${safeGameKey}/${identityKey}`;
  const statsPath = `${PLAYER_STATS_PATH}/${identityKey}/${safeGameKey}`;
  const userPath = `${USERS_PATH}/${identityKey}`;
  console.log("[saveScore] writing to paths:", { leaderboardPath, statsPath, userPath });

  const leaderboardRef = ref(db, leaderboardPath);
  const statsRef = ref(db, statsPath);
  const userRef = ref(db, userPath);

  try {
    // Read player stats for this game (attempts + best values).
    const statsSnap = await get(statsRef);
    const statsExisting = statsSnap.exists()
      ? (statsSnap.val() as {
          attemptCount?: unknown;
          hasCompleted?: unknown;
          firstCompletionScore?: unknown;
          firstCompletionTime?: unknown;
          firstCompletionMistakes?: unknown;
          firstCompletionAttempt?: unknown;
          lastBaseScore?: unknown;
          lastFinalScore?: unknown;
          lastTime?: unknown;
          lastPlayedAt?: unknown;
        } | null)
      : null;
    const oldAttemptCount =
      typeof statsExisting?.attemptCount === "number" && Number.isFinite(statsExisting.attemptCount)
        ? statsExisting.attemptCount
        : 0;

    const attemptCount = oldAttemptCount + 1;
    // Single source of truth: score comes from final snapshot; do not recalculate here.
    const finalScore = Math.round(score);
    const now = Date.now();

    console.log("[saveScore] snapshot score", {
      oldAttemptCount,
      attemptCount,
      snapshotScore: score,
      finalScore,
    });

    // Read current leaderboard entry to decide if this is a new best.
    const lbSnap = await get(leaderboardRef);
    const lbExisting = lbSnap.exists()
      ? (lbSnap.val() as { score?: unknown; time?: unknown; mistakes?: unknown } | null)
      : null;
    const currentBestScore =
      typeof lbExisting?.score === "number" && Number.isFinite(lbExisting.score)
        ? lbExisting.score
        : null;

    // İlk başarılı bitiriş mantığı: daha önce tamamlamış mı?
    const hasCompletedBefore =
      statsExisting?.hasCompleted === true;
    const isFirstSuccessfulCompletion = !hasCompletedBefore;

    // İlk completion alanları: varsa koru, yoksa ilk başarılı tamamlamada doldur.
    const existingFirstScore =
      typeof statsExisting?.firstCompletionScore === "number" &&
      Number.isFinite(statsExisting.firstCompletionScore)
        ? statsExisting.firstCompletionScore
        : undefined;
    const existingFirstTime =
      typeof statsExisting?.firstCompletionTime === "number" &&
      Number.isFinite(statsExisting.firstCompletionTime)
        ? statsExisting.firstCompletionTime
        : undefined;
    const existingFirstMistakes =
      typeof statsExisting?.firstCompletionMistakes === "number" &&
      Number.isFinite(statsExisting.firstCompletionMistakes)
        ? statsExisting.firstCompletionMistakes
        : undefined;
    const existingFirstAttempt =
      typeof statsExisting?.firstCompletionAttempt === "number" &&
      Number.isFinite(statsExisting.firstCompletionAttempt)
        ? statsExisting.firstCompletionAttempt
        : undefined;

    const firstCompletionScore = isFirstSuccessfulCompletion
      ? finalScore
      : existingFirstScore;
    const firstCompletionTime = isFirstSuccessfulCompletion
      ? completionTimeSeconds
      : existingFirstTime;
    const firstCompletionMistakes = isFirstSuccessfulCompletion
      ? mistakes
      : existingFirstMistakes;
    const firstCompletionAttempt = isFirstSuccessfulCompletion
      ? attemptCount
      : existingFirstAttempt;

    const statsUpdatePayload: Record<string, unknown> = {
      memberId: safeMemberId || null,
      playerName: playerName.trim(),
      avatarUrl: avatarUrl ?? null,
      type,
      game: safeGameKey,
      attemptCount,
      lastBaseScore: score,
      lastFinalScore: finalScore,
      lastTime: completionTimeSeconds,
      lastPlayedAt: now,
      updatedAt: now,
      hasCompleted: true,
    };
    if (firstCompletionScore !== undefined) statsUpdatePayload.firstCompletionScore = firstCompletionScore;
    if (firstCompletionTime !== undefined) statsUpdatePayload.firstCompletionTime = firstCompletionTime;
    if (firstCompletionMistakes !== undefined) statsUpdatePayload.firstCompletionMistakes = firstCompletionMistakes;
    if (firstCompletionAttempt !== undefined) statsUpdatePayload.firstCompletionAttempt = firstCompletionAttempt;

    await update(statsRef, statsUpdatePayload);

    if (isFirstSuccessfulCompletion || currentBestScore === null) {
      // İlk başarılı tamamlanış: leaderboard'a sadece bir kez yazılır.
      // score = attempt cezası uygulanmış finalScore, time = completionTimeSeconds (bitirme süresi).
      await update(leaderboardRef, {
        memberId: safeMemberId || null,
        name: playerName.trim(),
        playerName: playerName.trim(),
        avatarUrl: avatarUrl ?? null,
        score: finalScore,
        time: completionTimeSeconds,
        mistakes,
        // Leaderboard deneme değeri first completion denemesidir; sonraki denemelerde değişmez.
        attemptCount: firstCompletionAttempt ?? attemptCount,
        firstCompletionAttempt: firstCompletionAttempt ?? attemptCount,
        type,
        game: safeGameKey,
        updatedAt: now,
      });
      console.log("[saveScore] success (first completion, leaderboard created)");
    } else {
      console.log("[saveScore] success (stats updated, leaderboard unchanged)");
    }

    // Keep user profile node updated (display-only fields).
    await update(userRef, {
      memberId: safeMemberId || null,
      playerName: playerName.trim(),
      avatarUrl: avatarUrl ?? null,
      updatedAt: now,
    });

    // --- Global total leaderboard: sum bestFinalScore across all games for this player ---
    try {
      const allStatsRef = ref(db, `${PLAYER_STATS_PATH}/${identityKey}`);
      const allStatsSnap = await get(allStatsRef);
      if (allStatsSnap.exists()) {
        const allStats = allStatsSnap.val() as Record<
          string,
          { firstCompletionScore?: unknown; bestFinalScore?: unknown }
        >;
        let totalScore = 0;
        let gamesPlayed = 0;
        for (const gameId of Object.keys(allStats)) {
          const entry = allStats[gameId];
          // Global leaderboard: her oyundan yalnızca firstCompletionScore kullanılır.
          const first =
            entry &&
            typeof entry.firstCompletionScore === "number" &&
            Number.isFinite(entry.firstCompletionScore)
              ? entry.firstCompletionScore
              : null;
          // Eski veriler için fallback: bestFinalScore varsa onu kullan.
          const effective = first !== null
            ? first
            : entry &&
              typeof entry.bestFinalScore === "number" &&
              Number.isFinite(entry.bestFinalScore)
                ? entry.bestFinalScore
                : null;
          if (effective !== null) {
            totalScore += effective;
            gamesPlayed += 1;
          }
        }

        const globalRef = ref(db, `${GLOBAL_LEADERBOARD_PATH}/${identityKey}`);
        await update(globalRef, {
          memberId: safeMemberId || null,
          name: playerName.trim(),
          playerName: playerName.trim(),
          avatarUrl: avatarUrl ?? null,
          totalScore,
          gamesPlayed,
          updatedAt: now,
        });
      }
    } catch (err) {
      console.warn("[saveScore] global leaderboard update failed", err);
    }

    return {
      attemptCount,
      finalScore,
      isFirstSuccessfulCompletion,
    };
  } catch (error) {
    console.error("[saveScore] failed", error);
    throw error;
  }
}
