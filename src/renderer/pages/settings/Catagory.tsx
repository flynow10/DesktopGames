import { CatagorySchema } from "@/core/settings/Schema";
import Field from "./Field";

export interface CatagoryProps {
  catagory: CatagorySchema;
  catagoryKey: string;
  // TODO: catagory props onChange
  // onChange: (path: string, value) => void
}
export default function Catagory(props: CatagoryProps) {
  const fields = Object.entries(props.catagory.fields);
  const fieldsJSX = fields.map(([key, field]) => {
    return (
      <Field field={field} fieldKey={props.catagoryKey + "." + key} key={key} />
    );
  });
  return (
    <div className="catagory">
      <h2 className="text-2xl">{props.catagory.name}</h2>
      <div className="ml-4 pl-4 border-l-2 border-solid border-light-text dark:border-dark-text">
        {fieldsJSX}
      </div>
    </div>
  );
}
