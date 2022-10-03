import { Camera } from "./camera.js";
import { CanvasObject } from "./canvas_object.js";

export class Scene {
  /**
   * @type {CanvasObject[]}
   */
  #gameObjects = [];
  /**
   * @type {Camera}
   */
  #camera;

  render(canvas) {
    for (const object of this.#gameObjects) {
      for (const sprite of object.getSprites()) {
        sprite.sprite(canvas, this.#camera.worldToScreen(sprite.pos));
      }
    }
  }

  /**
   * @param {CanvasObject} object
   */
  registerObject(object) {
    this.#gameObjects.push(object);
  }

  /**
   * @param {Camera} camera
   */
  setCamera(camera) {
    this.#camera = camera;
  }

  getCamera() {
    return this.#camera;
  }
}
