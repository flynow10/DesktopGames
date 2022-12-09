import { ReactNode, useState } from "react";

export interface ThemeManagerProps {
  children: ReactNode
}

export default function ThemeManager(props: ThemeManagerProps) {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "theme--dark" : "theme--light"}>
      {props.children}
    </div>
  )
}