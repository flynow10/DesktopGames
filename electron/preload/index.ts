import { nativeTheme } from "electron";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onCloseTab: (callback) => {
    ipcRenderer.on("close-tab", callback);
  },
  onNextTab: (callback) => {
    ipcRenderer.on("select-next-tab", callback);
  },
  onPreviousTab: (callback) => {
    ipcRenderer.on("select-previous-tab", callback);
  },
  onZenMode: (callback) => {
    ipcRenderer.on("toggle-zen-mode", callback);
  },
  onToggleGameSidebar: (callback) => {
    ipcRenderer.on("toggle-game-sidebar", callback);
  },
  onDarkModeChange: (callback: (event, isDarkMode) => void) => {
    ipcRenderer.on("dark-mode-updated", callback);
  },
  getIsDarkTheme: () => ipcRenderer.invoke("getIsDarkTheme"),
});
