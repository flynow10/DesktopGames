import { TabContext } from "@/core/tabs/TabProvider";
import { createContext, useContext } from "react";
import { TabType } from "@/core/tabs/Tab";
import NewTab from "./new-tab/NewTab";
import classNames from "classnames";
import GamePage from "./games/GamePage";
import Settings from "./settings/Settings";
import PassThroughProps from "../utils/PassThroughProps";

export const PageContext = createContext("");

export default function PageDisplay() {
  const { tabs, activeTab: activeTabId } = useContext(TabContext);
  const tabComponents = tabs.map((tab) => {
    var component;

    switch (tab.type) {
      case TabType.New: {
        component = <NewTab tabId={tab.id} />;
        break;
      }
      case TabType.Game: {
        component = <GamePage id={tab.id} />;
        break;
      }
      case TabType.Settings: {
        component = <Settings />;
        break;
      }
      default: {
        component = <h1>Failed to find tab type!</h1>;
      }
    }
    return (
      <PageContext.Provider value={tab.id} key={tab.id}>
        <Page isVisible={tab.id === activeTabId}>{component}</Page>
      </PageContext.Provider>
    );
  });
  return <div className="full overflow-y-hidden">{tabComponents}</div>;
}

function Page(props: { isVisible: boolean } & PassThroughProps) {
  const classes = classNames("page", "full", {
    "hidden-page": !props.isVisible,
    "visible-page": props.isVisible,
  });
  return (
    <div className={classes} hidden={!props.isVisible}>
      {props.children}
    </div>
  );
}
