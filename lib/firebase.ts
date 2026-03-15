import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";

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
    await update(playerRef, {
      score,
      time,
      mistakes,
    });
    console.log("[saveScore] success");
  } catch (error) {
    console.error("[saveScore] failed", error);
    throw error;
  }
}
