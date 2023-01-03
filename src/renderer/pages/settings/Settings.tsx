import { settingsSchema } from "@/core/settings/Settings";
import { TabType } from "@/core/tabs/Tab";
import { TabContext } from "@/core/tabs/TabProvider";
import { ArrowLeft } from "lucide-react";
import { useContext } from "react";
import Catagory from "./Catagory";

export default function Settings() {
  const catagories = Object.entries(settingsSchema);
  const catagoryJSX = catagories.map(([key, catagory]) => {
    return <Catagory catagory={catagory} catagoryKey={key} key={key} />;
  });

  const { update, activeTab } = useContext(TabContext);

  const switchToNewTab = () => {
    update({
      type: "update-type",
      id: activeTab,
      newType: TabType.New,
    });
  };

  return (
    <div className="centered-page">
      <div className="settings">
        <h1>
          <button onClick={switchToNewTab}>
            <ArrowLeft />
          </button>{" "}
          Settings
        </h1>
        <form>{catagoryJSX}</form>
      </div>
    </div>
  );
}
