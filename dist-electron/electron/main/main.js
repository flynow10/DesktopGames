var import_electron = require("electron");
var import_path = require("path");
process.env.DIST_ELECTRON = (0, import_path.join)(__dirname, "..");
process.env.DIST = (0, import_path.join)(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = import_electron.app.isPackaged ? process.env.DIST : (0, import_path.join)(process.env.DIST_ELECTRON, "../public");
const preload = (0, import_path.join)(__dirname, "../preload/preload.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = (0, import_path.join)(process.env.DIST, "index.html");
var win;
const createWindow = () => {
  win = new import_electron.BrowserWindow({
    title: "Main window",
    maximizable: true,
    fullscreenable: true,
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  win.maximize();
  if (import_electron.app.isPackaged) {
    win.loadFile(indexHtml);
  } else {
    win.loadURL(String(url));
  }
  win.webContents.setWindowOpenHandler(({ url: url2 }) => {
    if (url2.startsWith("https:"))
      import_electron.shell.openExternal(url2);
    return { action: "deny" };
  });
};
import_electron.app.whenReady().then(createWindow);
import_electron.app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin")
    import_electron.app.quit();
});
