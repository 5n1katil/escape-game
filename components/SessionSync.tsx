"use client";

import { getSession, updateSession } from "@/lib/gameSession";
import { useEffect } from "react";

interface SessionSyncProps {
  slug: string;
  roomId: number;
}

/** Syncs session.currentRoomId when user navigates to a room. */
export default function SessionSync({ slug, roomId }: SessionSyncProps) {
  useEffect(() => {
    const session = getSession(slug);
    if (session && session.currentRoomId !== roomId) {
      updateSession(slug, { currentRoomId: roomId });
    }
  }, [slug, roomId]);

  return null;
}
