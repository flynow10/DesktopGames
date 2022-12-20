import { GameIgniter, getGames } from "@/core/game/GameList";
import t from "@/i18n";
import Search from "@/renderer/components/Search";
import { useEffect, useState } from "react";
import GameDisplay from "./GameDisplay";

export default function NewTab({ tabId }: { tabId: string }) {
  const [games, setGames] = useState<GameIgniter[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setGames(getGames(search).sort());
  }, [search]);

  return (
    <div className="new-tab">
      <div className="centered-content">
        <h1>{t("title")}</h1>
        <Search onSearch={setSearch} />
        <GameDisplay games={games} tabId={tabId} />
      </div>
    </div>
  );
}
