export const ShipSizes = {
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 2,
};
export class ShipLocations {
  constructor() {
    this.ships = {
      carrier: [0, 0, 0],
      battleship: [0, 0, 0],
      cruiser: [0, 0, 0],
      submarine: [0, 0, 0],
      destroyer: [0, 0, 0],
    };
    this.placedShips = {
      carrier: false,
      battleship: false,
      cruiser: false,
      submarine: false,
      destroyer: false,
    };
  }
}
