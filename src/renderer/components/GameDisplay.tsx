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
    <div className="flex flex-col">
      {gameRows.map((row, index) => (
        <div key={index} className="flex flex-row">
          {row.map((game) => (
            <div
              key={game.id}
              className="flex flex-col justify-between items-center m-3 rounded-xl overflow-hidden min-w-[200px] shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
            >
              <span className="text-lg font-bold m-3">{game.name}</span>
              <button
                onClick={() => newGame(game.id)}
                className="bg-green-500  p-4 w-full mt-3 text-white hover:bg-green-700"
              >
                <Play />
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
