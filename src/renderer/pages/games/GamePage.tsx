import { GM } from "@/core/game/GameManager";
import { TabContext } from "@/core/tabs/TabProvider";
import classNames from "classnames";
import { useContext, useEffect, useRef } from "react";

export default function GamePage({ id }: { id: string }) {
  const gameContainer = useRef<HTMLDivElement>(null);
  const { activeTab, update } = useContext(TabContext);
  useEffect(() => {
    var game = GM.games[id];
    if (game) {
      game.onNameChange.push(() => update({ id, type: "update-title" }));
      if (gameContainer.current) {
        gameContainer.current.innerHTML = "";
        game.attach(gameContainer.current);
      }
      game.start();
      return () => {
        game.internalCleanup();
      };
    }
  }, [id]);

  useEffect(() => {
    var game = GM.games[id];
    if (game) {
      game.selected(activeTab === id);
    }
  }, [activeTab, id]);
  const className = classNames("game-container", id);
  return <div ref={gameContainer} className={className}></div>;
}
