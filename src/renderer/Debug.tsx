import { TabType } from "@/core/tabs/Tab";
import { TabContext } from "@/core/tabs/TabProvider";
import { useContext } from "react";

export default function Debug() {
  var { update, activeTab } = useContext(TabContext);
  return (
    <div className="debug">
      <button
        className="debug-button"
        onClick={() =>
          update({
            type: "update-type",
            id: activeTab,
            newType: TabType.Settings,
          })
        }
      >
        Switch to Settings
      </button>
    </div>
  );
}
