import { GameIgniter } from "@/core/game/GameList";
import { GM } from "@/core/game/GameManager";
import { TabType } from "@/core/tabs/Tab";
import { TabContext } from "@/core/tabs/TabProvider";
import { Play } from "lucide-react";
import { useContext } from "react";

export default function GameDisplay({
  games,
  tabId,
}: {
  games: GameIgniter[];
  tabId: string;
}) {
  const { update } = useContext(TabContext);
  const gameRows = games.reduce((arr, game, index) => {
    var row = Math.floor(index / 3);
    if (arr[row] === undefined) {
      arr[row] = [];
    }
    arr[row].push(game);
    return arr;
  }, [] as GameIgniter[][]);

  const newGame = (id: string) => {
    GM.createGame(id, tabId);
    update({
      type: "update-type",
      id: tabId,
      newType: TabType.Game,
    });
  };
  return (
    <div className="game-grid">
      {gameRows.map((row, index) => (
        <div key={index} className="game-grid-row">
          {row.map((game) => (
            <div key={game.id} className="game-card">
              <span className="game-title">{game.name}</span>
              <button onClick={() => newGame(game.id)} className="play-button">
                <Play />
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
