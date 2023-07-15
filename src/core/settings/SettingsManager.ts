import { settingsSchema } from "./Settings";

type SettingsChangeListener = (settings: any) => void;

export class SettingsManager {
  private _settings: any = null;
  private _listeners: SettingsChangeListener[] = [];

  private static instance: SettingsManager;

  private constructor() {}

  public addSettingsChangeListener(listener: SettingsChangeListener) {
    this._listeners.push(listener);
  }

  public removeSettingsChangeListener(listener: SettingsChangeListener) {
    var index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    } else {
      console.error(
        new Error("Settings change listener does not exist to remove!")
      );
    }
  }

  public async getSettings() {
    if (this._settings === null) {
      await this._loadSettings();
      if (this._settings === null) {
        console.error(Error("Settings are not loaded!"));
        return this._getDefaultSettings();
      }
    }
    return this._settings;
  }

  public async updateSettings(newSettings: any) {
    var mergedSettings = SettingsManager.mergeDeep(
      {},
      this._getDefaultSettings(),
      await this.getSettings(),
      newSettings
    );
    if (!this._validateSettings(mergedSettings)) {
      throw new Error("Could not update settings as they are invalid!");
    }
    if (!import.meta.env.VITE_ONE_FILE) {
      if (!(await window.eSettings.save(mergedSettings))) {
        throw new Error("Cound not save settings to file!");
      }
    }
    const settings = await this._loadSettings();
    for (const listener of this._listeners) {
      listener(settings);
    }
  }

  private async _loadSettings(): Promise<any> {
    if (!import.meta.env.VITE_ONE_FILE) {
      const loadedSettings = await window.eSettings.load();
      if (!loadedSettings) {
        throw new Error("Settings could not be loaded!");
      }
      const defaultMerged = SettingsManager.mergeDeep(
        {},
        this._getDefaultSettings(),
        loadedSettings
      );
      if (!this._validateSettings(defaultMerged)) {
        throw new Error("Loaded settings are not valid!");
      }
      this._settings = defaultMerged;
    } else {
      this._settings = this._getDefaultSettings();
    }
    return this._settings;
  }

  private _validateSettings(settings: any): boolean {
    if (
      [null, undefined].includes(settings) ||
      typeof settings !== "object" ||
      Object.keys(settings).length === 0
    ) {
      return false;
    }
    for (const catagoryName in settings) {
      if (Object.prototype.hasOwnProperty.call(settings, catagoryName)) {
        if (!(catagoryName in settingsSchema)) {
          return false;
        }
        const catagory = settings[catagoryName];
        for (const fieldName in catagory) {
          if (Object.prototype.hasOwnProperty.call(catagory, fieldName)) {
            if (!(fieldName in settingsSchema[catagoryName].fields)) {
              return false;
            }
          }
        }
      }
    }

    for (const catagoryName in settingsSchema) {
      if (Object.prototype.hasOwnProperty.call(settingsSchema, catagoryName)) {
        if (!(catagoryName in settings)) {
          return false;
        }
        const catagory = settingsSchema[catagoryName];
        for (const fieldName in catagory.fields) {
          if (
            Object.prototype.hasOwnProperty.call(catagory.fields, fieldName)
          ) {
            if (!(fieldName in settings[catagoryName])) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  private _getDefaultSettings() {
    var defaults: any = {};
    for (const catagoryName in settingsSchema) {
      if (Object.prototype.hasOwnProperty.call(settingsSchema, catagoryName)) {
        const catagory = settingsSchema[catagoryName];
        defaults[catagoryName] = {};
        for (const fieldName in catagory.fields) {
          if (
            Object.prototype.hasOwnProperty.call(catagory.fields, fieldName)
          ) {
            const field = catagory.fields[fieldName];
            defaults[catagoryName][fieldName] = field.default;
          }
        }
      }
    }
    return defaults;
  }

  public static getInstance(): SettingsManager {
    return this.instance || (this.instance = new this());
  }

  private static isObject(item: any) {
    return item && typeof item === "object" && !Array.isArray(item);
  }
  private static mergeDeep(target: any, ...sources: any): any {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.mergeDeep(target, ...sources);
  }
}
