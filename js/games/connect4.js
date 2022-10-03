import { Color, Style } from "../canvas.js";
import { Game } from "../game.js";
import { GameLoop } from "../game_loop.js";
const connectionChecks = [
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
export class Connect4 extends Game {
  constructor(canvas) {
    super(canvas);
    this.board = this.createBoard();
    this.player = 1;
    this.gameover = false;
    this.mouse = {
      pos: {
        x: 0,
        y: 0,
      },
      lastPos: {
        x: 0,
        y: 0,
      },
      click: false,
    };
    this.options.bindRestartKey = true;
    GameLoop.mouseObjects.push(
      this.canvas.getCanvasElement(),
      (e) => {
        this.mouse.click = true;
      },
      (e) => {
        var newPos = this.getMousePos(e);
        if (newPos.x !== this.mouse.pos.x || newPos.y !== this.mouse.pos.y) {
          this.mouse.lastPos = Object.assign({}, this.mouse.pos);
          this.mouse.pos = newPos;
        }
      },
      (e) => {
        if (this.mouse.click) {
          this.turn();
          this.mouse.click = false;
        }
      }
    );
    this.afterInit();
  }
  restart() {
    this.board = this.createBoard();
    this.player = 1;
    this.gameover = false;
  }

  createBoard() {
    return Array(6)
      .fill(null)
      .map(() => Array(7).fill(0));
  }

  drop(column) {
    if (column < 0 || column >= 7 || this.board[0][column] !== 0) {
      return false;
    }
    for (let i = 0; i < this.board.length; i++) {
      if (i + 1 === this.board.length || this.board[i + 1][column] !== 0) {
        this.board[i][column] = this.player;
        return true;
      }
    }
  }

  turn() {
    if (!this.gameover) {
      var column = this.getMouseColumn();
      if (this.drop(column)) {
        if (this.checkWin()) {
          this.gameover = true;
          setTimeout(() => {
            this.gameOver();
          }, 300);
        }
        this.player = 1 - (this.player - 1) + 1;
      }
    }
  }

  gameOver() {
    this.gameover = true;
    alert(
      "The " +
        (this.player === 2 ? "red" : "blue") +
        ' player wins!\nPress "r" to restart.'
    );
  }

  checkWin() {
    for (let b = 1; b <= 2; b++) {
      for (let i = 0; i < this.board.length; i++) {
        for (let j = 0; j < this.board[i].length; j++) {
          for (let k = 0; k < connectionChecks.length; k++) {
            var same = true;
            for (let l = 0; l < connectionChecks[k].length; l++) {
              if (
                i + connectionChecks[k][l][1] >= 6 ||
                j + connectionChecks[k][l][0] >= 7
              ) {
                same = false;
                break;
              }
              if (
                this.board[i + connectionChecks[k][l][1]][
                  j + connectionChecks[k][l][0]
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

  getMouseColumn() {
    return Math.floor(this.mouse.pos.x / (this.canvas.size / 7));
  }

  draw() {
    this.drawBoard();
    this.drawHighlight();
  }

  drawHighlight() {
    var squareSize = this.canvas.size / 7;
    var column = this.getMouseColumn();
    this.canvas.ctx.lineWidth = 3;
    this.canvas.setColor("#990");
    this.canvas.drawRect(
      squareSize * column,
      squareSize / 2,
      squareSize,
      squareSize * 6,
      Color.Custom,
      Style.Stroke
    );
  }

  drawBoard() {
    var squareSize = this.canvas.size / 7;
    this.canvas.ctx.lineWidth = 3;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const piece = this.board[i][j];
        if (piece === 0) {
          continue;
        }
        if (piece === 1) {
          this.canvas.setColor("#d44");
        }
        if (piece === 2) {
          this.canvas.setColor("#49d");
        }
        this.canvas.drawCircle(
          squareSize * (j + 0.5),
          squareSize / 2 + squareSize * (i + 0.5),
          squareSize * 0.4,
          Color.Custom,
          Style.Fill
        );
      }
    }
    this.canvas.ctx.lineCap = "round";
    this.canvas.ctx.lineWidth = 10;
    this.canvas.setColor("#111");
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(squareSize / 20, squareSize * 6.5);
    this.canvas.ctx.lineTo(squareSize * 6.95, squareSize * 6.5);
    this.canvas.ctx.stroke();
  }
}
