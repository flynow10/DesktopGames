import { nativeTheme } from "electron";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onCloseTab: (callback) => {
    ipcRenderer.on("close-tab", callback);
  },
  openSettings: () => {
    ipcRenderer.send("showPreferences");
  },
  onPreferencesChange: (callback: (event, preferences) => void) => {
    ipcRenderer.on("preferencesUpdated", callback);
  },
  onDarkModeChange: (callback: (event, isDarkMode) => void) => {
    ipcRenderer.on("darkModeUpdated", callback);
  },
  getPreferences: () => {
    return ipcRenderer.sendSync("getPreferences");
  },
  getIsDarkTheme: () => ipcRenderer.invoke("getIsDarkTheme"),
});