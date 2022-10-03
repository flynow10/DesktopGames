import { Color, Style } from "../canvas.js";
import { Game } from "../game.js";

export class Game2048 extends Game {
  constructor(canvas) {
    super(canvas);
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.createNewRandomTile();
    this.createNewRandomTile();
    this.afterInit();
  }

  createNewRandomTile() {
    var openIndices = [];
    this.board.forEach((value, index) => {
      if (value === 0) {
        openIndices.push(index);
      }
    });
    if (openIndices.length === 0) {
      return;
    }
    var index = openIndices[Math.floor(Math.random() * openIndices.length)];
    this.board[index] = Math.floor(Math.random() * 10) === 4 ? 4 : 2;
  }

  draw() {
    var squareColors = {
      0: "#aaa",
      2: "#eee4da",
      4: "#eee1c9",
      8: "#f3b27a",
      16: "#f69664",
      32: "#f77c5f",
      64: "#f75f3b",
      128: "#edd073",
      256: "#edcc62",
      512: "#edc950",
      1024: "#edc53f",
      2048: "#edc22e",
    };
    var squareSize = this.canvas.size / 4;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        var numberOnSquare = this.board[i * 4 + j];
        if (numberOnSquare in squareColors) {
          this.canvas.setColor(squareColors[numberOnSquare]);
        } else {
          this.canvas.setColor("#000");
        }
        this.canvas.drawRect(
          j * squareSize,
          i * squareSize,
          squareSize,
          squareSize,
          Color.Custom,
          Style.Fill
        );
        if (numberOnSquare !== 0) {
          this.canvas.setColor("#fff");
          this.canvas.getCanvas().font = '25px "Fira Sans", sans-serif';
          this.canvas.getCanvas().textAlign = "center";
          this.canvas.getCanvas().textBaseline = "middle";
          this.canvas
            .getCanvas()
            .fillText(
              numberOnSquare,
              (j + 0.5) * squareSize,
              (i + 0.5) * squareSize
            );
        }
      }
    }
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
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.createNewRandomTile();
        this.createNewRandomTile();
        return;
      }
      if (e.code in keymap) {
        this.move(keymap[e.code]);
      }
    }
  }

  move(direction) {
    var didSomething = false;
    didSomething = this.slide(direction) || didSomething;
    didSomething = this.combine(direction) || didSomething;
    didSomething = this.slide(direction) || didSomething;
    if (didSomething) {
      this.createNewRandomTile();
      if (this.checkLoss()) {
        setTimeout(() => {
          alert('You Lost :(\nPress "r" to restart.');
        }, 30);
      }
    }
  }

  checkLoss() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        var index = i * 4 + j;
        if (this.board[index] === 0) {
          return false;
        }
        var tile = this.board[index];
        if (tile === this.board[index + 1] || tile === this.board[index + 4]) {
          return false;
        }
      }
    }
    for (let j = 3; j < 16; j += 4) {
      if (this.board[j] === 0) {
        return false;
      }
      if (this.board[j] === this.board[j + 4]) {
        return false;
      }
    }
    return true;
  }

  combine(direction) {
    var combined = false;
    var reverse = ["down", "right"].includes(direction);
    for (
      let tile = reverse ? this.board.length - 1 : 0;
      (reverse && tile >= 0) || (!reverse && tile < this.board.length);
      tile += reverse ? -1 : 1
    ) {
      if (this.combineTile(tile, direction)) {
        combined = true;
      }
    }
    return combined;
  }

  combineTile(tile, direction) {
    if (this.board[tile] === 0) {
      return false;
    }
    var dirOffsets = {
      up: 4,
      down: -4,
      left: 1,
      right: -1,
    };
    var combineTileIndex = tile + dirOffsets[direction];
    if (
      (direction === "left" && combineTileIndex % 4 === 0) ||
      (direction === "right" && combineTileIndex % 4 === 3)
    ) {
      return false;
    }
    if (this.board[tile] === this.board[combineTileIndex]) {
      this.board[tile] *= 2;
      this.board[combineTileIndex] = 0;
      return true;
    }
    return false;
  }

  slide(direction) {
    var slid = false;
    var reverse = ["down", "right"].includes(direction);
    for (
      let tile = reverse ? this.board.length - 1 : 0;
      (reverse && tile >= 0) || (!reverse && tile < this.board.length);
      tile += reverse ? -1 : 1
    ) {
      if (this.slideTile(tile, direction)) {
        slid = true;
      }
    }
    return slid;
  }
  slideTile(tile, direction) {
    if (this.board[tile] === 0) {
      return false;
    }
    var distance = 0;
    var dirOffsets = {
      up: -4,
      down: 4,
      left: -1,
      right: 1,
    };
    for (var i = 1; i < 4; i++) {
      if (this.board[tile + i * dirOffsets[direction]] === 0) {
        if (
          (direction === "left" &&
            (tile + i * dirOffsets[direction]) % 4 === 3) ||
          (direction === "right" &&
            (tile + i * dirOffsets[direction]) % 4 === 0)
        ) {
          break;
        }
        distance++;
      } else {
        break;
      }
    }
    if (distance === 0) {
      return false;
    }
    [this.board[tile], this.board[tile + distance * dirOffsets[direction]]] = [
      0,
      this.board[tile],
    ];
    return true;
  }
}
