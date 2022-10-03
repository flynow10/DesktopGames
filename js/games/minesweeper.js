import { Color, Style } from "../canvas.js";
import { Game } from "../game.js";
import { GameLoop } from "../game_loop.js";

const FLAG = 9;
const UNKNOWN = -1;

export class Minesweeper extends Game {
  constructor(canvas) {
    super(canvas);
    this.boardSize = 9;
    this.mineCount = 10;
    this.newBoard();
    this.mouse = {
      pos: { x: null, y: null },
      click: false,
    };
    this.registerListeners();
    this.afterInit();
  }

  getMouseSquare() {
    if (this.mouse.pos.x === null || this.mouse.pos.y === null) {
      return {
        x: null,
        y: null,
      };
    }
    return {
      x: Math.floor(this.mouse.pos.x / this.squareSize),
      y: Math.floor(this.mouse.pos.y / this.squareSize),
    };
  }

  registerListeners() {
    GameLoop.mouseObjects.push(
      this.canvas.getCanvasElement(),
      (e) => {
        e.preventDefault();
        if (!this.paused) {
          this.mouse.click = true;
        }
      },
      (e) => {
        this.mouse.pos = this.getMousePos(e);
      },
      (e) => {
        if (this.mouse.click) {
          if (!this.paused) {
            e.preventDefault();
            var squareClicked = this.getMouseSquare();
            if (e.button === 0) {
              this.clickSquare(squareClicked.x, squareClicked.y);
            } else if (e.button === 2) {
              this.flagSquare(squareClicked.x, squareClicked.y);
            }
          }
          this.mouse.click = false;
        }
      },
      () => {},
      () => {
        this.mouse.click = null;
        this.mouse.pos = { x: null, y: null };
      }
    );
    this.canvas.getCanvasElement().addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }
  newBoard() {
    this.clicks = 0;
    this.alive = true;
    this.mines = new Array(this.boardSize * this.boardSize).fill(false);
    this.squares = new Array(this.boardSize * this.boardSize).fill(UNKNOWN);
  }

  randomizeMines() {
    this.mines = new Array(this.boardSize * this.boardSize).fill(false);
    var locations = [];
    while (locations.length < this.mineCount) {
      var newLocation = Math.floor(
        Math.random() * this.boardSize * this.boardSize
      );
      if (!locations.includes(newLocation)) {
        locations.push(newLocation);
      }
    }
    for (const location of locations) {
      this.mines[location] = true;
    }
  }

  flagSquare(x, y) {
    if (this.alive) {
      var squareIndex = x + y * this.boardSize;
      if (this.squares[squareIndex] === UNKNOWN) {
        this.squares[squareIndex] = FLAG;
      } else if (this.squares[squareIndex] === FLAG) {
        this.squares[squareIndex] = UNKNOWN;
      }
    }
  }

  clickSquare(x, y) {
    var squareIndex = x + y * this.boardSize;
    if (this.clicks === 0) {
      this.randomizeMines();
      while (
        this.mines[squareIndex] ||
        this.getSurroundingMineCount(squareIndex) > 0
      ) {
        this.randomizeMines();
      }
    }
    if (this.squares[squareIndex] === UNKNOWN) {
      this.openSquare(squareIndex);
    }
    if (
      this.squares.reduce((prev, curr) => {
        return prev + (curr === UNKNOWN || curr === FLAG ? 1 : 0);
      }, 0) === this.mineCount
    ) {
      this.win();
    }
    this.clicks++;
  }

  openSquare(index) {
    if (this.alive) {
      if (this.mines[index]) {
        this.die();
        return;
      }
      var surroundingMines = this.getSurroundingMineCount(index);
      this.squares[index] = surroundingMines;
      if (surroundingMines === 0) {
        for (const neighbor of this.getSurroundingSquares(index)) {
          if (this.squares[neighbor] === UNKNOWN) {
            this.openSquare(neighbor);
          }
        }
      }
    }
  }

  getSurroundingMineCount(index) {
    var neighbors = this.getSurroundingSquares(index);
    var mineCount = 0;
    for (const neighbor of neighbors) {
      if (this.mines[neighbor]) {
        mineCount++;
      }
    }
    return mineCount;
  }

  getCoord(index) {
    return {
      x: Math.floor(index % this.boardSize),
      y: Math.floor(index / this.boardSize),
    };
  }

  getSurroundingSquares(index) {
    var neighbors = [];
    var originCoord = this.getCoord(index);
    for (const direction of this.indexOffsets) {
      var neighbor = index + direction;
      if (neighbor < 0 || neighbor >= this.boardSize * this.boardSize) {
        continue;
      }
      var neighborCoord = this.getCoord(neighbor);
      if (
        Math.abs(neighborCoord.x - originCoord.x) > 1 ||
        Math.abs(neighborCoord.y - originCoord.y) > 1
      ) {
        continue;
      }
      neighbors.push(neighbor);
    }
    return neighbors;
  }

  die() {
    this.alive = false;
  }

  win() {
    setTimeout(() => {
      alert('You Win!\nPress "r" to restart');
    }, 500);
  }

  draw() {
    this.drawGrid();
    this.drawNumbers();
    this.drawFlags();
    if (!this.alive) {
      this.drawMines();
    }
  }

  drawGrid() {
    for (let column = 0; column < this.squareSize; column++) {
      for (let row = 0; row < this.squareSize; row++) {
        var mouseSquare = this.getMouseSquare();
        var squareIndex = column + row * this.boardSize;
        var onSquare = mouseSquare.x === column && mouseSquare.y === row;
        var openSquare =
          this.squares[squareIndex] >= 0 && this.squares[squareIndex] !== FLAG;
        var customColor = onSquare || openSquare;
        var color;
        if (customColor) {
          color = Color.Custom;
        } else {
          color =
            (row + column) % 2 === 0
              ? Color.PrimaryColor
              : Color.SecondaryColor;
        }
        if (onSquare && !openSquare) {
          this.canvas.setColor("#aaa");
        } else {
          this.canvas.setColor("#aa7");
        }
        this.canvas.drawRect(
          column * this.squareSize,
          row * this.squareSize,
          this.squareSize,
          this.squareSize,
          color,
          Style.Fill
        );
      }
    }
  }

  drawNumbers() {
    for (let column = 0; column < this.squareSize; column++) {
      for (let row = 0; row < this.squareSize; row++) {
        var squareIndex = column + row * this.boardSize;
        if (
          this.squares[squareIndex] > 0 &&
          this.squares[squareIndex] !== FLAG
        ) {
          this.canvas.setColor("#fff");
          this.canvas.getCanvas().font = '25px "Fira Sans", sans-serif';
          this.canvas.getCanvas().textAlign = "center";
          this.canvas.getCanvas().textBaseline = "middle";
          this.canvas
            .getCanvas()
            .fillText(
              this.squares[squareIndex],
              (column + 0.5) * this.squareSize,
              (row + 0.5) * this.squareSize
            );
        }
      }
    }
  }

  drawFlags() {
    for (let column = 0; column < this.squareSize; column++) {
      for (let row = 0; row < this.squareSize; row++) {
        var squareIndex = column + row * this.boardSize;
        if (this.alive || !this.mines[squareIndex]) {
          if (this.squares[squareIndex] === FLAG) {
            this.canvas.setColor("#e55");
            var ctx = this.canvas.getCanvas();
            ctx.beginPath();
            ctx.moveTo(
              (column + 0.5) * this.squareSize,
              (row + 0.1) * this.squareSize
            );
            ctx.lineTo(
              (column + 0.2) * this.squareSize,
              (row + 0.3) * this.squareSize
            );
            ctx.lineTo(
              (column + 0.5) * this.squareSize,
              (row + 0.5) * this.squareSize
            );
            ctx.fill();
            this.canvas.setColor("#000");
            this.canvas.drawRect(
              (column + 0.1) * this.squareSize,
              (row + 0.85) * this.squareSize,
              this.squareSize * 0.8,
              this.squareSize * 0.1,
              Color.Custom,
              Style.Fill
            );
            this.canvas.drawRect(
              (column + 0.45) * this.squareSize,
              (row + 0.1) * this.squareSize,
              this.squareSize * 0.1,
              this.squareSize * 0.8,
              Color.Custom,
              Style.Fill
            );
          }
        }
      }
    }
  }

  drawMines() {
    for (let column = 0; column < this.squareSize; column++) {
      for (let row = 0; row < this.squareSize; row++) {
        if (this.mines[column + row * this.boardSize]) {
          this.canvas.setColor("#000");
          this.canvas.drawCircle(
            (column + 0.5) * this.squareSize,
            (row + 0.5) * this.squareSize,
            this.squareSize / 2.1,
            Color.Custom,
            Style.Fill
          );
        }
      }
    }
  }
  keyPressEvent(e) {
    if (!e.repeat) {
      if (e.code === "KeyR") {
        this.newBoard();
      }
      if (e.code === "Digit1") {
        this.boardSize = 9;
        this.mineCount = 10;
        this.newBoard();
      }
      if (e.code === "Digit2") {
        this.boardSize = 16;
        this.mineCount = 40;
        this.newBoard();
      }
      if (e.code === "Digit3") {
        this.boardSize = 21;
        this.mineCount = 99;
        this.newBoard();
      }
    }
  }

  get squareSize() {
    return this.canvas.size / this.boardSize;
  }

  get indexOffsets() {
    return [
      1,
      this.boardSize + 1,
      this.boardSize,
      this.boardSize - 1,
      -1,
      -this.boardSize - 1,
      -this.boardSize,
      -this.boardSize + 1,
    ];
  }

  cleanup() {
    super.cleanup();
    GameLoop.mouseObjects.remove(this.canvas.getCanvasElement());
  }
}
