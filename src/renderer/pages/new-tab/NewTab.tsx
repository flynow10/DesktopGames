import { GameIgniter, getGames } from "@/core/game/GameList";
import { TabType } from "@/core/tabs/Tab";
import { TabContext } from "@/core/tabs/TabProvider";
import t from "@/i18n";
import Search from "@/renderer/components/Search";
import { Settings } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import GameDisplay from "../../components/GameDisplay";

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
      <div className="flex-center">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold my-8">{t("title")}</h1>
          <Search onSearch={setSearch} />
          <GameDisplay games={games} tabId={tabId} />
        </div>
      </div>
      <button
        className="absolute bottom-0 right-0 m-4 bg-none border-none rounded-full hover:bg-black hover:bg-opacity-20 p-2"
        onClick={switchToSettings}
      >
        <Settings size={30} />
      </button>
    </>
  );
}
