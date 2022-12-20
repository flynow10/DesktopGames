import t from "@/i18n";
import { useRef } from "react";

export interface SearchProps {
  onSearch: (search: string) => void;
}
export default function Search(props: SearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <input
      ref={inputRef}
      type="text"
      className="search"
      placeholder={t("search-placeholder")}
      onChange={() => props.onSearch((inputRef.current ?? { value: "" }).value)}
    />
  );
}
