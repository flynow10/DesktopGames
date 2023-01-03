import { IpcRendererEvent } from "electron";

declare global {
  interface Window {
    eShortcuts: {
      addShortcutListener: (
        shortcut: string,
        callback: (event: IpcRendererEvent) => void
      ) => void;
      removeShortcutListeners: (shortcut: string) => void;
    };
    eSettings: {
      save: (settingsObject: any) => Promise<boolean>;
      load: () => Promise<any>;
    };
    eTheme: {
      getIsDark: () => Promise<boolean>;
    };
  }
}
