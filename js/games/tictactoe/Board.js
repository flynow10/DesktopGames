export default class Board {
  constructor() {
    this.newGame();
  }

  newGame() {
    this.squares = new Array(9).fill(Piece.None);
    this.turn = Piece.X;
    this.moveList = [];
    this.gameStatus = GameStatus.Playing;
  }

  copy() {
    var newCopy = new Board();
    newCopy.turn = this.turn;
    newCopy.moveList = structuredClone(this.moveList);
    newCopy.squares = structuredClone(this.squares);
    newCopy.gameStatus = this.gameStatus;
    return newCopy;
  }

  makeMove(moveIndex) {
    if (this.gameStatus === GameStatus.Playing) {
      if (this.squares[moveIndex] === Piece.None) {
        this.squares[moveIndex] = this.turn;
        this.turn = this.turn === Piece.X ? Piece.O : Piece.X;
        this.moveList.push(moveIndex);
        this.gameStatus = this.checkGameStatus();
      }
    }
  }

  unmakeMove() {
    var move = this.moveList.pop();
    this.squares[move] = Piece.None;
    this.turn = this.turn === Piece.X ? Piece.O : Piece.X;
    this.gameStatus = GameStatus.Playing;
  }

  checkGameStatus() {
    for (let row = 0; row < 9; row += 3) {
      if (this.checkRowFilled(row)) {
        var rowValue =
          this.squares[row] + this.squares[row + 1] + this.squares[row + 2];
        if (rowValue === 6 || rowValue === 3) {
          return rowValue === 6 ? GameStatus.OWins : GameStatus.XWins;
        }
      }
    }
    for (let column = 0; column < 3; column++) {
      if (this.checkColumnFilled(column)) {
        var columnValue =
          this.squares[column] +
          this.squares[column + 3] +
          this.squares[column + 6];
        if (columnValue === 6 || columnValue === 3) {
          return columnValue === 6 ? GameStatus.OWins : GameStatus.XWins;
        }
      }
    }
    if (
      this.squares[0] !== 0 &&
      this.squares[4] !== 0 &&
      this.squares[8] !== 0
    ) {
      let diagonalValue = this.squares[0] + this.squares[4] + this.squares[8];
      if (diagonalValue === 6 || diagonalValue === 3) {
        return diagonalValue === 6 ? GameStatus.OWins : GameStatus.XWins;
      }
    }
    if (
      this.squares[2] !== 0 &&
      this.squares[4] !== 0 &&
      this.squares[6] !== 0
    ) {
      let diagonalValue = this.squares[2] + this.squares[4] + this.squares[6];
      if (diagonalValue === 6 || diagonalValue === 3) {
        return diagonalValue === 6 ? GameStatus.OWins : GameStatus.XWins;
      }
    }
    if (this.squares.every((piece) => piece !== Piece.None)) {
      return GameStatus.CatWins;
    }
    return GameStatus.Playing;
  }

  checkRowFilled(row) {
    return (
      this.squares[row] !== 0 &&
      this.squares[row + 1] !== 0 &&
      this.squares[row + 2] !== 0
    );
  }

  checkColumnFilled(column) {
    return (
      this.squares[column] !== 0 &&
      this.squares[column + 3] !== 0 &&
      this.squares[column + 6] !== 0
    );
  }
}

export const Piece = {
  None: 0,
  X: 1,
  O: 2,
};

export const GameStatus = {
  Playing: 1,
  XWins: 2,
  OWins: 3,
  CatWins: 4,
};
