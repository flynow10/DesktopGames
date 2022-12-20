const englishDictionary: { [key: string]: string } = {
  "new-tab": "New Tab",
  "settings-tab": "Settings",
  "statistics-tab": "Statistics",
  "unnamed-game-tab": "Unnamed Game",
  "game-disconnected-tab": "Game Disconnected!",
};
export default function t(key: string): string {
  return englishDictionary[key];
}
