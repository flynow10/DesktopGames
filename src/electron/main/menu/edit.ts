import { isMac, Template } from "./template";

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

export const editTemplate: Template = {
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
};
