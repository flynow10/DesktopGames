import { Color, Style } from "../../canvas.js";
import { Game } from "../../game.js";
import { GameLoop } from "../../game_loop.js";
import { Player } from "./player.js";
import { rng } from "./random.js";
import { ShipSizes } from "./ship_locations.js";

const States = {
  PlayerShipBoard: 0,
  PlayerShotBoard: 1,
  SwitchPlayers: 2,
};

const Stages = {
  PlacingShips: 0,
  Attacking: 1,
  GameOver: 2,
};

export class Battleship extends Game {
  constructor(canvas) {
    super(canvas);
    this.state;
    this.stage;
    /** @type {Player[]} */
    this.players;
    this.currentPlayer = 0;
    this.mouse = {
      pos: {
        x: 0,
        y: 0,
      },
      click: false,
    };
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
          this.mouse.click = false;
        }
      }
    );
    this.newGame();
    this.afterInit();
  }

  get squareSize() {
    return this.canvas.size / 12;
  }

  newGame() {
    this.state = States.PlayerShipBoard;
    this.stage = Stages.PlacingShips;
    this.players = [new Player(), new Player()];
    this.currentPlayer = 0;
  }

  draw() {
    if (this.stage !== Stages.GameOver) {
      if (this.state === States.SwitchPlayers) {
        return;
      }
      this.drawBoardOutline();
      if (this.state === States.PlayerShipBoard) {
        this.drawShips();
      }
    }
  }

  mouseOnGrid() {
    if (
      this.mouse.pos.x >= this.squareSize &&
      this.mouse.x <= this.squareSize * 11
    ) {
      if (this.mouse.pos.y >= 0 && this.mouse.pos.y <= this.squareSize * 10) {
        return true;
      }
    }
    return false;
  }

  drawBoardOutline() {
    this.canvas.ctx.textAlign = "center";
    this.canvas.ctx.textBaseline = "middle";
    rng.setSeed("239");
    for (let i = 0; i < 10; i++) {
      for (let j = 1; j <= 10; j++) {
        this.canvas.setColor(
          "#" + (0x4466de + (Math.floor(rng.random() * 40) - 20)).toString(16)
        );
        this.canvas.drawRect(
          j * this.squareSize,
          i * this.squareSize,
          this.squareSize,
          this.squareSize,
          Color.Custom,
          Style.Fill
        );
        this.canvas.setColor("#000");
        this.canvas.drawRect(
          j * this.squareSize,
          i * this.squareSize,
          this.squareSize,
          this.squareSize,
          Color.Custom,
          Style.Stroke
        );
        if (i === 9) {
          this.canvas.ctx.fillText(
            String.fromCharCode(j + 64),
            this.squareSize * (j + 0.5),
            this.squareSize * (i + 1.5)
          );
        }
      }
      this.canvas.ctx.fillText(
        i + 1,
        this.squareSize / 2,
        this.squareSize * (i + 0.5)
      );
    }
  }

  drawShips() {
    const player = this.players[this.currentPlayer];
    for (const shipName in player.shipLocations.ships) {
      if (
        Object.hasOwnProperty.call(player.shipLocations.ships, shipName) &&
        Object.hasOwnProperty.call(ShipSizes, shipName) &&
        Object.hasOwnProperty.call(player.shipLocations.placedShips, shipName)
      ) {
        if (player.shipLocations.placedShips[shipName]) {
          const ship = player.shipLocations.ships[shipName];
          this.drawShip(ship[0], ship[1], ShipSizes[shipName], ship[2]);
        }
      }
    }
  }

  drawShip(x, y, length, direction) {
    this.canvas.drawRect(
      (x + 1.1) * this.squareSize,
      (y + 0.1) * this.squareSize,
      direction === 0
        ? this.squareSize * length - this.squareSize * 0.2
        : this.squareSize * 0.8,
      direction === 1
        ? this.squareSize * length - this.squareSize * 0.2
        : this.squareSize * 0.8,
      Color.PrimaryColor,
      Style.Fill
    );
  }
}
