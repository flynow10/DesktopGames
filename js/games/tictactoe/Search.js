import Board, { Piece, GameStatus } from "./Board.js";

const Search = {
  bestMoves: [],
  /**
   * @param {Board} board
   */
  nextMove(board) {
    this.bestMoves = [];
    this.search(board, 0);
    return this.bestMoves[
      Math.floor(Math.random() * (this.bestMoves.length - 1))
    ];
  },

  getScore(status) {
    var score;
    if (status === GameStatus.XWins) {
      score = 1;
    }
    if (status === GameStatus.OWins) {
      score = -1;
    }
    if (status === GameStatus.CatWins) {
      score = 0;
    }
    return score;
  },

  /**
   * @param {Board} board
   * @param {Number} plyFromRoot
   */
  search(board, plyFromRoot) {
    if (board.gameStatus !== GameStatus.Playing) {
      return (
        this.getScore(board.gameStatus) * (board.turn === Piece.X ? 1 : -1)
      );
    }
    var moves = this.getMoves(board);
    var bestEval = -9999999;
    for (const move of moves) {
      board.makeMove(move);
      var evaluation = -this.search(board, plyFromRoot + 1);
      board.unmakeMove();
      if (evaluation > bestEval) {
        if (plyFromRoot === 0) {
          this.bestMoves = [];
        }
      }
      if (evaluation >= bestEval) {
        bestEval = evaluation;
        if (plyFromRoot === 0) {
          this.bestMoves.push(move);
        }
      }
    }
    return bestEval;
  },

  getMoves(board) {
    return board.squares.reduce((array, value, index) => {
      if (value === Piece.None) array.push(index);
      return array;
    }, []);
  },
};

export default Search;
