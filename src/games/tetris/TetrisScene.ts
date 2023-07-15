import { Canvas } from "@/core/canvas/Canvas";
import { CanvasImage } from "@/core/canvas/internal";
import { Scene } from "@/core/canvas/Scene";
import { Color } from "@/core/utils/Color";
import { Tetris, TetrisState } from "./Tetris";

export class TetrisScene implements Scene {
  public game: Tetris;

  public blocks: CanvasImage[] = [];

  public get squareSize() {
    return (
      this.game.canvas.shortSide /
      Math.max(Tetris.BoardSize.width, Tetris.BoardSize.height)
    );
  }

  constructor(game: Tetris) {
    this.game = game;
    const colors = [
      new Color("#2ef"),
      new Color("#dc1"),
      new Color("#e45"),
      new Color("#2da"),
      new Color("#d5f"),
      new Color("#d82"),
      new Color("#29f"),
    ];
    for (let i = 0; i < Tetris.Pieces.length; i++) {
      const color = colors[i % colors.length];
      this.blocks.push(
        new CanvasImage(300, 300, (image) => {
          image.fillRect(0, 0, 300, 300, color);
        })
      );
    }
  }

  draw(canvas: Canvas, dt: number): void {
    this.drawBoard(canvas);
    this.drawUI(canvas);
  }

  drawBoard(canvas: Canvas) {
    for (let i = 0; i < this.game.board.length; i++) {
      for (let j = 0; j < this.game.board[i].length; j++) {
        var widthOffset =
          (canvas.width - this.squareSize * Tetris.BoardSize.width) / 2;
        var heightOffset =
          (canvas.height - this.squareSize * Tetris.BoardSize.height) / 2;
        var bounds = this.game.getPieceBounds(this.game.currentPieceShape);
        var boundedX =
          j >= this.game.currentPiece.x &&
          j < this.game.currentPiece.x + bounds.width;
        var boundedY =
          i >= this.game.currentPiece.y &&
          i < this.game.currentPiece.y + bounds.height;
        var isInBounds = boundedX && boundedY;
        var isCurrentBlock =
          isInBounds &&
          this.game.currentPieceShape[i - this.game.currentPiece.y][
            j - this.game.currentPiece.x
          ] === 1;
        if (isCurrentBlock || this.game.board[i][j] !== 0) {
          const block = isCurrentBlock
            ? this.game.currentPiece.piece - 1
            : this.game.board[i][j] - 1;
          canvas.drawImage(
            this.blocks[block],
            j * this.squareSize + widthOffset,
            i * this.squareSize + heightOffset,
            0,
            this.squareSize / this.blocks[block].width
          );
        } else {
          canvas.strokeRect(
            j * this.squareSize + widthOffset,
            i * this.squareSize + heightOffset,
            this.squareSize,
            this.squareSize,
            new Color("#bbb", "#444")
          );
        }
      }
    }
  }

  drawUI(canvas: Canvas) {
    const textColor = new Color("#111", "#ccc");
    canvas.setFontSize(this.squareSize);
    canvas.fillText(this.squareSize, this.squareSize, "Next", textColor);
    this.drawPieceDisplay(
      canvas,
      this.squareSize,
      this.squareSize * 2,
      this.game.nextPiece
    );
    canvas.fillText(
      canvas.width - this.squareSize * 4,
      this.squareSize,
      "Hold",
      textColor
    );
    this.drawPieceDisplay(
      canvas,
      canvas.width - this.squareSize * 4,
      this.squareSize * 2,
      this.game.heldPiece
    );
    canvas.setFontSize(this.squareSize / 1.5);
    canvas.fillText(
      canvas.width - this.squareSize * 4,
      canvas.height - this.squareSize * 2,
      "Score : " + this.game.score,
      textColor,
      this.squareSize * 4
    );
    canvas.fillText(
      canvas.width - this.squareSize * 4,
      canvas.height - this.squareSize * 5,
      "Level : " + this.game.level,
      textColor,
      this.squareSize * 4
    );
    if (this.game.gameState === TetrisState.Dead) {
      canvas.setFontSize(this.squareSize * 3);
      canvas.save();
      canvas.setTextBaseline("middle");
      canvas.setTextAlign("center");
      canvas.fillText(canvas.width / 2, canvas.height / 2, "Game Over");
      canvas.restore();
    }
  }

  drawPieceDisplay(canvas: Canvas, x: number, y: number, piece: number) {
    var size = this.squareSize * 3;
    canvas.save();
    canvas.setLineWidth(5);
    canvas.fillRect(x, y, size, size, new Color("#ccc", "#111"));
    canvas.strokeRect(x, y, size, size);
    canvas.restore();
    if (piece !== -1) {
      const block = piece - 1;
      var pieceShape = Tetris.Pieces[block].shapes[/*Get First direction*/ 0];
      var bounds = this.game.getPieceBounds(pieceShape);
      for (let i = 0; i < pieceShape.length; i++) {
        for (let j = 0; j < pieceShape[i].length; j++) {
          if (pieceShape[i][j] === 1) {
            canvas.drawImage(
              this.blocks[block],
              x + size / 2 - ((size / 4) * bounds.width) / 2 + j * (size / 4),
              y + size / 2 - ((size / 4) * bounds.height) / 2 + i * (size / 4),
              0,
              size / 4 / this.blocks[block].width
            );
          }
        }
      }
    }
  }
}
