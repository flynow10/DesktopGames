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
    <div>
      <h2>{props.catagory.name}</h2>
      <div className="catagory-fields">{fieldsJSX}</div>
    </div>
  );
}
