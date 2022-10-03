import { Color, Style } from "../../canvas.js";
import { Game } from "../../game.js";
import { GameLoop } from "../../game_loop.js";
import Board, { GameStatus, Piece } from "./Board.js";
import Search from "./Search.js";

export class TicTacToe extends Game {
  constructor(canvas) {
    super(canvas);
    this.board = new Board();
    this.mouse = {
      pos: {
        x: 0,
        y: 0,
      },
      click: false,
    };
    this.players = ["human", "human"];
    this.options.bindRestartKey = true;
    GameLoop.mouseObjects.push(
      this.canvas.getCanvasElement(),
      (e) => {
        this.mouse.click = true;
      },
      (e) => {
        var newPos = this.getMousePos(e);
        if (newPos.x !== this.mouse.pos.x || newPos.y !== this.mouse.pos.y) {
          this.mouse.pos = newPos;
        }
      },
      (e) => {
        if (this.mouse.click) {
          this.makeHumanMove();
          this.mouse.click = false;
        }
      }
    );
    this.restart();
    this.afterInit();
  }

  keyPressEvent(e) {
    if (e.code === "Digit1") {
      this.players = ["human", "human"];
      this.restart();
    }
    if (e.code === "Digit2") {
      this.players = ["human", "computer"];
      this.restart();
    }
    if (e.code === "Digit3") {
      this.players = ["computer", "computer"];
      this.restart();
    }
    if (e.code === "Digit4") {
      this.players = ["computer", "human"];
      this.restart();
    }
  }

  restart() {
    this.board.newGame();
    if (this.players[0] === "computer") {
      this.makeComputerMove();
    }
  }

  makeComputerMove() {
    this.makeMove(Search.nextMove(this.board.copy()));
  }

  makeHumanMove() {
    var x = Math.min(
      Math.max(Math.floor(this.mouse.pos.x / this.squareSize), 0),
      2
    );
    var y = Math.min(
      Math.max(Math.floor(this.mouse.pos.y / this.squareSize), 0),
      2
    );
    if (this.board.gameStatus === GameStatus.Playing) {
      if (this.players[this.board.turn - 1] === "human") {
        this.makeMove(y * 3 + x);
      }
    }
  }

  makeMove(move) {
    this.board.makeMove(move);
    if (this.board.gameStatus !== GameStatus.Playing) {
      if (this.players[0] === "human" || this.players[1] === "human") {
        setTimeout(() => {
          alert(this.gameOverMessage(this.board.gameStatus));
        }, 100);
      } else {
        console.log(this.gameOverMessage(this.board.gameStatus));
        setTimeout(() => {
          this.restart();
        }, 100);
      }
      return;
    }
    if (this.players[this.board.turn - 1] === "computer") {
      setTimeout(() => {
        this.makeComputerMove();
      }, 100);
    }
  }

  gameOverMessage(gameStatus) {
    switch (gameStatus) {
      case GameStatus.XWins:
        return "X wins!";
      case GameStatus.OWins:
        return "O wins!";
      case GameStatus.CatWins:
        return "Cat's game!";
    }
  }

  get squareSize() {
    return this.canvas.size / 3;
  }

  draw() {
    this.canvas.setColor("#000");
    this.drawBoard();
    this.drawPieces();
  }

  drawBoard() {
    this.canvas.ctx.lineWidth = 3;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.squareSize, 0);
    this.canvas.ctx.lineTo(this.squareSize, this.canvas.size);
    this.canvas.ctx.stroke();
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.squareSize * 2, 0);
    this.canvas.ctx.lineTo(this.squareSize * 2, this.canvas.size);
    this.canvas.ctx.stroke();

    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(0, this.squareSize);
    this.canvas.ctx.lineTo(this.canvas.size, this.squareSize);
    this.canvas.ctx.stroke();
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(0, this.squareSize * 2);
    this.canvas.ctx.lineTo(this.canvas.size, this.squareSize * 2);
    this.canvas.ctx.stroke();
  }
  drawPieces() {
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        let square = this.board.squares[row * 3 + column];
        if (square === 1) {
          this.drawX(column * this.squareSize, row * this.squareSize);
        }
        if (square === 2) {
          this.drawO(column * this.squareSize, row * this.squareSize);
        }
      }
    }
  }

  drawO(x, y) {
    this.canvas.ctx.lineWidth = 10;
    this.canvas.drawCircle(
      x + (this.squareSize - 20) / 2 + 10,
      y + (this.squareSize - 20) / 2 + 10,
      (this.squareSize - 20) / 2,
      Color.Custom,
      Style.Stroke
    );
  }

  drawX(x, y) {
    this.canvas.ctx.lineWidth = 10;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(x + 10, y + 10);
    this.canvas.ctx.lineTo(x + this.squareSize - 10, y + this.squareSize - 10);
    this.canvas.ctx.stroke();
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(x + this.squareSize - 10, y + 10);
    this.canvas.ctx.lineTo(x + 10, y + this.squareSize - 10);
    this.canvas.ctx.stroke();
  }
}
