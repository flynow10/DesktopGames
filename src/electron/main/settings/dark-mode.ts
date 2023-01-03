import { ipcMain, nativeTheme } from "electron";
import { load } from "./settings-io";

export async function setDarkMode(settings?: any) {
  if (!settings) {
    settings = await load();
  }
  if (!("appearence" in settings && "theme" in settings["appearence"])) {
    throw new Error("Settings appear to be malformed! Unable to load theme!");
  }
  nativeTheme.themeSource = settings["appearence"]["theme"];
}

export function registerDarkModeHandler() {
  ipcMain.handle("darkMode", () => {
    return nativeTheme.shouldUseDarkColors;
  });
}
