import t from "@/i18n";
import { CanvasGame } from "../../core/game/CanvasGame";
import { TwentyFourtyEightScene } from "./2048Scene";

export class TwentyFourtyEight extends CanvasGame {
  public board: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  public lastBoard: number[] = [];
  public movedTiles: { start: number; end: number }[] = [];
  public mergedTiles: number[] = [];
  public addedTiles: number[] = [];
  public timeSinceMove: number = 0;

  protected _scene: TwentyFourtyEightScene = new TwentyFourtyEightScene(this);

  constructor() {
    super();
    this.addedTiles.push(
      this.createNewRandomTile() as number,
      this.createNewRandomTile() as number
    );
    this.name = t("2048-title");
  }

  createNewRandomTile() {
    var emptyTiles = this.board.reduce((acc, val, index) => {
      if (val === 0) {
        acc.push(index);
      }
      return acc;
    }, [] as number[]);
    if (emptyTiles.length > 0) {
      var randomTile =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      this.board[randomTile] = Math.random() < 0.9 ? 2 : 4;
      return randomTile;
    }
  }

  public update(dt: number) {
    this.timeSinceMove += dt;
  }

  public keyDown(event: KeyboardEvent): void {
    var keymap: { [key: string]: string } = {
      ArrowRight: "right",
      ArrowLeft: "left",
      ArrowUp: "up",
      ArrowDown: "down",
      KeyW: "up",
      KeyS: "down",
      KeyA: "left",
      KeyD: "right",
    };

    if (!event.repeat) {
      if (event.code in keymap) {
        this.move(keymap[event.code]);
      }
    }
  }

  move(direction: string) {
    this.lastBoard = this.board.slice();
    this.movedTiles = [];
    this.addedTiles = [];
    this.mergedTiles = [];
    this.timeSinceMove = 0;
    var didSomething = false;
    didSomething = this.slide(direction) || didSomething;
    didSomething = this.combine(direction) || didSomething;
    didSomething = this.slide(direction) || didSomething;
    if (didSomething) {
      this.addedTiles.push(this.createNewRandomTile() as number);
      if (this.checkLoss()) {
        setTimeout(() => {
          alert('You Lost :(\nPress "r" to restart.');
        }, 30);
      }
    }
  }

  public checkLoss(): boolean {
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

  public combine(direction: string): boolean {
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

  public combineTile(tile: number, direction: string): boolean {
    if (this.board[tile] === 0) {
      return false;
    }
    var dirOffsets: { [key: string]: number } = {
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
      var movedTile = this.movedTiles.findIndex(
        (t) => t.end === combineTileIndex
      );
      this.mergedTiles.push(tile);
      if (movedTile !== -1) {
        this.movedTiles[movedTile].end = tile;
      } else {
        this.movedTiles.push({ start: combineTileIndex, end: tile });
      }

      return true;
    }
    return false;
  }

  public slide(direction: string): boolean {
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

  public slideTile(tile: number, direction: string): boolean {
    if (this.board[tile] === 0) {
      return false;
    }
    var distance = 0;
    var dirOffsets: { [key: string]: number } = {
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
    var movedTile = this.movedTiles.findIndex((t) => t.end === tile);
    if (movedTile !== -1) {
      this.movedTiles[movedTile].end += distance * dirOffsets[direction];
    } else {
      this.movedTiles.push({
        start: tile,
        end: tile + distance * dirOffsets[direction],
      });
    }
    var mergedTile = this.mergedTiles.findIndex((t) => t === tile);
    if (mergedTile !== -1) {
      this.mergedTiles[mergedTile] += distance * dirOffsets[direction];
    }
    [this.board[tile], this.board[tile + distance * dirOffsets[direction]]] = [
      0,
      this.board[tile],
    ];
    return true;
  }

  public restart(): void {
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.lastBoard = [];
    this.movedTiles = [];
    this.addedTiles = [];
    this.addedTiles.push(
      this.createNewRandomTile() as number,
      this.createNewRandomTile() as number
    );
  }
}
