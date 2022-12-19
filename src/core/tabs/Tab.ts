import t from "@/i18n/";
import { v4 as uuid } from "uuid";
export type Tab = {
  id: string;
  type: TabType;
  name: string;
};

export function getTabName(type: TabType): string {
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
      return "Undefined!";
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

export enum TabType {
  New,
  Game,
  Settings,
  Statistics,
}
