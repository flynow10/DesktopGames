import classNames from "classnames";
import { X } from "lucide-react";
import { forwardRef, useState } from "react";

export interface TabBarItemProps {
  active: boolean;
  name: string;
  onActivate: () => void;
  onClose: () => void;
}

export default function TabBarItem({
  active,
  name,
  ...props
}: TabBarItemProps) {
  const className = classNames("tab-bar-item", {
    "tab-active": active,
  });
  const [showButton, setShowButton] = useState(true);
  return (
    <div onClick={props.onActivate} className={className}>
      {name}
      {showButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowButton(false);
            props.onClose();
          }}
          className="tab-close-button"
        >
          <X size={10} />
        </button>
      )}
    </div>
  );
}
