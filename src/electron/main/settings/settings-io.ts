import { app, ipcMain } from "electron";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { setDarkMode } from "./dark-mode";
const bufferXor = 0b11011011;
export function registerRendererHooks() {
  ipcMain.handle("saveSettings", async (event, data) => {
    return await save(data);
  });
  ipcMain.handle("loadSettings", async () => {
    return await load();
  });
}

export const configPath = path.join(app.getPath("userData"), "config");

const appVersion = app.getVersion();
export async function save(data: any): Promise<boolean> {
  setDarkMode(data);
  data = Object.assign({}, data, { version: appVersion });
  const base64JsonString = Buffer.from(JSON.stringify(data), "utf-8").toString(
    "base64"
  );
  const dataBuffer = Buffer.from(base64JsonString).map((b) => b ^ bufferXor);
  try {
    await writeFile(configPath, dataBuffer);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function load(): Promise<any> {
  if (!existsSync(configPath)) {
    return {};
  }
  try {
    const fileRaw = await readFile(configPath);
    const base64Data = fileRaw.map((b) => b ^ bufferXor).toString();
    const jsonString = Buffer.from(base64Data, "base64").toString("utf-8");
    const json = JSON.parse(jsonString);
    if (!("version" in json)) {
      throw new Error("Settings did not have a version number");
    }
    if (appVersion !== json.version) {
      console.warn("Settings version does not match app version!");
    }
    delete json.version;
    return json;
  } catch (e) {
    console.error(e);
    return null;
  }
}
