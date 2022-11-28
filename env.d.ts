/// <reference types="vite/client" />

import { EventManager } from "src/core/EventManager";

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  interface Window {
    EventManager: EventManager;
    electronAPI: {
      onCloseTab: (callback: () => void) => void;
      onNextTab: (callback: () => void) => void;
      onPreviousTab: (callback: () => void) => void;
      onZenMode: (callback: (event: any) => void) => void;
      onToggleGameSidebar: (callback: (event: any) => void) => void;
      onDarkModeChange: (
        callback: (event: Event, isDarkMode: boolean) => void
      ) => void;
      getIsDarkTheme: () => boolean;
    };
  }
  interface ImportMetaEnv {
    readonly VITE_ONE_FILE: boolean;
  }
}
