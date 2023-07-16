import { Scene } from "@/core/canvas/Scene";
import { CanvasGame } from "@/core/game/CanvasGame";
import { Vector } from "@/core/utils/Vector";
import { MazeScene } from "@/games/maze/MazeScene";
import t from "@/i18n";

enum Direction {
  Up = "ArrowUp",
  Down = "ArrowDown",
  Left = "ArrowLeft",
  Right = "ArrowRight",
}

export class Maze extends CanvasGame {
  public static readonly GRID_SIZE = 31;
  public static readonly START = new Vector(
    0,
    0
    // Math.ceil(Maze.GRID_SIZE / 2),
    // Math.ceil(Maze.GRID_SIZE / 2)
  );
  public static readonly END = new Vector(
    Maze.GRID_SIZE - 1,
    Maze.GRID_SIZE - 1
  );
  protected _scene: Scene = new MazeScene(this, Maze.GRID_SIZE);
  public maze: boolean[][] = Maze.generateMaze(
    Maze.GRID_SIZE,
    Maze.START,
    Maze.END
  );

  public arrowKeys: Record<Direction, boolean> = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };

  public static createFilledBoard(size: number): boolean[][] {
    return new Array(size).fill(null).map(() => new Array(size).fill(true));
  }

  public static generateMaze(
    size: number,
    start: Vector,
    end: Vector
  ): boolean[][] {
    const board = Maze.createFilledBoard(size);
    const visitedCells: Vector[] = [];
    const getNeighbors = (cell: Vector): Vector[] => {
      const offsets = [
        new Vector(0, 2),
        new Vector(2, 0),
        new Vector(-2, 0),
        new Vector(0, -2),
      ];
      return offsets
        .map((offset) => cell.add(offset))
        .filter(
          (newCell) =>
            newCell.y >= 0 &&
            newCell.y < size &&
            newCell.x >= 0 &&
            newCell.x < size
        );
    };
    const getUnvisitedNeighbors = (cell: Vector) => {
      return getNeighbors(cell).filter(
        (newCell) =>
          !visitedCells.some((visitedCell) => visitedCell.equals(newCell))
      );
    };
    const visitCell = (cell: Vector) => {
      board[cell.y][cell.x] = false;
      visitedCells.push(cell);
      if (cell.equals(end)) {
        return;
      }
      let unvisitedNeighbors = getUnvisitedNeighbors(cell);
      let increasedChances: Vector[] = [];
      while (unvisitedNeighbors.length > 0) {
        [...unvisitedNeighbors].forEach((neighbor, _i, arr) => {
          const targetDist = end.distance(neighbor);
          if (arr.every((vec) => targetDist >= end.distance(vec))) {
            increasedChances.push(
              ...new Array<Vector>(2).fill(neighbor.clone())
            );
          }
        });
        unvisitedNeighbors.push(...increasedChances);
        const nextCell =
          unvisitedNeighbors[
            Math.floor(Math.random() * unvisitedNeighbors.length)
          ];
        const middleX = (nextCell.x - cell.x) / 2 + cell.x;
        const middleY = (nextCell.y - cell.y) / 2 + cell.y;
        board[middleY][middleX] = false;
        visitCell(nextCell);
        unvisitedNeighbors = getUnvisitedNeighbors(cell);
      }
    };
    visitCell(start);
    return board;
  }

  public constructor() {
    super({
      fixedUpdateStep: 50,
    });

    this.name = t("maze-title");
  }

  public player: Vector = Maze.START;

  public update(dt: number): void {}

  public fixedUpdate(dt: number): void {
    for (let i = 0; i < 4; i++) {
      const entry = Object.entries(this.arrowKeys)[i] as [Direction, boolean];
      if (entry[1]) {
        this.move(entry[0]);
      }
    }
  }

  public canMove(vector: Vector) {
    if (
      vector.x < 0 ||
      vector.y < 0 ||
      vector.x >= Maze.GRID_SIZE ||
      vector.y >= Maze.GRID_SIZE ||
      this.maze[vector.y][vector.x]
    ) {
      return false;
    }
    return true;
  }

  public move(direction: Direction) {
    let nextMove;
    switch (direction) {
      case Direction.Up: {
        nextMove = this.player.add(new Vector(0, -1));
        break;
      }
      case Direction.Down: {
        nextMove = this.player.add(new Vector(0, 1));
        break;
      }
      case Direction.Left: {
        nextMove = this.player.add(new Vector(-1, 0));
        break;
      }
      case Direction.Right: {
        nextMove = this.player.add(new Vector(1, 0));
        break;
      }
    }
    if (this.canMove(nextMove)) {
      this.player = nextMove;
    }
  }

  public keyDown(event: KeyboardEvent): void {
    if (Object.values<string>(Direction).includes(event.key)) {
      this.arrowKeys[event.key as Direction] = true;
    }
  }
  public keyUp(event: KeyboardEvent): void {
    if (Object.values<string>(Direction).includes(event.key)) {
      this.arrowKeys[event.key as Direction] = false;
    }
  }
  public restart(): void {
    this.player = Maze.START;
    this.maze = Maze.generateMaze(Maze.GRID_SIZE, Maze.START, Maze.END);
  }
}
