import { SnakeScene } from "./SnakeScene";
import { Vector } from "@/core/utils/Vector";
import { CanvasGame } from "@/core/game/CanvasGame";

export enum SnakeState {
  Starting,
  Playing,
  Dead,
}
export type SnakeDirection = "up" | "down" | "left" | "right";

export class Snake extends CanvasGame {
  public static BoardSize: number = 9;
  public static Speed: number = 200;
  public static readonly OppositeDirection: {
    [key in SnakeDirection]: SnakeDirection;
  } = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };
  public static readonly DirectionMap: { [key in SnakeDirection]: Vector } = {
    up: new Vector(0, -1),
    down: new Vector(0, 1),
    left: new Vector(-1, 0),
    right: new Vector(1, 0),
  };

  protected _scene: SnakeScene;

  public gameState: SnakeState = SnakeState.Starting;
  public head: Vector = this.getDefaultHead();
  public lastHeadPosition: Vector = this.head;
  public lastTailPosition: Vector = this.head.add(Vector.left());
  public snake: Vector[] = this.getDefaultSnake();
  public apple: Vector = this.getDefaultApple();
  public direction: SnakeDirection = "right";
  public directions: SnakeDirection[] = [];
  constructor() {
    super({ fixedUpdateStep: Snake.Speed });
    this._scene = new SnakeScene(this);
    this.name = "Snake";
  }

  public generateApple(): Vector {
    var position = new Vector(
      Math.floor(Math.random() * Snake.BoardSize),
      Math.floor(Math.random() * Snake.BoardSize)
    );

    var onSnake = false;
    for (var i = 0; i < this.snake.length; i++) {
      if (position.equals(this.snake[i])) {
        onSnake = true;
        break;
      }
    }

    if (onSnake) {
      return this.generateApple();
    }

    return position;
  }

  public getDefaultHead(): Vector {
    return new Vector(
      Math.floor(Snake.BoardSize / 2) -
        Math.min(3, Math.floor(Snake.BoardSize / 2) - 2),
      Math.floor(Snake.BoardSize / 2)
    );
  }

  public getDefaultSnake(): Vector[] {
    return [this.getDefaultHead().add(Vector.left()), this.getDefaultHead()];
  }

  public getDefaultApple(): Vector {
    return new Vector(
      Math.floor(Snake.BoardSize / 2) +
        Math.min(3, Math.floor(Snake.BoardSize / 2) - 2),
      Math.floor(Snake.BoardSize / 2)
    );
  }

  private newDirection() {
    if (this.directions.length > 0) {
      var key = this.directions.shift() as SnakeDirection;
      while (
        key === this.direction ||
        key === Snake.OppositeDirection[this.direction]
      ) {
        if (this.directions.length > 0) {
          key = this.directions.shift() as SnakeDirection;
        } else {
          return;
        }
      }
      this.direction = key;
    }
  }

  private isDead(head: Vector): boolean {
    if (
      head.x < 0 ||
      head.x >= Snake.BoardSize ||
      head.y < 0 ||
      head.y >= Snake.BoardSize
    ) {
      return true;
    }
    for (var i = 0; i < this.snake.length; i++) {
      if (head.equals(this.snake[i])) {
        return true;
      }
    }
    return false;
  }

  public fixedUpdate(dt: number): void {
    if (this.gameState === SnakeState.Playing) {
      this.newDirection();
      this.lastHeadPosition = this.head;
      var direction = Snake.DirectionMap[this.direction];
      this.head = this.head.add(direction);
      if (this.isDead(this.head)) {
        this.gameState = SnakeState.Dead;
        this.head = this.head.sub(direction);
        return;
      }
      this.snake.push(this.head);
      if (!this.head.equals(this.apple)) {
        var tail = this.snake.shift();
        if (tail) {
          this.lastTailPosition = tail;
        }
      } else {
        if (this.snake.length === Snake.BoardSize * Snake.BoardSize) {
          this.gameState = SnakeState.Dead;
          return;
        } else {
          this.apple = this.generateApple();
        }
      }
    }
    this._scene.sinceLastUpdate = 0;
  }

  public update(dt: number): void {}

  public keyDown(event: KeyboardEvent): void {
    if (this.gameState !== SnakeState.Dead && event.repeat === false) {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          this.directions.push("up");
          break;
        case "KeyS":
        case "ArrowDown":
          this.directions.push("down");
          break;
        case "KeyA":
        case "ArrowLeft":
          this.directions.push("left");
          break;
        case "KeyD":
        case "ArrowRight":
          this.directions.push("right");
          break;
        default:
          return;
      }
      if (this.gameState === SnakeState.Starting) {
        this.gameState = SnakeState.Playing;
      }
    }
  }

  public restart(): void {
    this.head = this.getDefaultHead();
    this.lastHeadPosition = this.head;
    this.lastTailPosition = this.head.add(Vector.left());
    this.snake = this.getDefaultSnake();
    this.apple = this.getDefaultApple();
    this.direction = "right";
    this.directions = [];
    this.gameState = SnakeState.Starting;
  }
}
