import { Canvas } from "./canvas";
import { Game } from "./game";
import { Vector } from "./games/manufactory/vector";
declare global {
  interface SpritePosition {
    sprite: Sprite;
    pos: Vector;
  }

  type Sprite = (canvas: Canvas, pos: Vector) => void;

  type Direction = "north" | "south" | "east" | "west";

  interface Window {
    mainMenu: () => void;
    startGame: (game: new (canvas: Canvas) => Game) => void;
  }
}
