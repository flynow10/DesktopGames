const { app, Menu } = require("electron");
const isMac = process.platform === "darwin";
export const template = Menu.buildFromTemplate([
  ...(isMac
    ? [
        {
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
    : []),
  {
    label: "Debug",
    submenu: [{ role: "toggleDevTools" }],
  },
]);
