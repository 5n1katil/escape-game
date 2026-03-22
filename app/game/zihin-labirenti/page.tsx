import { redirect } from "next/navigation";
import { ZIHIN_LABIRENTI_SLUG } from "./constants";

export default function ZihinLabirentiRootPage() {
  redirect(`/game/${ZIHIN_LABIRENTI_SLUG}/intro`);
}
