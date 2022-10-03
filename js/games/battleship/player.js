import { ShipLocations } from "./ship_locations.js";
import { ShotBoard } from "./shot_board.js";

export class Player {
  constructor() {
    this.shipLocations = new ShipLocations();
    this.shotBoard = new ShotBoard();
  }
}
