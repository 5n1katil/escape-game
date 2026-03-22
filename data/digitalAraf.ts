/**
 * Dijital Araf — placeholder oda verileri (içerik sonra doldurulacak).
 */
import type { Room } from "./rooms";

function placeholderRoom(id: number): Room {
  return {
    id,
    title: "Test",
    description: "Test",
    type: "multipleChoice",
    question: "Test",
    answer: "0",
    hint: "Test",
    options: ["Test"],
    story: "Test",
    puzzlePrompt: "Test",
  };
}

export const digitalArafRooms: Room[] = [
  placeholderRoom(1),
  placeholderRoom(2),
  placeholderRoom(3),
  placeholderRoom(4),
  placeholderRoom(5),
  placeholderRoom(6),
];
