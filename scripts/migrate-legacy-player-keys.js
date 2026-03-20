/* eslint-disable no-console */
const admin = require("firebase-admin");
const fs = require("fs");

function parseFlags(argv) {
  const execute = argv.includes("--execute");
  const dryRun = !execute;
  return { dryRun };
}

function isValidUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function looksLikeMemberIdKey(value) {
  if (!value || typeof value !== "string") return false;
  if (isValidUuid(value)) return true;
  return /^[A-Za-z0-9_-]{16,}$/.test(value);
}

function sanitizeKey(value) {
  return String(value ?? "")
    .trim()
    .replace(/[.#$/\[\]]/g, "_");
}

function getMemberIdFromRecord(record) {
  if (!record || typeof record !== "object") return null;
  const raw = record.memberId;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return sanitizeKey(trimmed);
}

function getDatabaseUrl() {
  return (
    process.env.FIREBASE_DATABASE_URL ||
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    "https://n1dedektif-leaderboard-default-rtdb.europe-west1.firebasedatabase.app"
  );
}

function getCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      return admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
    } catch {
      console.error(
        "[migration] FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.\n" +
          "Use one of:\n" +
          "- PowerShell: $env:FIREBASE_SERVICE_ACCOUNT_JSON='{\"type\":\"service_account\",...}'; npm run migrate:legacy-player-keys\n" +
          "- CMD: set FIREBASE_SERVICE_ACCOUNT_JSON={\"type\":\"service_account\",...} && npm run migrate:legacy-player-keys\n" +
          "- macOS/Linux: FIREBASE_SERVICE_ACCOUNT_JSON='{\"type\":\"service_account\",...}' npm run migrate:legacy-player-keys"
      );
      process.exit(1);
    }
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return admin.credential.applicationDefault();
  }
  return admin.credential.applicationDefault();
}

function ensureCredentialSourceOrExit() {
  const hasInlineJson = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const hasCredentialsPath = Boolean(credentialsPath && fs.existsSync(credentialsPath));

  if (hasInlineJson || hasCredentialsPath) return;

  console.error(
    "[migration] Missing Firebase Admin credentials.\n" +
      "Provide ONE of the following before running:\n" +
      "- PowerShell: $env:GOOGLE_APPLICATION_CREDENTIALS='C:\\\\absolute\\\\path\\\\service-account.json'; npm run migrate:legacy-player-keys\n" +
      "- CMD: set GOOGLE_APPLICATION_CREDENTIALS=C:\\absolute\\path\\service-account.json && npm run migrate:legacy-player-keys\n" +
      "- macOS/Linux: GOOGLE_APPLICATION_CREDENTIALS='/absolute/path/service-account.json' npm run migrate:legacy-player-keys\n" +
      "- Or inline JSON: FIREBASE_SERVICE_ACCOUNT_JSON='{\"type\":\"service_account\",...}' npm run migrate:legacy-player-keys"
  );
  process.exit(1);
}

function initFirebaseAdmin() {
  if (admin.apps.length > 0) return admin.app();
  ensureCredentialSourceOrExit();
  return admin.initializeApp({
    credential: getCredential(),
    databaseURL: getDatabaseUrl(),
  });
}

async function migrateIdentityKey(basePath, legacyKey, dryRun) {
  if (looksLikeMemberIdKey(legacyKey)) {
    console.log("[skipped already memberId]", basePath, legacyKey);
    return;
  }

  const db = admin.database();
  const oldRef = db.ref(`${basePath}/${legacyKey}`);
  const oldSnap = await oldRef.once("value");
  if (!oldSnap.exists()) return;

  const record = oldSnap.val();
  const memberId = getMemberIdFromRecord(record);
  if (!memberId) {
    console.log("[unresolved legacy record]", basePath, legacyKey);
    return;
  }

  const newRef = db.ref(`${basePath}/${memberId}`);
  const newSnap = await newRef.once("value");
  if (newSnap.exists()) {
    console.log("[conflict not overwritten]", basePath, legacyKey, "->", memberId);
    return;
  }

  if (dryRun) {
    console.log("[migrated dry-run]", basePath, legacyKey, "->", memberId);
    return;
  }

  await newRef.set(record);
  await oldRef.remove();
  console.log("[migrated]", basePath, legacyKey, "->", memberId);
}

async function migrateSimpleCollection(path, dryRun) {
  const db = admin.database();
  const snap = await db.ref(path).once("value");
  if (!snap.exists()) return;
  const data = snap.val();
  if (!data || typeof data !== "object") return;

  for (const legacyKey of Object.keys(data)) {
    await migrateIdentityKey(path, legacyKey, dryRun);
  }
}

async function migrateLeaderboards(dryRun) {
  const db = admin.database();
  const rootSnap = await db.ref("leaderboards").once("value");
  if (!rootSnap.exists()) return;
  const byType = rootSnap.val();
  if (!byType || typeof byType !== "object") return;

  for (const type of Object.keys(byType)) {
    const byGame = byType[type];
    if (!byGame || typeof byGame !== "object") continue;
    for (const gameKey of Object.keys(byGame)) {
      const scopedPath = `leaderboards/${type}/${gameKey}`;
      const gameRows = byGame[gameKey];
      if (!gameRows || typeof gameRows !== "object") continue;
      for (const legacyKey of Object.keys(gameRows)) {
        await migrateIdentityKey(scopedPath, legacyKey, dryRun);
      }
    }
  }
}

async function run() {
  const { dryRun } = parseFlags(process.argv.slice(2));
  initFirebaseAdmin();

  console.log("=== Legacy player key migration ===");
  console.log("Mode:", dryRun ? "DRY-RUN" : "EXECUTE");
  console.log("Database URL:", getDatabaseUrl());

  await migrateLeaderboards(dryRun);
  await migrateSimpleCollection("playerGameStats", dryRun);
  await migrateSimpleCollection("globalLeaderboard", dryRun);
  await migrateSimpleCollection("users", dryRun);

  console.log("=== Migration completed ===");
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
