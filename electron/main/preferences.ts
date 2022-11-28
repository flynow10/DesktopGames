import ElectronPreferences from "electron-preferences";
import { join } from "path";
import { app, BrowserWindow, ipcMain, nativeTheme } from "electron";

export const preferences = new ElectronPreferences({
  dataStore: join(app.getPath("userData"), "preferences.json"),

  defaults: {
    appearence: {
      theme: "system",
    },
  },

  sections: [
    {
      id: "appearence",
      label: "Appearence",
      form: {
        groups: [
          {
            label: "Appearence",
            fields: [
              {
                label: "Theme",
                key: "theme",
                type: "radio",
                options: [
                  { label: "System Default", value: "system" },
                  { label: "Dark", value: "dark" },
                  { label: "Light", value: "light" },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
});

export function setupPreferences(win: BrowserWindow) {
  nativeTheme.themeSource = preferences.value("appearence.theme");
  preferences.on("save", () => {
    nativeTheme.themeSource = preferences.value("appearence.theme");
  });
  ipcMain.handle("getIsDarkTheme", () => nativeTheme.shouldUseDarkColors);
  nativeTheme.addListener("updated", () => {
    win!.webContents.send("dark-mode-updated", nativeTheme.shouldUseDarkColors);
  });
}
