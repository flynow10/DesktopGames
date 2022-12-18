const englishDictionary: { [key: string]: string } = {
  "new-tab": "New Tab",
  "settings-tab": "Settings",
  "statistics-tab": "Statistics",
};
export default function t(key: string): string {
  return englishDictionary[key];
}
