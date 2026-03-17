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

function getAttemptMultiplier(attemptCount: number): number {
  if (attemptCount <= 1) return 1.0;
  if (attemptCount === 2) return 0.8;
  if (attemptCount === 3) return 0.6;
  return 0.4;
}

export async function saveScore(
  playerName: string,
  score: number,
  time: number,
  mistakes: number
) {
  console.log("[saveScore] called", {
    playerName,
    score,
    time,
    mistakes,
  });

  const safePlayerName = playerName.trim().replace(/[.#$/\[\]]/g, "_");
  if (safePlayerName !== playerName.trim()) {
    console.log("[saveScore] sanitized name", { from: playerName.trim(), to: safePlayerName });
  }

  const path = `${LEADERBOARD_PATH}/${safePlayerName}`;
  console.log("[saveScore] writing to path:", path);

  const playerRef = ref(db, path);

  try {
    // Read existing attemptCount (if any) to apply penalty on replays.
    const snapshot = await get(playerRef);
    const existing = snapshot.exists() ? (snapshot.val() as { attemptCount?: unknown } | null) : null;
    const prevAttemptCount =
      typeof existing?.attemptCount === "number" && Number.isFinite(existing.attemptCount)
        ? existing.attemptCount
        : 0;

    const attemptCount = prevAttemptCount + 1;
    const multiplier = getAttemptMultiplier(attemptCount);
    const finalScore = Math.round(score * multiplier);

    console.log("[saveScore] attempt penalty", {
      prevAttemptCount,
      attemptCount,
      multiplier,
      baseScore: score,
      finalScore,
    });

    await update(playerRef, {
      score: finalScore,
      time,
      mistakes,
      attemptCount,
    });
    console.log("[saveScore] success");
  } catch (error) {
    console.error("[saveScore] failed", error);
    throw error;
  }
}
