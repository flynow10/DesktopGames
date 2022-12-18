import TabBarItem from "./TabBarItem";
import { Plus } from "lucide-react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useContext } from "react";
import { TabContext } from "@/core/tabs/TabProvider";

export default function TabBar() {
  const { tabs, activeTab, update } = useContext(TabContext);

  const tabElements = tabs.map((tab, index) => {
    try {
      return (
        <CSSTransition key={tab.id} timeout={150} classNames="tab-bar-item">
          <TabBarItem
            active={tab.id === activeTab}
            name={tab.name}
            onActivate={() => update({ type: "set-active", id: tab.id })}
            onClose={() => update({ type: "remove", id: tab.id })}
          />
        </CSSTransition>
      );
    } catch (e) {}
  });

  if (tabs.length > 1) {
    return (
      <header className="tab-container">
        <TransitionGroup component={null}>{tabElements}</TransitionGroup>
        <button
          onClick={() => update({ type: "new" })}
          className="tab-bar-new-tab"
        >
          <Plus className="new-tab-icon" />
        </button>
      </header>
    );
  } else {
    return null;
  }
}
