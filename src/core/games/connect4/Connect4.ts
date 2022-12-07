import { Scene } from "@/core/canvas/Scene";
import { Vector } from "@/core/utils/Vector";
import { CanvasGame } from "../CanvasGame";
import { GameCatagories, GameMetadata } from "../Game";
import { Connect4Scene } from "./Connect4Scene";

export enum Connect4State {
  Playing = 1,
  GameOver = 2,
}

export class Connect4 extends CanvasGame {
  public static Metadata: GameMetadata = {
    catagories: [GameCatagories.TwoPlayer, GameCatagories.Strategy],
    componentType: "CenteredCanvas",
    name: "Connect 4",
  };
  public static ConnectionChecks: number[][][] = [
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    [
      [0, 3],
      [1, 2],
      [2, 1],
      [3, 0],
    ],
  ];

  protected _scene: Connect4Scene = new Connect4Scene(this);

  public board: number[][];
  public lastColumn: number = 0;
  public player: 1 | 2;
  public state: Connect4State;

  constructor() {
    super();
    this.board = this.createBoard();
    this.player = 1;
    this.state = Connect4State.Playing;
  }

  private createBoard() {
    return Array(6)
      .fill(null)
      .map(() => Array(7).fill(0));
  }

  private drop(column: number) {
    if (!this.isAbleToDrop(column)) {
      return false;
    }
    for (let i = 0; i < this.board.length; i++) {
      if (i + 1 === this.board.length || this.board[i + 1][column] !== 0) {
        this.board[i][column] = this.player;
        return true;
      }
    }
  }

  public isAbleToDrop(column: number) {
    return (
      column >= 0 &&
      column < 7 &&
      this.board[0][column] === 0 &&
      this.state === Connect4State.Playing
    );
  }

  private turn() {
    if (this.state === Connect4State.Playing) {
      var column = this.getColumnFromPosition(this.canvas.mouse.pos);
      if (!this.isAbleToDrop(column)) {
        return;
      }
      this._scene.timeSinceMove = 0;
      this.lastColumn = column;
      console.log(this.board);
      if (this.drop(column)) {
        if (this.checkWin()) {
          this.state = Connect4State.GameOver;
        }
        if (this.player === 1) {
          this.player = 2;
        } else {
          this.player = 1;
        }
      }
    }
  }

  private checkWin() {
    for (let b = 1; b <= 2; b++) {
      for (let i = 0; i < this.board.length; i++) {
        for (let j = 0; j < this.board[i].length; j++) {
          for (let k = 0; k < Connect4.ConnectionChecks.length; k++) {
            var same = true;
            for (let l = 0; l < Connect4.ConnectionChecks[k].length; l++) {
              if (
                i + Connect4.ConnectionChecks[k][l][1] >= 6 ||
                j + Connect4.ConnectionChecks[k][l][0] >= 7
              ) {
                same = false;
                break;
              }
              if (
                this.board[i + Connect4.ConnectionChecks[k][l][1]][
                  j + Connect4.ConnectionChecks[k][l][0]
                ] !== b
              ) {
                same = false;
                break;
              }
            }
            if (same === true) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  public getColumnFromPosition(pos: Vector): number {
    return Math.floor(9 * (pos.x / this.canvas.width)) - 1;
  }

  public update() {}
  public restart(): void {
    this.board = this.createBoard();
    this.player = 1;
    this.state = Connect4State.Playing;
  }

  public mouseUp(): void {
    this.turn();
  }
}
