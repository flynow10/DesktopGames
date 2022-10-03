import { Game2048 } from "./games/2048.js";
import { Battleship } from "./games/battleship/battleship.js";
import { Connect4 } from "./games/connect4.js";
import { Manufactory } from "./games/manufactory/manufactory.js";
import { Minesweeper } from "./games/minesweeper.js";
import { NoHumanity } from "./games/no_humanity.js";
import { Snake } from "./games/snake.js";
import { TicTacToe } from "./games/tictactoe/tictactoe.js";

class MenuGame {
  constructor(game, name, type) {
    this.game = game;
    this.name = name;
    this.type = type;
  }
}
export const GameTypes = {
  OnePlayer: 0,
  TwoPlayer: 1,
};

export const snake = new MenuGame(Snake, "Snake", GameTypes.OnePlayer);
export const minesweeper = new MenuGame(
  Minesweeper,
  "Minesweeper",
  GameTypes.OnePlayer
);
export const noHumanity = new MenuGame(
  NoHumanity,
  "No Humanity",
  GameTypes.OnePlayer
);
export const game2048 = new MenuGame(Game2048, "2048", GameTypes.OnePlayer);
export const connect4 = new MenuGame(
  Connect4,
  "Connect 4",
  GameTypes.TwoPlayer
);
export const ticTacToe = new MenuGame(
  TicTacToe,
  "Tic Tac Toe",
  GameTypes.TwoPlayer
);
export const battleship = new MenuGame(
  Battleship,
  "Battleship",
  GameTypes.TwoPlayer
);
export const manufactory = new MenuGame(
  Manufactory,
  "Manufactory",
  GameTypes.OnePlayer
);
export const Games = [
  snake,
  minesweeper,
  noHumanity,
  game2048,
  connect4,
  ticTacToe,
  // manufactory,
  // battleship,
];
