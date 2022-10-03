import { CanvasObject } from "./canvas_object.js";
import { BoxSprite } from "./sprites/box.js";
import { ConveyorSprite } from "./sprites/conveyor.js";
import { Vector } from "./vector.js";

export class TestCanvasObject extends CanvasObject {
  /**
   * @param {Direction} enter
   */
  constructor(enter, y) {
    super();
    this.enter = enter;
    this.y = y;
  }
  getSprites() {
    return [
      {
        sprite: ConveyorSprite(this.enter, "west"),
        pos: new Vector(-25, this.y),
      },
    ];
  }
}
