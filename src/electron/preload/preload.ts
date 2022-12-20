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
