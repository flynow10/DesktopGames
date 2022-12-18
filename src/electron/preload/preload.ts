import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("version", {
  get: () => {
    return "1.0.0";
  },
});
