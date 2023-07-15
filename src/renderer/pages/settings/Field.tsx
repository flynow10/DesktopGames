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

  const getInput = () => {
    switch (props.field.type) {
      case "boolean": {
        return (
          <div className="inline-block">
            <label htmlFor={props.fieldKey}>
              <h3 className="text-xl">{props.field.name}</h3>
            </label>
            <input
              className=""
              type="checkbox"
              checked={value === true}
              name={props.fieldKey}
              id={props.fieldKey}
              onChange={(event) => {
                setSetting(props.fieldKey, event.target.checked);
              }}
            />
          </div>
        );
      }
      case "choice": {
        return (
          <>
            <h3 className="text-xl">{props.field.name}</h3>
            <div className="ml-2 pl-2 border-l-2 border-solid border-light-text dark:border-dark-text">
              {props.field.options.map((option) => {
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
              })}
            </div>
          </>
        );
      }

      default: {
        return <span>Field type not set!</span>;
      }
    }
  };
  return <div className="my-4">{getInput()}</div>;
}
