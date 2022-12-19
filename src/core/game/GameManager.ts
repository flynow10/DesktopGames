import { Game } from "./Game";
import { gameIgniters } from "./GameList";

interface GameManager {
  games: { [key: string]: Game };
  createGame(gameId: string, tabId: string): void;
}

export const GM: GameManager = {
  games: {},
  createGame(gameId, tabId) {
    var gameIgniter = gameIgniters.find((igniter) => igniter.id === gameId);
    if (gameIgniter === undefined) {
      throw new Error("That game does not exist!");
    }
    var game = new gameIgniter.game();
    this.games[tabId] = game;
  },
};
