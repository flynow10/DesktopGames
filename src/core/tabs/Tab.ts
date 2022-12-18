import t from "@/i18n/";
import { v4 as uuid } from "uuid";
export type Tab = {
  id: string;
  type: TabType;
  name: string;
};

export function createTab(type: TabType): Tab {
  var name = "";
  switch (type) {
    case TabType.New: {
      name = t("new-tab");
      break;
    }
    case TabType.Settings: {
      name = t("settings-tab");
      break;
    }
    case TabType.Statistics: {
      name = t("statistics-tab");
      break;
    }
    case TabType.Game: {
      name = "Undefined!";
      break;
    }
  }
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
