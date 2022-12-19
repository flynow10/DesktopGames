import { TabContext } from "@/core/tabs/TabProvider";
import { ReactNode, useContext } from "react";
import { TabType } from "@/core/tabs/Tab";
import NewTab from "./new-tab/NewTab";
import classNames from "classnames";
import GamePage from "./games/GamePage";

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
      default: {
        component = <h1>Failed to find tab type!</h1>;
      }
    }
    return (
      <Page isVisible={tab.id === activeTabId} key={tab.id}>
        {component}
      </Page>
    );
  });
  return <div className="pages">{tabComponents}</div>;
}

function Page(props: { isVisible: boolean; children: ReactNode }) {
  const classes = classNames("page", {
    "hidden-page": !props.isVisible,
    "visible-page": props.isVisible,
  });
  return <div className={classes}>{props.children}</div>;
}
