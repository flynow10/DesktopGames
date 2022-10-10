import { Color, Style } from "../canvas.js";
import { Game } from "../game.js";

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  scale(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    this.scale(1 / this.magnitude());
    return this;
  }
  isZero() {
    return this.x === 0 && this.y === 0;
  }
}

class Paddle {
  constructor(x, canvasSize) {
    this.pos = new Vector(x, 0);
    this.score = 0;
    this.canvasSize = canvasSize;
  }
  updatePosition(deltaPosition) {
    this.pos.y = Math.min(
      this.canvasSize - Paddle.paddleSize,
      Math.max(0, this.pos.y + deltaPosition)
    );
  }
  static paddleSpeed = 8;
  static paddleSize = 100;
}
export class Pong extends Game {
  ball = {
    pos: new Vector(0, 0),
    vel: new Vector(0, 0),
  };
  ballSpeed = 4;
  paddle1 = new Paddle(0, this.canvas.size);
  paddle2 = new Paddle(this.canvas.size - 10, this.canvas.size);
  keys = {
    ArrowUp: false,
    ArrowDown: false,
    KeyS: false,
    KeyW: false,
  };
  constructor(canvas) {
    super(canvas);
    this.options.updateStep = 10;
    this.options.bindRestartKey = true;
    this.afterInit();
    this.restart();
  }

  restart() {
    this.ball.pos.x = this.canvas.size / 2;
    this.ball.pos.y = this.canvas.size / 2;
    this.ball.vel.x = Math.random() * 2 - 1;
    this.ball.vel.y = Math.random() * 2 - 1;
  }

  update() {
    this.updateBall();
    this.updatePaddles();
  }

  updateBall() {
    if (!this.ball.vel.isZero()) {
      this.ball.pos.add(this.ball.vel.normalize().scale(this.ballSpeed));
    }
    if (this.ball.pos.y <= 10 || this.ball.pos.y >= this.canvas.size - 10) {
      this.ball.vel.y = -this.ball.vel.y;
    }
    if (
      this.ball.pos.x <= 20 &&
      this.ball.pos.y + 10 >= this.paddle1.pos.y &&
      this.ball.pos.y - 10 <= this.paddle1.pos.y + Paddle.paddleSize
    ) {
      this.ball.vel.x = -this.ball.vel.x;
      this.calculateBounce(this.paddle1);
      this.paddle1.score++;
    }
    if (
      this.ball.pos.x >= this.canvas.size - 20 &&
      this.ball.pos.y + 10 >= this.paddle2.pos.y &&
      this.ball.pos.y - 10 <= this.paddle2.pos.y + Paddle.paddleSize
    ) {
      this.ball.vel.x = -this.ball.vel.x;
      this.calculateBounce(this.paddle2);
      this.paddle1.score++;
    }
  }

  /**
   * @param {Paddle} paddle
   */
  calculateBounce(paddle) {
    var zeroedY = this.ball.pos.y + 10 - paddle.pos.y;
    var normalizedY = zeroedY / Paddle.paddleSize;
    this.ball.vel.y = normalizedY * 8 - 4;
  }

  updatePaddles() {
    if (this.keys.ArrowDown) {
      this.paddle2.updatePosition(Paddle.paddleSpeed);
    }
    if (this.keys.ArrowUp) {
      this.paddle2.updatePosition(-Paddle.paddleSpeed);
    }
    if (this.keys.KeyS) {
      this.paddle1.updatePosition(Paddle.paddleSpeed);
    }
    if (this.keys.KeyW) {
      this.paddle1.updatePosition(-Paddle.paddleSpeed);
    }
  }

  draw() {
    this.drawBall();
    this.drawPaddles();
  }

  drawBall() {
    this.canvas.drawCircle(
      this.ball.pos.x,
      this.ball.pos.y,
      10,
      Color.PrimaryColor,
      Style.Fill
    );
  }

  drawPaddles() {
    var paddles = [this.paddle1, this.paddle2];
    for (let i = 0; i < paddles.length; i++) {
      var paddle = paddles[i];
      this.canvas.drawRect(
        paddle.pos.x,
        paddle.pos.y,
        10,
        Paddle.paddleSize,
        Color.SecondaryColor,
        Style.Fill
      );
    }
  }

  /**
   * @param {KeyboardEvent} e
   */
  keyDownEvent(e) {
    if (e.code in this.keys) {
      this.keys[e.code] = true;
    }
  }

  /**
   * @param {KeyboardEvent} e
   */
  keyUpEvent(e) {
    if (e.code in this.keys) {
      this.keys[e.code] = false;
    }
  }
}
