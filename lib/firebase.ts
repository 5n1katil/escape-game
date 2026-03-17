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

const LEADERBOARD_PATH = "leaderboards/escape_room/players";
const PLAYER_STATS_PATH = "playerGameStats";

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

  const leaderboardPath = `${LEADERBOARD_PATH}/${playerKey}`;
  const statsPath = `${PLAYER_STATS_PATH}/${playerKey}/${safeGameKey}`;
  console.log("[saveScore] writing to paths:", { leaderboardPath, statsPath });

  const leaderboardRef = ref(db, leaderboardPath);
  const statsRef = ref(db, statsPath);

  try {
    // Read attemptCount from playerGameStats (NOT from leaderboard record).
    const snapshot = await get(statsRef);
    const existing = snapshot.exists()
      ? (snapshot.val() as { attemptCount?: unknown } | null)
      : null;
    const oldAttemptCount =
      typeof existing?.attemptCount === "number" && Number.isFinite(existing.attemptCount)
        ? existing.attemptCount
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

    await update(statsRef, {
      playerName: playerName.trim(),
      type: "escape_room",
      game: safeGameKey,
      attemptCount,
      lastBaseScore: score,
      lastFinalScore: finalScore,
      lastTime: time,
      lastMultiplier: multiplier,
      lastPlayedAt: now,
      updatedAt: now,
    });

    await update(leaderboardRef, {
      score: finalScore,
      time,
      mistakes,
    });
    console.log("[saveScore] success");
  } catch (error) {
    console.error("[saveScore] failed", error);
    throw error;
  }
}
