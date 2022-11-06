// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST_ELECTRON, "../public");

import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Menu,
  session,
  nativeTheme,
} from "electron";
import { release, homedir } from "os";
import { join } from "path";
import { createTemplate } from "./menu";
import { preferences } from "./preferences";

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

const vueDevtoolsExtensionPath = join(
  homedir(),
  "/Library/Application Support/Google/Chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/6.4.5_0"
);

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

async function createWindow() {
  win = new BrowserWindow({
    title: "Desktop Games",
    icon: join(String(process.env.PUBLIC), "icon.png"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.maximize();
  win.setFullScreenable(true);
  if (app.isPackaged) {
    win.loadFile(indexHtml);
  } else {
    win.loadURL(String(url));
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools();
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}

const ready = async () => {
  if (!app.isPackaged) {
    await session.defaultSession.loadExtension(vueDevtoolsExtensionPath);
  }
  createWindow();
  Menu.setApplicationMenu(createTemplate(win));
  nativeTheme.themeSource = preferences.value("appearence.theme");
  preferences.on("save", () => {
    nativeTheme.themeSource = preferences.value("appearence.theme");
  });
  ipcMain.handle("getIsDarkTheme", () => nativeTheme.shouldUseDarkColors);
  nativeTheme.addListener("updated", () => {
    win.webContents.send("darkModeUpdated", nativeTheme.shouldUseDarkColors);
  });
};

app.whenReady().then(ready);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
