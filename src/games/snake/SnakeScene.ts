import { CanvasImage } from "@/core/canvas/internal";
import { Canvas } from "@/core/canvas/internal";
import { Color } from "@/core/utils/Color";
import { Snake, SnakeState } from "./Snake";

export class SnakeScene {
  public head: CanvasImage = new CanvasImage(100, 100, (image) => {
    image.fillRoundedRect(10, 10, 80, 80, 5, new Color("#3d3"));
    var radius = 7;
    var pupilSize = (radius * 2) / 3;
    image.setLineWidth(pupilSize);
    image.beginPath();
    image.circle(25, 25, radius);
    image.fill(new Color("#000"));
    image.stroke(new Color("#fff"));
    image.beginPath();
    image.circle(75, 25, radius);
    image.fill(new Color("#000"));
    image.stroke(new Color("#fff"));
  });

  public snakeBody: CanvasImage = new CanvasImage(100, 100, (image) => {
    image.fillRoundedRect(10, 10, 80, 80, 5, new Color("#3d3"));
    // image.setLineWidth(3);
    // image.beginPath();
    // image.moveTo(50, 30);
    // image.lineTo(30, 50);
    // image.lineTo(50, 70);
    // image.lineTo(70, 50);
    // image.lineTo(50, 30);
    // image.stroke(new Color("#000"));
  });

  public apple: CanvasImage = new CanvasImage(100, 100, (image) => {
    image.fillCircle(50, 50, 40, new Color("#d33"));
  });

  public sinceLastUpdate = 0;

  private game: Snake;

  public get squareSize() {
    return this.game.canvas.shortSide / Snake.BoardSize;
  }

  public constructor(snake: Snake) {
    this.game = snake;
  }

  public draw(canvas: Canvas, dt: number): void {
    var widthIsShort = canvas.width <= canvas.height;
    var halfShift = canvas.shortSide / 2;
    if (widthIsShort) {
      canvas.translate(0, canvas.height / 2 - halfShift);
    } else {
      canvas.translate(canvas.width / 2 - halfShift, 0);
    }
    this.drawBoard(canvas);
    this.drawApple(canvas);
    this.drawSnakeBody(canvas);
    this.drawSnakeHead(dt, canvas);
    this.drawMessages(canvas);
  }

  private drawMessages(canvas: Canvas) {
    if (this.game.gameState === SnakeState.Dead) {
      canvas.resetTransform();
      canvas.setFontSize(50);
      canvas.setFontFamily("monospace");
      canvas.setTextAlign("center");
      canvas.setTextBaseline("middle");
      canvas.fillText(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
        "Game Over",
        new Color("#111", "#eee")
      );
    }
  }
  private drawBoard(canvas: Canvas) {
    const squareSize = this.squareSize;
    for (let i = 0; i < Snake.BoardSize; i++) {
      for (let j = 0; j < Snake.BoardSize; j++) {
        canvas.fillRect(
          i * squareSize,
          j * squareSize,
          squareSize,
          squareSize,
          (i + j) % 2 === 0
            ? new Color("#eee", "#222")
            : new Color("#ddd", "#333")
        );
      }
    }
  }

  private drawSnakeBody(canvas: Canvas) {
    this.game.snake.forEach((position, index) => {
      if (index === this.game.snake.length - 1) {
        return;
      }
      var interpolatedPosition = position;
      if (this.game.gameState === SnakeState.Playing) {
        var previousPosition = this.game.snake[index - 1];
        if (previousPosition === undefined) {
          previousPosition = this.game.lastTailPosition;
        }
        interpolatedPosition = previousPosition.lerp(
          position,
          this.sinceLastUpdate / Snake.Speed
        );

        // this rotates the body to face the direction of the next segment
        // but I didn't like how it looked

        // var previousRotation = position.angleTo(previousPosition);
        // var nextRotation = this.game.snake[index + 1].angleTo(position);
        // if (nextRotation - previousRotation > Math.PI) {
        //   nextRotation -= Math.PI * 2;
        // }
        // if (nextRotation - previousRotation < -Math.PI) {
        //   nextRotation += Math.PI * 2;
        // }
        // rotation =
        //   previousRotation +
        //   (nextRotation - previousRotation) *
        //     (this.sinceLastUpdate / Snake.Speed);
      }
      canvas.drawImage(
        this.snakeBody,
        interpolatedPosition.x * this.squareSize,
        interpolatedPosition.y * this.squareSize,
        // rotation,
        0,
        this.squareSize / this.snakeBody.width
      );
    });
  }

  private drawApple(canvas: Canvas) {
    canvas.drawImage(
      this.apple,
      this.game.apple.x * this.squareSize,
      this.game.apple.y * this.squareSize,
      0,
      this.squareSize / this.apple.width
    );
  }

  private drawSnakeHead(dt: number, canvas: Canvas) {
    this.sinceLastUpdate += dt;
    var headPosition = this.game.head;

    if (this.game.gameState === SnakeState.Playing) {
      headPosition = this.game.lastHeadPosition.lerp(
        this.game.head,
        this.sinceLastUpdate / Snake.Speed
      );
    }
    canvas.drawImage(
      this.head,
      headPosition.x * this.squareSize,
      headPosition.y * this.squareSize,
      Snake.DirectionMap[this.game.direction].angle() + Math.PI / 2,
      this.squareSize / this.head.width
    );
  }
}
