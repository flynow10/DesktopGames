export type FieldSchema = {
  name: string;
} & (
  | {
      type: "number";
      minimum: number;
      maximum: number;
      default: number;
    }
  | {
      type: "string";
      default: string;
    }
  | {
      type: "boolean";
      default: boolean;
    }
  | {
      type: "choice";
      options: ChoiceOption[];
      default: string;
    }
  | {
      type: "multiple-choice";
      options: ChoiceOption[];
      default: string;
    }
);
export type ChoiceOption = {
  value: string;
  name: string;
};
export type CatagorySchema = {
  name: string;
  fields: { [key: string]: FieldSchema };
};
export type SettingsSchema = {
  [key: string]: CatagorySchema;
};
