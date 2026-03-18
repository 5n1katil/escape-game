"use client";

import { getPlayerSession, setStoredCurrentRoom } from "@/lib/gameStorage";
import { useEffect } from "react";

interface SessionSyncProps {
  slug: string;
  roomId: number;
}

/** Syncs session.currentRoomId when user navigates to a room. */
export default function SessionSync({ slug, roomId }: SessionSyncProps) {
  useEffect(() => {
    const session = getPlayerSession(slug);
    if (session && session.currentRoomId !== roomId) {
      setStoredCurrentRoom(slug, roomId);
    }
  }, [slug, roomId]);

  return null;
}
