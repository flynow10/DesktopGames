import { FieldSchema } from "@/core/settings/Schema";
import { SettingsManager } from "@/core/settings/SettingsManager";
import { useEffect, useState } from "react";

export interface FieldProps {
  field: FieldSchema;
  fieldKey: string;
}
export default function Field(props: FieldProps) {
  const [value, setValue] = useState(null as any);

  const getSetting = async (fieldKey: string) => {
    const [catagory, field] = fieldKey.split(".");
    return (await SettingsManager.getInstance().getSettings())[catagory][field];
  };

  const setSetting = async (fieldKey: string, value: any) => {
    const [catagory, field] = fieldKey.split(".");
    const newSettings: any = {};
    newSettings[catagory] = {};
    newSettings[catagory][field] = value;
    SettingsManager.getInstance().updateSettings(newSettings);
  };

  useEffect(() => {
    const settingsManager = SettingsManager.getInstance();
    const onUpdateSettings = async () => {
      setValue(await getSetting(props.fieldKey));
    };
    settingsManager.addSettingsChangeListener(onUpdateSettings);

    getSetting(props.fieldKey).then((value) => {
      setValue(value);
    });

    return () => {
      settingsManager.removeSettingsChangeListener(onUpdateSettings);
    };
  }, [props.fieldKey]);

  switch (props.field.type) {
    case "choice": {
      let options = props.field.options.map((option) => {
        return (
          <div key={option.value}>
            <label htmlFor={option.value}>{option.name}</label>
            <input
              type="radio"
              checked={value === option.value}
              onChange={() => {
                setSetting(props.fieldKey, option.value);
              }}
              id={option.value}
              value={option.value}
              name={props.fieldKey}
            />
          </div>
        );
      });
      return (
        <div>
          <h3>{props.field.name}</h3>
          {options}
        </div>
      );
    }
    default: {
      return <span>Field type not set!</span>;
    }
  }
}
