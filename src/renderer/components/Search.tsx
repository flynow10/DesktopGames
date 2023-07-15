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
      className="w-full p-3 rounded-xl my-6 outline-none border-gray-400 border-2 focus:border-light-accent-100 focus:dark:border-dark-accent-100 focus:shadow-[0_0_0_0.25rem] focus:shadow-light-accent-100/50 focus:dark:shadow-dark-accent-100/50 transition-shadow"
      placeholder={t("search-placeholder")}
      onChange={() => props.onSearch((inputRef.current ?? { value: "" }).value)}
    />
  );
}
