import { Canvas } from "../../canvas.js";
import { Vector } from "./vector.js";

export class Camera {
  /**
   * @param {Canvas} canvas
   */
  constructor(canvas) {
    this.center = new Vector();
    this.canvas = canvas;
  }

  /**
   * @param {Vector} world
   */
  worldToScreen(world) {
    return world.sub(this.center).addScalar(this.canvas.size / 2);
  }

  /**
   * @param {Vector} screen
   */
  screenToWorld(screen) {
    return screen.subScalar(this.canvas.size / 2).add(this.center);
  }
}
