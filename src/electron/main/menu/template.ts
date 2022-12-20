import { MenuItem, MenuItemConstructorOptions } from "electron";

export type Template = MenuItemConstructorOptions | MenuItem;

export const isMac = process.platform === "darwin";
