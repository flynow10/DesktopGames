import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeContext = createContext("dark");
export interface ThemeManagerProps {
  children: ReactNode;
}

interface ThemeSwitchButtonProps {
  onClick: () => void;
}
function ThemeSwitchButton(props: ThemeSwitchButtonProps) {
  const isDark = useContext(ThemeContext) === "dark";
  return (
    <button onClick={props.onClick} className="theme-icon">
      {isDark ? <Moon /> : <Sun />}
    </button>
  );
}

export default function ThemeManager(props: ThemeManagerProps) {
  const [dark, setDark] = useState(false);

  const themeClass = dark ? "theme--dark" : "theme--light";

  useEffect(() => {
    document.documentElement.classList.add(themeClass);
    return () => {
      document.documentElement.classList.remove(themeClass);
    };
  }, [themeClass]);

  return (
    <ThemeContext.Provider value={dark ? "dark" : "light"}>
      {props.children}
      <ThemeSwitchButton onClick={() => setDark(!dark)} />
    </ThemeContext.Provider>
  );
}
