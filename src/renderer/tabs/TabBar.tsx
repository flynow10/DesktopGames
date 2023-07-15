import TabBarItem from "./TabBarItem";
import { Plus } from "lucide-react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useContext } from "react";
import { TabContext } from "@/core/tabs/TabProvider";

export default function TabBar() {
  const { tabs, activeTab, update } = useContext(TabContext);

  const tabElements = tabs.map((tab, index) => {
    return (
      <CSSTransition key={tab.id} timeout={150} classNames="tab-bar-item">
        <TabBarItem
          active={tab.id === activeTab}
          name={tab.name}
          id={tab.id}
          onActivate={() => update({ type: "set-active", id: tab.id })}
          onClose={() => update({ type: "remove", id: tab.id })}
        />
      </CSSTransition>
    );
  });

  if (tabs.length > 1) {
    return (
      <header className="flex flex-row shrink-0 text-light-text dark:text-dark-text">
        <TransitionGroup component={null}>{tabElements}</TransitionGroup>
        <button
          onClick={() => update({ type: "new" })}
          className="group select-none text-center p-[revert] bg-light-background-900 dark:bg-dark-background-900"
        >
          <Plus className="lucide scale-100 transition-transform group-hover:scale-125" />
        </button>
      </header>
    );
  } else {
    return null;
  }
}
