import { Scene } from "@/core/canvas/Scene";
import { CanvasGame } from "@/core/game/CanvasGame";
import { TetrisScene } from "./TetrisScene";

export type TetrisPiece = {
  x: number;
  y: number;
  piece: number;
  direction: number;
};
export type TetrisPieceShape = number[][];

export enum TetrisState {
  Running,
  Dead,
}

export class Tetris extends CanvasGame {
  public static BoardSize = {
    width: 10,
    height: 20,
  };
  public static Pieces: { shapes: TetrisPieceShape[] }[] = [
    {
      shapes: [[[1], [1], [1], [1]], [[1, 1, 1, 1]]],
    },
    {
      shapes: [
        [
          [0, 1, 0],
          [1, 1, 1],
        ],
        [
          [1, 0],
          [1, 1],
          [1, 0],
        ],
        [
          [1, 1, 1],
          [0, 1, 0],
        ],
        [
          [0, 1],
          [1, 1],
          [0, 1],
        ],
      ],
    },
    {
      shapes: [
        [
          [1, 1],
          [1, 1],
        ],
      ],
    },
    {
      shapes: [
        [
          [1, 0],
          [1, 0],
          [1, 1],
        ],
        [
          [1, 1, 1],
          [1, 0, 0],
        ],
        [
          [1, 1],
          [0, 1],
          [0, 1],
        ],
        [
          [0, 0, 1],
          [1, 1, 1],
        ],
      ],
    },
    {
      shapes: [
        [
          [0, 1],
          [0, 1],
          [1, 1],
        ],
        [
          [1, 0, 0],
          [1, 1, 1],
        ],
        [
          [1, 1],
          [1, 0],
          [1, 0],
        ],
        [
          [1, 1, 1],
          [0, 0, 1],
        ],
      ],
    },
    {
      shapes: [
        [
          [1, 1, 0],
          [0, 1, 1],
        ],
        [
          [0, 1],
          [1, 1],
          [1, 0],
        ],
      ],
    },
    {
      shapes: [
        [
          [0, 1, 1],
          [1, 1, 0],
        ],
        [
          [1, 0],
          [1, 1],
          [0, 1],
        ],
      ],
    },
  ];

  public board: number[][] = this.getNewBoard();
  public currentPiece: TetrisPiece = this.getNewPiece();
  public heldPiece: number = -1;
  public nextPiece: number = this.getNewPiece().piece;
  public hasBeenHeld: boolean = false;
  public score: number = 0;
  public linesCleared: number = 0;
  public level: number = 1;
  public gameState: TetrisState = TetrisState.Running;

  public timeSinceStep: number = 0;
  public stepSpeed: number = 1000;

  protected _scene: Scene = new TetrisScene(this);

  public constructor() {
    super();
  }

  protected getNewBoard() {
    return new Array(Tetris.BoardSize.height)
      .fill(0)
      .map(() => new Array(Tetris.BoardSize.width).fill(0));
  }

  protected getRandomPieceType() {
    return Math.floor(Math.random() * Tetris.Pieces.length) + 1;
  }

  protected getNewPiece(pieceType?: number) {
    return {
      x: 3,
      y: 0,
      piece: pieceType || this.getRandomPieceType(),
      direction: 0,
    };
  }

  protected setNextPiece(piece = -1) {
    if (piece === -1) {
      this.currentPiece = this.getNewPiece(this.nextPiece);
      this.nextPiece = this.getRandomPieceType();
      if (this.isCollidingWithBoard()) {
        this.gameState = TetrisState.Dead;
      }
    } else {
      this.currentPiece = this.getNewPiece(piece);
    }
  }

  public updateLevel() {
    this.level = Math.floor(this.linesCleared / 8) + 1;
    this.stepSpeed = Math.max(
      Math.round(1001 - this.level * this.level * this.level),
      200
    );
  }

  public update(dt: number): void {
    this.timeSinceStep += dt;
    if (this.timeSinceStep >= this.stepSpeed) {
      this.step();
      this.timeSinceStep = 0;
    }
  }

  public step(): boolean {
    if (this.gameState === TetrisState.Running) {
      if (!this.drop()) {
        for (let i = 0; i < this.currentPieceShape.length; i++) {
          for (let j = 0; j < this.currentPieceShape[i].length; j++) {
            if (this.currentPieceShape[i][j] === 1) {
              this.board[this.currentPiece.y + i][this.currentPiece.x + j] =
                this.currentPiece.piece;
            }
          }
        }
        this.setNextPiece();
        this.checkLineClear();
        this.hasBeenHeld = false;
        return false;
      }
      return true;
    }
    return true;
  }

  checkLineClear() {
    var clearLines = [];
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i].every((value) => value !== 0)) {
        clearLines.push(i);
      }
    }
    for (let i = 0; i < clearLines.length; i++) {
      this.board[clearLines[i]] = new Array(Tetris.BoardSize.width).fill(0);
      for (let j = clearLines[i]; j > 0; j--) {
        [this.board[j], this.board[j - 1]] = [this.board[j - 1], this.board[j]];
      }
    }
    var scores = [40, 100, 300, 1200];
    if (clearLines.length !== 0) {
      this.linesCleared += clearLines.length;
      this.score += scores[clearLines.length - 1];
      this.updateLevel();
    }
  }

  public get currentPieceShape() {
    return Tetris.Pieces[this.currentPiece.piece - 1].shapes[
      this.currentPiece.direction
    ];
  }

  public isCollidingWithBoard() {
    for (let i = 0; i < this.currentPieceShape.length; i++) {
      for (let j = 0; j < this.currentPieceShape[i].length; j++) {
        if (this.currentPieceShape[i][j] === 1) {
          if (
            this.board[this.currentPiece.y + i][this.currentPiece.x + j] !== 0
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  public getPieceBounds(piece: TetrisPieceShape) {
    return { width: piece[0].length, height: piece.length };
  }

  public drop() {
    this.currentPiece.y++;
    var bounds = this.getPieceBounds(this.currentPieceShape);
    if (
      this.currentPiece.y + bounds.height > Tetris.BoardSize.height ||
      this.isCollidingWithBoard()
    ) {
      this.currentPiece.y--;
      return false;
    }
    return true;
  }

  public move(deltaX: number) {
    this.currentPiece.x += deltaX;
    var bounds = this.getPieceBounds(this.currentPieceShape);
    if (
      this.currentPiece.x < 0 ||
      this.currentPiece.x + bounds.width > Tetris.BoardSize.width ||
      this.isCollidingWithBoard()
    ) {
      this.currentPiece.x -= deltaX;
      return false;
    }
    return true;
  }

  public rotate(deltaDirection: number) {
    var totalDirections =
      Tetris.Pieces[this.currentPiece.piece - 1].shapes.length;
    var oldDirection = this.currentPiece.direction;
    this.currentPiece.direction =
      (this.currentPiece.direction + deltaDirection) % totalDirections;
    var bounds = this.getPieceBounds(this.currentPieceShape);
    if (
      !this.move(
        Math.min(
          0,
          Tetris.BoardSize.width - (this.currentPiece.x + bounds.width)
        )
      )
    ) {
      this.currentPiece.direction = oldDirection;
      return false;
    }
    return true;
  }

  public restart(): void {
    this.board = this.getNewBoard();
    this.currentPiece = this.getNewPiece();
    this.heldPiece = -1;
    this.nextPiece = this.getRandomPieceType();
    this.hasBeenHeld = false;
    this.score = 0;
    this.linesCleared = 0;
    this.level = 1;
    this.gameState = TetrisState.Running;
  }

  public keyDown(event: KeyboardEvent) {
    if (this.gameState === TetrisState.Running) {
      switch (event.code) {
        case "ArrowUp":
          this.rotate(1);
          break;
        case "ArrowLeft":
          this.move(-1);
          break;
        case "ArrowRight":
          this.move(1);
          break;
        case "ArrowDown":
          this.timeSinceStep = 0;
          this.step();
          break;
        case "Space":
          this.timeSinceStep = 0;
          while (this.step());
          break;
        case "Tab":
          event.preventDefault();
          if (!this.hasBeenHeld) {
            this.hasBeenHeld = true;
            this.timeSinceStep = 0;
            var temp = this.heldPiece;
            this.heldPiece = this.currentPiece.piece;
            this.setNextPiece(temp);
          }
          break;
      }
    }
  }
}
