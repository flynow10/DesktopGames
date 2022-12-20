type Dictionary = { [key: string]: string };
const englishDictionary: Dictionary = {
  "game-disconnected-tab": "Game Disconnected!",
  "new-tab": "New Tab",
  "settings-tab": "Settings",
  "statistics-tab": "Statistics",
  title: "Desktop Games",
  "unnamed-game-tab": "Unnamed Game",
  "search-placeholder": "Search",
};

const japaneseDictionary: Dictionary = {
  "game-disconnected-tab": "ゲームが切断されました！",
  "new-tab": "新しいタブ",
  "settings-tab": "構成",
  "statistics-tab": "統計",
  title: "デスクトップゲーム",
  "unnamed-game-tab": "名前のないゲーム",
  "search-placeholder": "サーチ",
};
export default function t(key: string): string {
  var dictionary: Dictionary = englishDictionary;
  return dictionary[key];
}
