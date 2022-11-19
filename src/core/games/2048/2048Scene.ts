import { Scene, Canvas, CanvasImage } from "@/core/canvas/internal";
import { Vector } from "@/core/utils/Vector";
import { Color } from "@/core/utils/Color";
import { TwentyFourtyEight } from "./2048";

export class TwentyFourtyEightScene implements Scene {
  public static AnimationSpeed: number = 100;

  public static SquareColors: { [key: number]: string } = {
    0: "#aaa",
    2: "#eee4da",
    4: "#eee1c9",
    8: "#f3b27a",
    16: "#f69664",
    32: "#f77c5f",
    64: "#f75f3b",
    128: "#edd073",
    256: "#edcc62",
    512: "#edc950",
    1024: "#edc53f",
    2048: "#edc22e",
  };

  public game: TwentyFourtyEight;

  public blocks: { [key: number]: CanvasImage } = {};

  public empty: CanvasImage = new CanvasImage(300, 300, (image) => {
    image.fillRoundedRect(20, 20, 260, 260, 30, new Color("#ccc", "#444"));
  });

  public get squareSize() {
    return this.game.canvas.width / 4;
  }

  constructor(game: TwentyFourtyEight) {
    this.game = game;
    for (let i = 1; i < 2048; i *= 2) {
      this.blocks[i] = new CanvasImage(300, 300, (image) => {
        var colorHex = "#000";
        if (i in TwentyFourtyEightScene.SquareColors) {
          colorHex = TwentyFourtyEightScene.SquareColors[i];
        }
        var color = new Color(colorHex);
        image.fillRoundedRect(20, 20, 260, 260, 30, color);
        image.setFontSize(100);
        image.setFontWeight("bold");
        image.setTextAlign("center");
        image.setTextBaseline("middle");
        image.fillText(
          150,
          150,
          i.toString(),
          new Color(i > 4 ? "#fff" : "#333")
        );
      });
    }
  }

  public draw(canvas: Canvas, dt: number) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        canvas.drawImage(
          this.empty,
          j * this.squareSize,
          i * this.squareSize,
          0,
          this.squareSize / this.empty.width
        );
        var index = i * 4 + j;
        var value = this.game.board[index];
        var oldValue = this.game.lastBoard[index];
        if (
          this.game.timeSinceMove > TwentyFourtyEightScene.AnimationSpeed ||
          (value === oldValue &&
            this.game.movedTiles.findIndex((v) => v.end === index) === -1) ||
          this.game.mergedTiles.includes(index) ||
          this.game.addedTiles.includes(index)
        ) {
          if (
            value === oldValue * 2 &&
            this.game.timeSinceMove < TwentyFourtyEightScene.AnimationSpeed
          ) {
            value = oldValue;
          }
          if (value in this.blocks) {
            var max = this.squareSize / this.blocks[value].width;
            var scale;
            var x = j * this.squareSize;
            var y = i * this.squareSize;
            if (this.game.addedTiles.includes(index)) {
              var time = Math.min(
                1,
                this.game.timeSinceMove / TwentyFourtyEightScene.AnimationSpeed
              );
              scale = max * time;
              var halfSquare = this.squareSize / 2;
              x += halfSquare * (1 - time);
              y += halfSquare * (1 - time);
            } else {
              scale = max;
            }
            canvas.drawImage(this.blocks[value], x, y, 0, scale);
          }
        }
      }
    }
    if (this.game.timeSinceMove < TwentyFourtyEightScene.AnimationSpeed) {
      for (let i = 0; i < this.game.movedTiles.length; i++) {
        var startIndex = this.game.movedTiles[i].start;
        var endIndex = this.game.movedTiles[i].end;
        var tile = this.game.movedTiles[i];
        var oldPos = new Vector(startIndex % 4, Math.floor(startIndex / 4));
        var newPos = new Vector(endIndex % 4, Math.floor(endIndex / 4));
        var value = this.game.lastBoard[tile.start];
        var oldPosLerp = oldPos
          .lerp(
            newPos,
            this.game.timeSinceMove / TwentyFourtyEightScene.AnimationSpeed
          )
          .mulScalar(this.squareSize);
        canvas.drawImage(
          this.blocks[value],
          oldPosLerp.x,
          oldPosLerp.y,
          0,
          this.squareSize / this.blocks[value].width
        );
      }
    }
  }
}
