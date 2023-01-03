import { GameIgniter, getGames } from "@/core/game/GameList";
import { TabType } from "@/core/tabs/Tab";
import { TabContext } from "@/core/tabs/TabProvider";
import t from "@/i18n";
import Search from "@/renderer/components/Search";
import { Settings } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import GameDisplay from "./GameDisplay";

export default function NewTab({ tabId }: { tabId: string }) {
  const [games, setGames] = useState<GameIgniter[]>([]);
  const [search, setSearch] = useState("");
  const { update, activeTab } = useContext(TabContext);

  const switchToSettings = () => {
    update({
      type: "update-type",
      id: activeTab,
      newType: TabType.Settings,
    });
  };

  useEffect(() => {
    setGames(getGames(search).sort());
  }, [search]);

  return (
    <>
      <div className="centered-page">
        <div className="new-tab">
          <h1>{t("title")}</h1>
          <Search onSearch={setSearch} />
          <GameDisplay games={games} tabId={tabId} />
        </div>
      </div>
      <button className="settings-button" onClick={switchToSettings}>
        <Settings size={30} />
      </button>
    </>
  );
}
