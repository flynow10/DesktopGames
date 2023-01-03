import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

const listeners: {
  shortcut: string;
  removed: boolean;
  callback: (event: IpcRendererEvent, shortcutId: string) => void;
}[] = [];
contextBridge.exposeInMainWorld("eShortcuts", {
  addShortcutListener: (
    shortcut: string,
    callback: (event: IpcRendererEvent) => void
  ) => {
    var listener = (event: IpcRendererEvent, shortcutId: string) => {
      if (shortcut === shortcutId) {
        callback(event);
      }
    };
    listeners.push({
      shortcut,
      removed: false,
      callback: listener,
    });
    ipcRenderer.on("shortcut", listener);
  },
  removeShortcutListeners: (shortcut: string) => {
    listeners.forEach(({ shortcut: shortcutId, removed, callback }, index) => {
      if (shortcut === shortcutId && !removed) {
        listeners[index].removed = true;
        ipcRenderer.removeListener("shortcut", callback);
      }
    });
  },
});

contextBridge.exposeInMainWorld("eSettings", {
  save: async (settingsObject: any): Promise<boolean> => {
    return (await ipcRenderer.invoke(
      "saveSettings",
      settingsObject
    )) as boolean;
  },
  load: async (): Promise<any> => {
    return await ipcRenderer.invoke("loadSettings");
  },
});

contextBridge.exposeInMainWorld("eTheme", {
  getIsDark: async () => {
    return (await ipcRenderer.invoke("darkMode")) as boolean;
  },
});
