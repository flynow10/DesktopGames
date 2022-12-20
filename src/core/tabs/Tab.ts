import t from "@/i18n/";
import { v4 as uuid } from "uuid";
import { GM } from "../game/GameManager";
export type Tab = {
  id: string;
  type: TabType;
  name: string;
};

export enum TabType {
  New,
  Game,
  Settings,
  Statistics,
}

export function getTabName(type: TabType, id?: string): string {
  switch (type) {
    case TabType.New: {
      return t("new-tab");
    }
    case TabType.Settings: {
      return t("settings-tab");
    }
    case TabType.Statistics: {
      return t("statistics-tab");
    }
    case TabType.Game: {
      if (!id) {
        return t("unnamed-game-tab");
      }
      var game = GM.games[id];
      if (game) {
        return game.name;
      }
      return t("game-disconnected-tab");
    }
  }
}

export function createTab(type: TabType): Tab {
  var name = getTabName(type);
  return {
    id: uuid(),
    type,
    name,
  };
}
