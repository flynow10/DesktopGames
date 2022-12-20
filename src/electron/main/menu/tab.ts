import { Template } from "./template";

export const tabTemplate: Template = {
  label: "Tab",
  submenu: [
    {
      label: "New Tab",
      accelerator: "CmdOrCtrl+T",
      click: (menuItem, window) => {
        window?.webContents.send("shortcut", "new-tab");
      },
    },
    {
      label: "Select Next Tab",
      accelerator: "Control+Tab",
      click: (menuItem, window) => {
        window?.webContents.send("shortcut", "next-tab");
      },
    },
    {
      label: "Select Previous Tab",
      accelerator: "Control+Shift+Tab",
      click: (menuItem, window) => {
        window?.webContents.send("shortcut", "previous-tab");
      },
    },
    {
      label: "Close Tab",
      accelerator: "CmdOrCtrl+W",
      click: (menuItem, window) => {
        window?.webContents.send("shortcut", "close-tab");
      },
    },
  ],
};
