import {
  createContext,
  // useContext,
  useEffect,
  useState,
} from "react";
// import { Sun, Moon } from "lucide-react";
import PassThroughProps from "./utils/PassThroughProps";
import { SettingsManager } from "@/core/settings/SettingsManager";

export const ThemeContext = createContext("dark");

// interface ThemeSwitchButtonProps {
//   onClick: () => void;
// }
// function ThemeSwitchButton(props: ThemeSwitchButtonProps) {
//   const isDark = useContext(ThemeContext) === "dark";
//   return (
//     <button onClick={props.onClick} className="theme-icon">
//       {isDark ? <Moon /> : <Sun />}
//     </button>
//   );
// }

export default function ThemeManager(props: PassThroughProps) {
  const [dark, setDark] = useState(false);

  const getDarkSetting = async () => {
    return await window.eTheme.getIsDark();
  };

  useEffect(() => {
    const onSettingsChange = async () => {
      setDark(await getDarkSetting());
    };
    SettingsManager.getInstance().addSettingsChangeListener(onSettingsChange);
    getDarkSetting().then((value) => {
      setDark(value);
    });
    return () => {
      SettingsManager.getInstance().removeSettingsChangeListener(
        onSettingsChange
      );
    };
  }, []);

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
      {/* <ThemeSwitchButton onClick={() => setDark(!dark)} /> */}
    </ThemeContext.Provider>
  );
}
