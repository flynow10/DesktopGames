import { Template } from "./template";

export const debugTemplate: Template = {
  label: "Debug",
  submenu: [
    { role: "reload" },
    { role: "forceReload" },
    { type: "separator" },
    { role: "toggleDevTools" },
  ],
};
