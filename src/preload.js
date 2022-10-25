// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.on("hi", (_event, value) => {
    document.body.innerHTML = "Good Morning";
  });
});
