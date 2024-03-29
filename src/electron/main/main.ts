import { app, BrowserWindow, Menu, session, shell } from "electron";
import { homedir } from "os";
import { join } from "path";
import { menu } from "./menu/menu";
import { registerDarkModeHandler, setDarkMode } from "./settings/dark-mode";
import { registerRendererHooks } from "./settings/settings-io";

process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST_ELECTRON, "../public");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const preload = join(__dirname, "../preload/preload.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

const reactDevtoolsExtensionPath = join(
  homedir(),
  "/Code/Applications/DesktopGames/react-devtools/"
);

const createWindow = () => {
  const win = new BrowserWindow({
    title: "Desktop Games",
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

const ready = async () => {
  await session.defaultSession.loadExtension(reactDevtoolsExtensionPath);
  await setDarkMode();
  Menu.setApplicationMenu(menu);
  registerRendererHooks();
  registerDarkModeHandler();
  createWindow();
};

app.whenReady().then(ready);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
