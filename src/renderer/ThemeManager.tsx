import { ReactNode, useState } from "react";
import { Sun, Moon } from "lucide-react";

export interface ThemeManagerProps {
  children: ReactNode
}

interface ThemeSwitchButtonProps {
  isDark: boolean,
  onClick: () => void
}
function ThemeSwitchButton(props: ThemeSwitchButtonProps) {
    return (
      <button onClick={props.onClick} className="theme-icon">
        {props.isDark ? (<Moon/>) : (<Sun/>)}
      </button>
    )
}

export default function ThemeManager(props: ThemeManagerProps) {
  const [dark, setDark] = useState(false);

  const themeClass = (dark ? "theme--dark" : "theme--light");

  return (
    <div className={"theme-manager " + themeClass}>
      {props.children}
      <ThemeSwitchButton isDark={dark} onClick={() => setDark(!dark)}/>
    </div>
  )
}