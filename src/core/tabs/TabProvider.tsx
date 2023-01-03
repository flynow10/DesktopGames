import PassThroughProps from "@/renderer/utils/PassThroughProps";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { getTabName, createTab, Tab, TabType } from "./Tab";

type TabAction =
  | {
      type: "new";
      tabType?: TabType;
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
    }
  | {
      type: "next";
    }
  | {
      type: "previous";
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

export default function TabProvider(props: PassThroughProps) {
  const [tabs, setTabs] = useState([createTab(TabType.New)]);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  const update = useCallback(
    (action: TabAction) => {
      const newTab = (type = TabType.New) => {
        var newTab = createTab(type);
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
              return { id, type, name: getTabName(type, id) };
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
      const changeTabs = (indexAddition: number) => {
        var currentTab = tabs.findIndex((tab) => tab.id === activeTab);
        var nextTab = (currentTab + indexAddition) % tabs.length;
        if (nextTab < 0) {
          nextTab = tabs.length - 1;
        }
        if (nextTab < tabs.length) {
          setActiveTab(tabs[nextTab].id);
        }
      };

      switch (action.type) {
        case "new": {
          if (action.tabType) {
            newTab(action.tabType);
          } else {
            newTab();
          }
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
        case "next": {
          changeTabs(1);
          break;
        }
        case "previous": {
          changeTabs(-1);
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
    },
    [activeTab, tabs]
  );

  useEffect(() => {
    window.eShortcuts.addShortcutListener("new-tab", () => {
      update({ type: "new" });
    });
    window.eShortcuts.addShortcutListener("next-tab", () => {
      update({ type: "next" });
    });
    window.eShortcuts.addShortcutListener("previous-tab", () => {
      update({ type: "previous" });
    });
    window.eShortcuts.addShortcutListener("close-tab", () => {
      update({ type: "remove", id: activeTab });
    });
    window.eShortcuts.addShortcutListener("open-settings", () => {
      update({ type: "new", tabType: TabType.Settings });
    });
    return () => {
      window.eShortcuts.removeShortcutListeners("new-tab");
      window.eShortcuts.removeShortcutListeners("next-tab");
      window.eShortcuts.removeShortcutListeners("previous-tab");
      window.eShortcuts.removeShortcutListeners("close-tab");
      window.eShortcuts.removeShortcutListeners("open-settings");
    };
  }, [tabs, activeTab, update]);

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
