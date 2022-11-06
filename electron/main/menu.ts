import { preferences } from "./preferences";

const { app, Menu } = require("electron");
const isMac = process.platform === "darwin";
const preferencesMenu = {
  label: "Preferences",
  submenu: [
    {
      label: "Settings",
      accelerator: "CmdOrCtrl+,",
      click: () => {
        preferences.show();
      },
    },
  ],
};
const macApplicationMenu: Electron.MenuItemConstructorOptions[] = isMac
  ? [
      {
        label: app.name,
        submenu: [
          { role: "about" },
          { type: "separator" },
          { type: "separator" },
          preferencesMenu,
          { role: "hide" },
          { role: "hideOthers" },
          { role: "unhide" },
          { type: "separator" },
          { role: "quit" },
        ],
      },
    ]
  : [];
const macExtraEditOptions: Electron.MenuItemConstructorOptions[] = isMac
  ? [
      { role: "pasteAndMatchStyle" },
      { role: "delete" },
      { role: "selectAll" },
      { type: "separator" },
      {
        label: "Speech",
        submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
      },
    ]
  : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }];
const debug: Electron.MenuItemConstructorOptions[] = !app.isPackaged
  ? [
      {
        label: "Debug",
        submenu: [
          { role: "reload" },
          { role: "forceReload" },
          { type: "separator" },
          { role: "toggleDevTools" },
        ],
      },
    ]
  : [];
export function createTemplate(mainWindow) {
  return Menu.buildFromTemplate([
    ...macApplicationMenu,
    {
      label: "File",
      submenu: [
        {
          label: "Close Tab",
          accelerator: "CmdOrCtrl+W",
          click: () => {
            if (preferences.prefsWindow) {
              preferences.close();
            } else {
              mainWindow.webContents.send("close-tab");
            }
          },
        },
        ...(!isMac ? [preferencesMenu] : []),
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...macExtraEditOptions,
      ],
    },
    ...debug,
  ]);
}
