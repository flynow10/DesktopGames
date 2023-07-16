import { Canvas } from "@/core/canvas/Canvas";
import { Scene } from "@/core/canvas/Scene";
import { Color } from "@/core/utils/Color";
import { Vector } from "@/core/utils/Vector";
import { Maze } from "@/games/maze/Maze";

export class MazeScene implements Scene {
  public constructor(public game: Maze, public boardSize: number) {}

  public get squareSize() {
    return this.game.canvas.shortSide / this.boardSize;
  }
  public draw(canvas: Canvas, dt: number): void {
    var widthIsShort = canvas.width <= canvas.height;
    var halfShift = canvas.shortSide / 2;
    if (widthIsShort) {
      canvas.translate(0, canvas.height / 2 - halfShift);
    } else {
      canvas.translate(canvas.width / 2 - halfShift, 0);
    }
    const squareSize = this.squareSize;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        const isWall = this.game.maze[j][i];
        let color = isWall
          ? new Color("#ddd", "#222")
          : new Color("#aaa", "#333");
        const vectorSquare = new Vector(i, j);
        if (Maze.END.equals(vectorSquare)) {
          color = new Color("#c22");
        } else if (Maze.START.equals(vectorSquare)) {
          color = new Color("#2c2");
        }
        canvas.fillRect(
          i * squareSize,
          j * squareSize,
          squareSize,
          squareSize,
          color
        );
      }
    }
    canvas.beginPath();
    canvas.circle(
      (this.game.player.x + 0.5) * squareSize,
      (this.game.player.y + 0.5) * squareSize,
      (squareSize / 2) * 0.8
    );
    canvas.fill(new Color("#48c"));
  }
}
