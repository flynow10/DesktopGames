import { SettingsSchema } from "./Schema";

export const settingsSchema: SettingsSchema = {
  appearence: {
    name: "Appearence",
    fields: {
      theme: {
        name: "Theme",
        type: "choice",
        options: [
          {
            name: "Light",
            value: "light",
          },
          {
            name: "Dark",
            value: "dark",
          },
          {
            name: "System Default",
            value: "system",
          },
        ],
        default: "system",
      },
    },
  },
};
