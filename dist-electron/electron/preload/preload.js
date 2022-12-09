var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("version", {
  get: () => {
    return "1.0.0";
  }
});
