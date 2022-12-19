import { GM } from "@/core/game/GameManager";
import { useEffect } from "react";

export default function GamePage({ id }: { id: string }) {
  useEffect(() => {
    var game = GM.games[id];
    game.start();
    return () => {
      game.internalCleanup();
    };
  }, [id]);
  return null;
}
