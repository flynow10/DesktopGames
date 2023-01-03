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
    console.log(newSettings);
    var mergedSettings = Object.assign(
      {},
      this._getDefaultSettings(),
      await this.getSettings(),
      newSettings
    );
    if (!this._validateSettings(mergedSettings)) {
      throw new Error("Could not update settings as they are invalid!");
    }
    if (!(await window.eSettings.save(mergedSettings))) {
      throw new Error("Cound not save settings to file!");
    }
    const settings = await this._loadSettings();
    console.log(this._listeners);
    console.log(settings);
    for (const listener of this._listeners) {
      listener(settings);
    }
  }

  private async _loadSettings(): Promise<any> {
    const loadedSettings = await window.eSettings.load();
    if (!loadedSettings) {
      throw new Error("Settings could not be loaded!");
    }
    if (Object.keys(loadedSettings).length === 0) {
      this._settings = this._getDefaultSettings();
      return;
    }
    if (!this._validateSettings(loadedSettings)) {
      throw new Error("Loaded settings are not valid!");
    }
    this._settings = loadedSettings;
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
}
