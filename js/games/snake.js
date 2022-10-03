import { Color, Style } from "../canvas.js";
import { Game } from "../game.js";
import { GameLoop } from "../game_loop.js";

export class Snake extends Game {
  /**
   * @param {Canvas} canvas
   */
  constructor(canvas) {
    super(canvas);
    this.ROWSIZE = 10;
    this.snake = [this.head];
    this.apple = this.generateApple();
    this.appleScale = 0;
    this.head =
      Math.floor(this.ROWSIZE / 2) * this.ROWSIZE +
      Math.floor(this.ROWSIZE / 2);
    this.direction = 1;
    this.running = true;
    this.keys = [];
    this.directionMap = {
      left: -1,
      right: 1,
      up: -this.ROWSIZE,
      down: this.ROWSIZE,
    };
    this.afterInit();
  }

  generateApple() {
    var tmp = Math.floor(Math.random() * Math.pow(this.ROWSIZE, 2));
    while (this.snake.includes(tmp)) {
      tmp = Math.floor(Math.random() * Math.pow(this.ROWSIZE, 2));
    }
    return tmp;
  }

  update() {
    if (this.running) {
      this.newDirection();
      if (this.isDead(this.head)) {
        this.running = false;
        return;
      }
      this.head += this.direction;
      this.snake.push(this.head);
      if (this.head !== this.apple) {
        this.snake.shift();
      } else {
        if (this.snake.length === this.ROWSIZE * this.ROWSIZE) {
          this.running = false;
        } else {
          this.apple = this.generateApple();
        }
      }
    }
  }

  newDirection() {
    if (this.keys.length > 0) {
      var key = this.keys.shift();
      while (
        this.directionMap[key] === this.direction ||
        this.directionMap[key] === -this.direction
      ) {
        if (this.keys.length > 0) {
          key = this.keys.shift();
        } else {
          return;
        }
      }
      this.direction = this.directionMap[key];
    }
  }

  isDead(start) {
    if (start % this.ROWSIZE === this.ROWSIZE - 1 && this.direction === 1) {
      return true;
    }
    if (start % this.ROWSIZE === 0 && this.direction === -1) {
      return true;
    }
    if (
      start + this.direction < 0 ||
      start + this.direction > this.ROWSIZE * this.ROWSIZE - 1
    ) {
      return true;
    }
    return this.snake
      .slice(0, this.snake.length - 1)
      .includes(start + this.direction);
  }

  keyPressEvent(e) {
    var keymap = {
      ArrowRight: "right",
      ArrowLeft: "left",
      ArrowUp: "up",
      ArrowDown: "down",
      KeyW: "up",
      KeyS: "down",
      KeyA: "left",
      KeyD: "right",
    };
    if (!e.repeat) {
      if (e.code === "KeyR") {
        this.head =
          Math.floor(this.ROWSIZE / 2) * this.ROWSIZE +
          Math.floor(this.ROWSIZE / 2);
        this.snake = [this.head];
        this.direction = 1;
        this.updateStep = 0;
        this.lastupdate = 0;
        this.keys = [];
        this.running = true;
        this.apple = this.generateApple();
        return;
      }
      if (Object.keys(keymap).includes(e.code)) {
        var key = keymap[e.code];
        this.keys.push(key);
      }
    }
  }

  draw() {
    this.drawGrid();
    this.drawApple();
    this.drawSnake();
  }

  drawGrid() {
    var squareSize = this.canvas.size / this.ROWSIZE;
    for (let column = 0; column < squareSize; column++) {
      for (let row = 0; row < squareSize; row++) {
        this.canvas.drawRect(
          column * squareSize,
          row * squareSize,
          squareSize,
          squareSize,
          (row + column) % 2 === 0 ? Color.PrimaryColor : Color.SecondaryColor,
          Style.Fill
        );
      }
    }
  }

  drawApple() {
    var squareSize = this.canvas.size / this.ROWSIZE;
    this.appleScale += 0.002 * GameLoop.deltaTime;
    var appleRow = Math.floor(this.apple / this.ROWSIZE);
    var appleColumn = Math.floor(this.apple % this.ROWSIZE);
    var scaleFactor = Math.sin(this.appleScale) * 0.025 + 0.025;
    this.canvas.setColor("#e35655", Style.Fill);
    this.canvas.drawCircle(
      (appleColumn + 0.5) * squareSize,
      (appleRow + 0.5) * squareSize,
      squareSize * (0.4 + scaleFactor),
      Color.Custom,
      Style.Fill
    );
  }

  drawSnake() {
    this.drawHead();
    var squareSize = this.canvas.size / this.ROWSIZE;
    for (let i = 0; i < this.snake.length - 1; i++) {
      var row = Math.floor(this.snake[i] / this.ROWSIZE);
      var column = Math.floor(this.snake[i] % this.ROWSIZE);
      this.canvas.setColor("#33bb66");
      this.canvas.drawRect(
        (column + 0.1) * squareSize,
        (row + 0.1) * squareSize,
        squareSize * 0.8,
        squareSize * 0.8,
        Color.Custom,
        Style.Fill
      );
      if (i - 1 !== -1) {
        this.drawConnection(this.snake[i], this.snake[i - 1]);
      }
      if (i + 1 !== this.snake.length) {
        this.drawConnection(this.snake[i], this.snake[i + 1]);
      }
    }
  }

  drawHead() {
    var squareSize = this.canvas.size / this.ROWSIZE;
    var row = Math.floor(this.head / this.ROWSIZE);
    var column = Math.floor(this.head % this.ROWSIZE);
    this.canvas.setColor("#33bb66");
    this.canvas.drawRect(
      (column + 0.1) * squareSize,
      (row + 0.1) * squareSize,
      squareSize * 0.8,
      squareSize * 0.8,
      Color.Custom,
      Style.Fill
    );
    if (this.snake.length !== 1) {
      this.drawConnection(this.head, this.snake[this.snake.length - 2]);
    }
    this.canvas.setColor("#fff");
    var eyeOffsets = {
      left: {
        x: this.direction === 1 || this.direction === -this.ROWSIZE ? 0.5 : 0,
        y: this.direction === this.ROWSIZE || this.direction === 1 ? 0.5 : 0,
      },
      right: {
        x: this.direction === this.ROWSIZE || this.direction === 1 ? 0.5 : 0,
        y: this.direction === this.ROWSIZE || this.direction === -1 ? 0.5 : 0,
      },
    };
    this.canvas.drawCircle(
      (column + 0.25 + eyeOffsets.left.x) * squareSize,
      (row + 0.25 + eyeOffsets.left.y) * squareSize,
      squareSize * 0.1,
      Color.Custom,
      Style.Fill
    );
    this.canvas.drawCircle(
      (column + 0.25 + eyeOffsets.right.x) * squareSize,
      (row + 0.25 + eyeOffsets.right.y) * squareSize,
      squareSize * 0.1,
      Color.Custom,
      Style.Fill
    );

    this.canvas.setColor("#000");
    this.canvas.drawCircle(
      (column + 0.25 + eyeOffsets.left.x) * squareSize,
      (row + 0.25 + eyeOffsets.left.y) * squareSize,
      squareSize * 0.05,
      Color.Custom,
      Style.Fill
    );
    this.canvas.drawCircle(
      (column + 0.25 + eyeOffsets.right.x) * squareSize,
      (row + 0.25 + eyeOffsets.right.y) * squareSize,
      squareSize * 0.05,
      Color.Custom,
      Style.Fill
    );
  }

  drawConnection(node, connectsTo) {
    var squareSize = this.canvas.size / this.ROWSIZE;
    var connectionDirection = connectsTo - node;
    var row = Math.floor(node / this.ROWSIZE);
    var column = Math.floor(node % this.ROWSIZE);

    switch (connectionDirection) {
      case 1:
        this.canvas.drawRect(
          (column + 0.8) * squareSize,
          (row + 0.1) * squareSize,
          squareSize * 0.2,
          squareSize * 0.8,
          Color.Custom,
          Style.Fill
        );
        break;
      case -1:
        this.canvas.drawRect(
          column * squareSize,
          (row + 0.1) * squareSize,
          squareSize * 0.2,
          squareSize * 0.8,
          Color.Custom,
          Style.Fill
        );
        break;
      case -this.ROWSIZE:
        this.canvas.drawRect(
          (column + 0.1) * squareSize,
          row * squareSize,
          squareSize * 0.8,
          squareSize * 0.2,
          Color.Custom,
          Style.Fill
        );
        break;
      case this.ROWSIZE:
        this.canvas.drawRect(
          (column + 0.1) * squareSize,
          (row + 0.8) * squareSize,
          squareSize * 0.8,
          squareSize * 0.2,
          Color.Custom,
          Style.Fill
        );
        break;
    }
  }
}
