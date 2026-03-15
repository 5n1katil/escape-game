import { rooms } from "@/data/rooms";

export { rooms };

export function isCorrectAnswer(
  room: { answer?: string },
  input: string
): boolean {
  if (!room.answer) return false;
  const normalized = normalizeAnswer(input.trim().toLowerCase());
  const expected = normalizeAnswer(room.answer.toLowerCase());
  return normalized === expected;
}

export function isCorrectMultipleChoice(
  room: { answer?: string; options?: string[] },
  selectedIndex: number
): boolean {
  if (!room.options || !room.answer) return false;
  const selected = room.options[selectedIndex];
  if (!selected) return false;
  return isCorrectAnswer(room, selected);
}

/** Normalize Turkish letters to ASCII. */
export function normalizeAnswer(s: string): string {
  const map: Record<string, string> = {
    "\u00FC": "u", "\u015F": "s", "\u011F": "g", "\u0131": "i",
    "\u00F6": "o", "\u00E7": "c", "\u0130": "i",
    "\u00DC": "u", "\u015E": "s", "\u011E": "g", "\u00D6": "o", "\u00C7": "c",
  };
  return s.split("").map((c) => map[c] ?? c).join("");
}

export function isCorrectFinalCode(expected: string, input: string): boolean {
  const a = normalizeAnswer(input.trim().toLowerCase());
  const b = normalizeAnswer(expected.toLowerCase());
  return a === b;
}

export function isCorrectImageChoice(
  room: { answer?: string; media?: { url: string; alt?: string }[] },
  selectedIndex: number
): boolean {
  if (!room.media || !room.answer) return false;
  const answerNorm = room.answer.toLowerCase().trim();
  const idxStr = String(selectedIndex);
  if (answerNorm === idxStr) return true;
  const item = room.media[selectedIndex];
  if (item?.alt && normalizeAnswer(item.alt.toLowerCase()) === normalizeAnswer(answerNorm))
    return true;
  return false;
}
