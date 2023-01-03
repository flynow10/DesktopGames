import { app, Menu } from "electron";
import { debugTemplate } from "./debug";
import { editTemplate } from "./edit";
import { tabTemplate } from "./tab";
import { isMac, Template } from "./template";

const macTemplate: Template = {
  label: app.name,
  submenu: [
    { role: "about" },
    { type: "separator" },
    {
      label: "Preferences",
      accelerator: "CommandOrControl+,",
      click: (menuItem, window) => {
        window?.webContents.send("shortcut", "open-settings");
      },
    },
    { type: "separator" },
    { role: "hide" },
    { role: "hideOthers" },
    { role: "unhide" },
    { type: "separator" },
    { role: "quit" },
  ],
};
const menuTemplate = [editTemplate, tabTemplate];
if (isMac) {
  menuTemplate.unshift(macTemplate);
}
if (!app.isPackaged) {
  menuTemplate.push(debugTemplate);
}
export const menu = Menu.buildFromTemplate(menuTemplate);
