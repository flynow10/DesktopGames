import { BrowserWindow } from "electron";
import { preferences } from "./preferences";

const { app, Menu } = require("electron");
const isMac = process.platform === "darwin";
const macApplicationMenu: Electron.MenuItemConstructorOptions[] = isMac
  ? [
      {
        // To change this menu's name edit the `productName` in the package.json file
        label: app.name,
        submenu: [
          { role: "about" },
          { type: "separator" },
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
export function createTemplate(mainWindow: BrowserWindow) {
  return Menu.buildFromTemplate([
    ...macApplicationMenu,
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo", accelerator: "CmdOrCtrl+Y" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...macExtraEditOptions,
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Toggle Zen Mode",
          accelerator: "CmdOrCtrl+Shift+Z",
          click() {
            mainWindow.webContents.send("toggle-zen-mode");
          },
        },
        {
          label: "Toggle Game Sidebar",
          accelerator: "CmdOrCtrl+Shift+B",
          click() {
            mainWindow.webContents.send("toggle-game-sidebar");
          },
        },
      ],
    },
    {
      label: "Tab",
      submenu: [
        {
          label: "Select Next Tab",
          accelerator: "Ctrl+Tab",
          click() {
            mainWindow.webContents.send("select-next-tab");
          },
        },
        {
          label: "Select Previous Tab",
          accelerator: "Ctrl+Shift+Tab",
          click() {
            mainWindow.webContents.send("select-previous-tab");
          },
        },
        {
          label: "Close Tab",
          accelerator: "CmdOrCtrl+W",
          click: () => {
            mainWindow.webContents.send("close-tab");
          },
        },
      ],
    },
    ...debug,
  ]);
}
