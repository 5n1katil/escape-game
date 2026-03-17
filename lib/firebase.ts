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

function getAttemptMultiplier(attemptCount: number): number {
  if (attemptCount <= 1) return 1.0;
  if (attemptCount === 2) return 0.8;
  if (attemptCount === 3) return 0.6;
  return 0.4;
}

export async function saveScore(
  playerName: string,
  gameKey: string,
  score: number,
  time: number,
  mistakes: number
) {
  console.log("[saveScore] called", {
    playerName,
    gameKey,
    score,
    time,
    mistakes,
  });

  const safePlayerName = playerName.trim().replace(/[.#$/\[\]]/g, "_");
  if (safePlayerName !== playerName.trim()) {
    console.log("[saveScore] sanitized name", { from: playerName.trim(), to: safePlayerName });
  }

  const safeGameKey = String(gameKey ?? "").trim() || "unknown-game";
  const playerKey = safePlayerName || "Dedektif";
  const type = "escape_room";

  // Multi-game leaderboard path:
  // leaderboards/{type}/{gameKey}/{playerKey}
  const leaderboardPath = `${LEADERBOARD_BASE_PATH}/${type}/${safeGameKey}/${playerKey}`;
  const statsPath = `${PLAYER_STATS_PATH}/${playerKey}/${safeGameKey}`;
  console.log("[saveScore] writing to paths:", { leaderboardPath, statsPath });

  const leaderboardRef = ref(db, leaderboardPath);
  const statsRef = ref(db, statsPath);

  try {
    // Read player stats for this game (attempts + best values).
    const statsSnap = await get(statsRef);
    const statsExisting = statsSnap.exists()
      ? (statsSnap.val() as {
          attemptCount?: unknown;
          bestBaseScore?: unknown;
          bestFinalScore?: unknown;
          bestTime?: unknown;
          bestMistakes?: unknown;
        } | null)
      : null;
    const oldAttemptCount =
      typeof statsExisting?.attemptCount === "number" && Number.isFinite(statsExisting.attemptCount)
        ? statsExisting.attemptCount
        : 0;

    const attemptCount = oldAttemptCount + 1;
    const multiplier = getAttemptMultiplier(attemptCount);
    const finalScore = Math.round(score * multiplier);
    const now = Date.now();

    console.log("[saveScore] attempt penalty", {
      oldAttemptCount,
      attemptCount,
      multiplier,
      baseScore: score,
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
    const currentBestTime =
      typeof lbExisting?.time === "number" && Number.isFinite(lbExisting.time)
        ? lbExisting.time
        : null;
    const currentBestMistakes =
      typeof lbExisting?.mistakes === "number" && Number.isFinite(lbExisting.mistakes)
        ? lbExisting.mistakes
        : null;

    let isNewBest = false;
    if (currentBestScore === null) {
      isNewBest = true;
    } else if (finalScore > currentBestScore) {
      isNewBest = true;
    } else if (finalScore === currentBestScore && currentBestTime !== null && time < currentBestTime) {
      isNewBest = true;
    }

    // Best fields in stats: update only when we have a new best.
    const prevBestBase =
      typeof statsExisting?.bestBaseScore === "number" && Number.isFinite(statsExisting.bestBaseScore)
        ? statsExisting.bestBaseScore
        : undefined;
    const prevBestFinal =
      typeof statsExisting?.bestFinalScore === "number" && Number.isFinite(statsExisting.bestFinalScore)
        ? statsExisting.bestFinalScore
        : undefined;
    const prevBestTime =
      typeof statsExisting?.bestTime === "number" && Number.isFinite(statsExisting.bestTime)
        ? statsExisting.bestTime
        : undefined;
    const prevBestMistakes =
      typeof statsExisting?.bestMistakes === "number" && Number.isFinite(statsExisting.bestMistakes)
        ? statsExisting.bestMistakes
        : undefined;

    const bestBaseScore = isNewBest ? score : prevBestBase ?? score;
    const bestFinalScore = isNewBest ? finalScore : prevBestFinal ?? finalScore;
    const bestTime = isNewBest ? time : prevBestTime ?? time;
    const bestMistakes = isNewBest ? mistakes : prevBestMistakes ?? mistakes;

    await update(statsRef, {
      playerName: playerName.trim(),
      type,
      game: safeGameKey,
      attemptCount,
      lastBaseScore: score,
      lastFinalScore: finalScore,
      lastTime: time,
      lastMultiplier: multiplier,
      lastPlayedAt: now,
      updatedAt: now,
      bestBaseScore,
      bestFinalScore,
      bestTime,
      bestMistakes,
    });

    if (isNewBest) {
      await update(leaderboardRef, {
        name: playerName.trim(),
        score: finalScore,
        baseScore: score,
        time,
        mistakes,
        attemptCount,
        type,
        game: safeGameKey,
        updatedAt: now,
      });
      console.log("[saveScore] success (new best)");
    } else {
      console.log("[saveScore] success (stats updated, leaderboard unchanged)");
    }

    // --- Global total leaderboard: sum bestFinalScore across all games for this player ---
    try {
      const allStatsRef = ref(db, `${PLAYER_STATS_PATH}/${playerKey}`);
      const allStatsSnap = await get(allStatsRef);
      if (allStatsSnap.exists()) {
        const allStats = allStatsSnap.val() as Record<
          string,
          { bestFinalScore?: unknown }
        >;
        let totalScore = 0;
        let gamesPlayed = 0;
        for (const gameId of Object.keys(allStats)) {
          const entry = allStats[gameId];
          const best = entry && typeof entry.bestFinalScore === "number" && Number.isFinite(entry.bestFinalScore)
            ? entry.bestFinalScore
            : null;
          if (best !== null) {
            totalScore += best;
            gamesPlayed += 1;
          }
        }

        const globalRef = ref(db, `${GLOBAL_LEADERBOARD_PATH}/${playerKey}`);
        await update(globalRef, {
          name: playerName.trim(),
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
      multiplier,
      finalScore,
      isNewBest,
    };
  } catch (error) {
    console.error("[saveScore] failed", error);
    throw error;
  }
}
