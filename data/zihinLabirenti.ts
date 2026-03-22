/**
 * Zihin Labirenti: Son Veri — placeholder oda verileri (içerik sonra doldurulacak).
 */
import type { Room } from "./rooms";

function placeholderRoom(id: number): Room {
  return {
    id,
    title: "Test Odası",
    description: "Test Odası",
    type: "multipleChoice",
    question: "Test Odası",
    answer: "0",
    hint: "Test Odası",
    options: ["Test Odası"],
    story: "Test Odası",
    puzzlePrompt: "Test Odası",
  };
}

export const zihinLabirentiRooms: Room[] = [
  placeholderRoom(1),
  placeholderRoom(2),
  placeholderRoom(3),
  placeholderRoom(4),
  placeholderRoom(5),
  placeholderRoom(6),
];
