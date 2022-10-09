import { Color, Style } from "../canvas.js";
import { Game } from "../game.js";
const Pieces = [
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
export class Tetris extends Game {
  boardSize = {
    width: 10,
    height: 20,
  };
  board = this.getNewBoard();
  currentPiece = this.pieceGenerator();
  heldPiece = -1;
  nextPiece = this.pieceGenerator();
  hasBeenHeld = false;
  constructor(canvas) {
    super(canvas);
    this.options.whiteBackground = false;
    this.options.updateStep = 1000;
    this.afterInit();
  }

  get squareSize() {
    return (
      this.canvas.size / Math.max(this.boardSize.width, this.boardSize.height)
    );
  }

  get currentPieceShape() {
    return Pieces[this.currentPiece.piece].shapes[this.currentPiece.direction];
  }

  getNewBoard() {
    return new Array(this.boardSize.height)
      .fill(0)
      .map(() => new Array(this.boardSize.width).fill(0));
  }

  /**
   * @param {number[][]} piece
   * @returns
   */
  getPieceBounds(piece) {
    return { width: piece[0].length, height: piece.length };
  }

  draw() {
    this.drawUI();
    this.drawBoard();
  }

  drawUI() {
    this.canvas.setColor(Color.SecondaryColor);
    this.canvas.getCanvas().font = this.squareSize + "px sans-serif";
    this.canvas.getCanvas().fillText("Next", this.squareSize, this.squareSize);
    this.drawPieceDisplay(
      this.squareSize,
      this.squareSize,
      this.nextPiece.piece
    );
    this.canvas
      .getCanvas()
      .fillText(
        "Hold",
        this.canvas.size - this.squareSize * 4,
        this.squareSize
      );
    this.drawPieceDisplay(
      this.canvas.size - this.squareSize * 4,
      this.squareSize,
      this.heldPiece
    );
  }

  drawPieceDisplay(x, y, piece) {
    var size = this.squareSize * 3;
    this.canvas.getCanvas().save();
    this.canvas.getCanvas().lineWidth = 5;
    this.canvas.drawRect(x, y, size, size, Color.PrimaryColor, Style.Fill);
    this.canvas.drawRect(x, y, size, size, Color.SecondaryColor, Style.Stroke);
    this.canvas.getCanvas().restore();
    if (piece !== -1) {
      var pieceShape = Pieces[piece].shapes[/*Get First direction*/ 0];
      var bounds = this.getPieceBounds(pieceShape);
      for (let i = 0; i < pieceShape.length; i++) {
        for (let j = 0; j < pieceShape[i].length; j++) {
          if (pieceShape[i][j] === 1) {
            this.canvas.drawRect(
              x + size / 2 - ((size / 4) * bounds.width) / 2 + j * (size / 4),
              y + size / 2 - ((size / 4) * bounds.height) / 2 + i * (size / 4),
              size / 4,
              size / 4,
              Color.SecondaryColor,
              Style.fill
            );
          }
        }
      }
    }
  }

  drawBoard() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        var widthOffset =
          (this.canvas.size - this.squareSize * this.boardSize.width) / 2;
        var heightOffset =
          (this.canvas.size - this.squareSize * this.boardSize.height) / 2;
        var bounds = this.getPieceBounds(this.currentPieceShape);
        var boundedX =
          j >= this.currentPiece.x && j < this.currentPiece.x + bounds.width;
        var boundedY =
          i >= this.currentPiece.y && i < this.currentPiece.y + bounds.height;
        var isInBounds = boundedX && boundedY;
        var isCurrentBlock =
          isInBounds &&
          this.currentPieceShape[i - this.currentPiece.y][
            j - this.currentPiece.x
          ] === 1;
        var color = !isCurrentBlock ? Color.SecondaryColor : Color.PrimaryColor;
        var style =
          this.board[i][j] === 0 && !isCurrentBlock ? Style.Stroke : Style.Both;
        this.canvas.drawRect(
          j * this.squareSize + widthOffset,
          i * this.squareSize + heightOffset,
          this.squareSize,
          this.squareSize,
          color,
          style
        );
      }
    }
  }

  isCollidingWithBoard() {
    for (let i = 0; i < this.currentPieceShape.length; i++) {
      for (let j = 0; j < this.currentPieceShape[i].length; j++) {
        if (this.currentPieceShape[i][j] === 1) {
          if (
            this.board[this.currentPiece.y + i][this.currentPiece.x + j] === 1
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  drop() {
    this.currentPiece.y++;
    var bounds = this.getPieceBounds(this.currentPieceShape);
    if (
      this.currentPiece.y + bounds.height > this.boardSize.height ||
      this.isCollidingWithBoard()
    ) {
      this.currentPiece.y--;
      return false;
    }
    return true;
  }

  move(deltaX) {
    this.currentPiece.x += deltaX;
    var bounds = this.getPieceBounds(this.currentPieceShape);
    if (
      this.currentPiece.x < 0 ||
      this.currentPiece.x + bounds.width > this.boardSize.width ||
      this.isCollidingWithBoard()
    ) {
      this.currentPiece.x -= deltaX;
      return false;
    }
    return true;
  }

  rotate(deltaDirection) {
    var totalDirections = Pieces[this.currentPiece.piece].shapes.length;
    var oldDirection = this.currentPiece.direction;
    this.currentPiece.direction =
      (this.currentPiece.direction + deltaDirection) % totalDirections;
    var bounds = this.getPieceBounds(this.currentPieceShape);
    if (
      !this.move(
        Math.min(0, this.boardSize.width - (this.currentPiece.x + bounds.width))
      )
    ) {
      this.currentPiece.direction = oldDirection;
      return false;
    }
    return true;
  }

  update() {
    if (!this.drop()) {
      for (let i = 0; i < this.currentPieceShape.length; i++) {
        for (let j = 0; j < this.currentPieceShape[i].length; j++) {
          if (this.currentPieceShape[i][j] === 1) {
            this.board[this.currentPiece.y + i][this.currentPiece.x + j] = 1;
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

  pieceGenerator() {
    return {
      x: 3,
      y: 0,
      piece: Math.floor(Math.random() * Pieces.length),
      direction: 0,
    };
  }

  setNextPiece(piece = -1) {
    if (piece === -1) {
      this.currentPiece = Object.assign({}, this.nextPiece);
      this.nextPiece = this.pieceGenerator();
    } else {
      this.currentPiece = Object.assign(this.pieceGenerator(), { piece });
    }
  }

  checkLineClear() {
    var clearLines = [];
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i].every((value) => value === 1)) {
        clearLines.push(i);
      }
    }
    for (let i = 0; i < clearLines.length; i++) {
      this.board[clearLines[i]] = new Array(this.boardSize.width).fill(0);
      for (let j = clearLines[i]; j > 0; j--) {
        [this.board[j], this.board[j - 1]] = [this.board[j - 1], this.board[j]];
      }
    }
  }

  /**
   *
   * @param {KeyboardEvent} e
   */
  keyDownEvent(e) {
    switch (e.code) {
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
        this.lastUpdate = this.updateTime;
        this.update();
        break;
      case "Space":
        this.lastUpdate = this.updateTime;
        while (this.update());
        break;
      case "Tab":
        e.preventDefault();
        if (!this.hasBeenHeld) {
          this.hasBeenHeld = true;
          this.lastUpdate = this.updateTime;
          var temp = this.heldPiece;
          this.heldPiece = this.currentPiece.piece;
          this.setNextPiece(temp);
        }
        break;
    }
  }
}
