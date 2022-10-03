const { app, BrowserWindow } = require("electron");

if (require("electron-squirrel-startup")) return;

const path = require("path");
const url = require("url");
const iconPath = path.join(__dirname, "img/icon.png");

const createWindow = () => {
  const win = new BrowserWindow({
    show: false,
    icon: iconPath,
  });
  win.maximize(true);
  win.setFullScreenable(true);
  win.setMenu(null);
  win.loadFile(path.join(__dirname, "index.html"));
  win.show();
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
