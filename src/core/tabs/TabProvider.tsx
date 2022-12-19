import { createContext, ReactNode, useReducer, useState } from "react";
import { getTabName, createTab, Tab, TabType } from "./Tab";

type TabAction =
  | {
      type: "new";
    }
  | {
      type: "remove";
      id: string;
    }
  | {
      type: "set-active";
      id: string;
    }
  | {
      type: "update-title";
      id: string;
    }
  | {
      type: "update-type";
      id: string;
      newType: TabType;
    };

type TabList = {
  tabs: Tab[];
  activeTab: string;
  update: (action: TabAction) => void;
};

const defaultTabList: TabList = {
  tabs: [createTab(TabType.New)],
  activeTab: "",
  update: () => {},
};

export const TabContext = createContext<TabList>(defaultTabList);

export interface TabProviderProps {
  children?: ReactNode;
}

export default function TabProvider(props: TabProviderProps) {
  const [tabs, setTabs] = useState([createTab(TabType.New)]);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  const newTab = () => {
    var newTab = createTab(TabType.New);
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const updateTabType = (id: string, type?: TabType) => {
    setTabs(
      tabs.map((tab) => {
        if (tab.id === id) {
          if (type === undefined) {
            type = tab.type;
          }
          return { id, type, name: getTabName(type) };
        }
        return { ...tab };
      })
    );
  };

  const removeTab = (id: string) => {
    if (tabs.length > 1) {
      var newTabs = [];
      var index = tabs.findIndex((value) => value.id === id);
      if (tabs[index].id === activeTab) {
        if (index === 0) {
          setActiveTab(tabs[index + 1].id);
        } else {
          setActiveTab(tabs[index - 1].id);
        }
      }
      newTabs.push(...tabs.slice(0, index), ...tabs.slice(index + 1));
      setTabs(newTabs);
    }
  };

  const update = (action: TabAction) => {
    switch (action.type) {
      case "new": {
        newTab();
        break;
      }
      case "remove": {
        removeTab(action.id);
        break;
      }
      case "set-active": {
        setActiveTab(action.id);
        break;
      }
      case "update-type": {
        updateTabType(action.id, action.newType);
        break;
      }
      case "update-title": {
        updateTabType(action.id);
        break;
      }
      default: {
        throw new Error("Unsupported action for updating tabs!");
      }
    }
  };

  return (
    <TabContext.Provider
      value={{
        activeTab,
        tabs,
        update,
      }}
    >
      {props.children}
    </TabContext.Provider>
  );
}
