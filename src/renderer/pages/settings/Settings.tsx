import { settingsSchema } from "@/core/settings/Settings";
import { TabType } from "@/core/tabs/Tab";
import { TabContext } from "@/core/tabs/TabProvider";
import { ArrowLeft } from "lucide-react";
import { useContext, useState } from "react";
import Catagory from "./Catagory";

export default function Settings() {
  const catagories = Object.entries(settingsSchema);
  const [selectedIndex, setSelectedIndex] = useState(0);
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
    <div className="mx-8 flex flex-col">
      <h1 className="py-4 text-4xl my-2 border-b-2 border-light-text">
        <button onClick={switchToNewTab}>
          <ArrowLeft size={30} className="align-baseline" />
        </button>{" "}
        Settings
      </h1>
      <div className="catagory-selector"></div>
      <form>{catagoryJSX[selectedIndex]}</form>
    </div>
  );
}
