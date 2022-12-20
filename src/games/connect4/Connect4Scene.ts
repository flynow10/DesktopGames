import { Canvas } from "@/core/canvas/Canvas";
import { CanvasImage } from "@/core/canvas/CanvasImage";
import { Scene } from "@/core/canvas/Scene";
import { Color } from "@/core/utils/Color";
import { Vector } from "@/core/utils/Vector";
import t from "@/i18n";
import { Connect4, Connect4State } from "./Connect4";

export class Connect4Scene implements Scene {
  public game: Connect4;

  public players: CanvasImage[] = [];

  public static AnimationSpeed: number = 500;

  public timeSinceMove = 0;

  constructor(game: Connect4) {
    this.game = game;
    var colors = ["#f55", "#51f"];
    for (let i = 0; i < colors.length; i++) {
      const hex = colors[i];
      this.players[i + 1] = new CanvasImage(300, 300, (image) => {
        var color = new Color(hex);
        image.setShadowBlur(30);
        image.setShadowColor(color);
        image.fillCircle(150, 150, 130, color);
      });
    }
  }

  get SquareSize() {
    return this.game.canvas.shortSide / (this.game.board[0].length + 2);
  }

  public draw(canvas: Canvas, dt: number): void {
    this.timeSinceMove += dt;
    canvas.save();
    // canvas.fillRect(
    //   0,
    //   0,
    //   canvas.width,
    //   canvas.height,
    //   new Color("rgb(255,255,255)")
    // );
    canvas.translate(this.SquareSize, canvas.height / this.game.board.length);
    var firstRowInColumn = false;
    for (let i = 0; i < this.game.board.length; i++) {
      for (let j = 0; j < this.game.board[i].length; j++) {
        if (this.game.board[i][j] === 0) {
          continue;
        }
        var startPosition = new Vector(this.SquareSize * j, 0);
        var endPosition = new Vector(this.SquareSize * j, this.SquareSize * i);
        if (this.game.lastColumn === j && !firstRowInColumn) {
          endPosition = startPosition.lerp(
            endPosition,
            Math.min(
              1,
              Math.pow(this.timeSinceMove, 2) /
                Math.pow(Connect4Scene.AnimationSpeed, 2)
            )
          );
          firstRowInColumn = true;
        }
        canvas.drawImage(
          this.players[this.game.board[i][j]],
          endPosition.x,
          endPosition.y,
          0,
          this.SquareSize / this.players[this.game.board[i][j]].width
        );
      }
    }
    var mouseColumn = this.game.getColumnFromPosition(canvas.mouse.pos);
    if (this.game.isAbleToDrop(mouseColumn)) {
      canvas.setLineWidth(4);
      canvas.strokeRoundedRect(
        mouseColumn * this.SquareSize,
        0,
        this.SquareSize,
        this.SquareSize * this.game.board.length,
        this.SquareSize / 5,
        new Color("#2c1", "#cc4")
      );
    }
    canvas.fillRoundedRect(
      0,
      this.SquareSize * (this.game.board.length + 0.1),
      this.SquareSize * this.game.board[0].length,
      this.SquareSize / 10,
      this.SquareSize / 15,
      new Color("#222", "#ddd")
    );
    canvas.restore();
    if (this.game.state === Connect4State.GameOver) {
      canvas.setTextAlign("center");
      canvas.setTextBaseline("middle");
      canvas.setFontSize(30);
      canvas.fillText(
        canvas.width / 2,
        canvas.height / 2,
        t("game-over"),
        new Color("#fff")
      );
    }
  }
}
