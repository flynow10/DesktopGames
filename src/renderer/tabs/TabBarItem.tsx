import { TabContext } from "@/core/tabs/TabProvider";
import classNames from "classnames";
import { X } from "lucide-react";
import { useContext, useState } from "react";

export interface TabBarItemProps {
  active: boolean;
  name: string;
  id: string;
  onActivate: () => void;
  onClose: () => void;
}

export default function TabBarItem({
  active,
  name,
  id,
  ...props
}: TabBarItemProps) {
  const className = classNames(
    "tab-bar-item",
    "select-none",
    "p-2",
    "flex-grow",
    "text-center",
    "text-ellipsis",
    "whitespace-nowrap",
    "overflow-hidden",
    "transition-none",
    {
      "bg-light-background-300": !active,
      "dark:bg-dark-background-300": !active,
      "bg-light-background-100": active,
      "dark:bg-dark-background-100": active,
    }
  );
  const { tabs } = useContext(TabContext);
  const exists = tabs.some((tab) => tab.id === id);
  return (
    <div onClick={props.onActivate} className={className}>
      {exists && name}
      {exists && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            props.onClose();
          }}
          className="float-right p-[revert] rounded-lg hover:bg-light-background-500 dark:hover:bg-dark-background-500"
        >
          <X size={10} className="align-baseline" />
        </button>
      )}
    </div>
  );
}
