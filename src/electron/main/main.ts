import { app, BrowserWindow, shell } from "electron";
import { join } from "path";

process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST_ELECTRON, "../public");

const preload = join(__dirname, "../preload/preload.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");
var win;
const createWindow = () => {
  win = new BrowserWindow({
    title: "Main window",
    maximizable: true,
    fullscreenable: true,
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.maximize();

  if (app.isPackaged) {
    // load your file
    win.loadFile(indexHtml);
  } else {
    win.loadURL(String(url));
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});
