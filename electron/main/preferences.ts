import ElectronPreferences from "electron-preferences";
import { join } from "path";
import { app } from "electron";

export const preferences = new ElectronPreferences({
  dataStore: join(app.getPath("userData"), "preferences.json"),

  defaults: {
    appearence: {
      theme: "system",
    },
  },

  sections: [
    {
      id: "appearence",
      label: "Appearence",
      icon: "eye-19",
      form: {
        groups: [
          {
            label: "Theme",
            fields: [
              {
                label: "Theme",
                key: "theme",
                type: "radio",
                options: [
                  { label: "System Default", value: "system" },
                  { label: "Dark", value: "dark" },
                  { label: "Light", value: "light" },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
});
