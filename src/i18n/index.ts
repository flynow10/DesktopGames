type Dictionary = { [key: string]: string };
const englishDictionary: Dictionary = {
  "2048-title": "2048",
  "connect4-title": "Connect 4",
  "game-disconnected-tab": "Game Disconnected!",
  "game-over": "Game over!",
  "new-tab": "New Tab",
  "search-placeholder": "Search",
  "settings-tab": "Settings",
  "snake-title": "Snake",
  "statistics-tab": "Statistics",
  title: "Desktop Games",
  "unnamed-game-tab": "Unnamed Game",
};

const spanishDictionary: Dictionary = {
  "2048-title": "2048",
  "connect4-title": "Conectar 4",
  "game-disconnected-tab": "¡Juego desconectado!",
  "game-over": "¡Juego terminado!",
  "new-tab": "Nueva pestaña",
  "search-placeholder": "Búsqueda",
  "settings-tab": "Ajustes",
  "snake-title": "Serpiente",
  "statistics-tab": "Estadísticas",
  title: "Juegos de escritorio",
  "unnamed-game-tab": "Juego sin nombre",
};

const japaneseDictionary: Dictionary = {
  "2048-title": "2048",
  "connect4-title": "接続 4",
  "game-disconnected-tab": "ゲームが切断されました！",
  "game-over": "ゲームオーバー！",
  "new-tab": "新しいタブ",
  "search-placeholder": "サーチ",
  "settings-tab": "構成",
  "snake-title": "蛇",
  "statistics-tab": "統計",
  title: "デスクトップゲーム",
  "unnamed-game-tab": "名前のないゲーム",
};
export default function t(key: string): string {
  var dictionary: Dictionary = englishDictionary;
  if (!(key in dictionary)) {
    return "Translation Missing";
  }
  return dictionary[key];
}
