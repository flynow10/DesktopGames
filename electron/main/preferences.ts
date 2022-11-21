import ElectronPreferences from "electron-preferences";
import { join, resolve } from "path";
import { app } from "electron";

export const preferences = new ElectronPreferences({
  dataStore: join(app.getPath("userData"), "preferences.json"),

  debug: true,
  defaults: {
    appearence: {
      theme: "system",
    },
  },

  sections: [
    {
      id: "appearence",
      label: "Appearence",
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
    {
      id: "twentyFourtyEight",
      label: "2048",
    },
  ],
});
