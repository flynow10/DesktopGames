import { Game } from "../../game.js";
import { GameLoop } from "../../game_loop.js";
import { Camera } from "./camera.js";
import { Scene } from "./scene.js";
import { TestCanvasObject } from "./test.js";
import { Vector } from "./vector.js";

export class Manufactory extends Game {
  constructor(canvas) {
    super(canvas);
    this.options.updateStep = 10;
    this.options.whiteBackground = true;
    this.scene = new Scene();
    this.scene.registerObject(new TestCanvasObject("north", -25));
    this.scene.registerObject(new TestCanvasObject("south", 25));
    this.scene.registerObject(new TestCanvasObject("east", 75));
    this.scene.registerObject(new TestCanvasObject("west", 125));
    this.camera = new Camera(canvas);
    this.scene.setCamera(this.camera);
    this.afterInit();
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
  }

  /**
   *
   * @param {KeyboardEvent} e
   */
  keyDownEvent(e) {
    if (e.code.toLowerCase().includes("arrow")) {
      this.keys[e.code.substring(5).toLowerCase()] = true;
    }
  }
  /**
   *
   * @param {KeyboardEvent} e
   */
  keyUpEvent(e) {
    if (e.code.toLowerCase().includes("arrow")) {
      this.keys[e.code.substring(5).toLowerCase()] = false;
    }
  }

  update() {
    var deltaTime = (this.updateTime - this.lastUpdate) / 1000;
    var x =
      (Number(this.keys.right) + Number(this.keys.left) * -1) * deltaTime * 150;
    var y =
      (Number(this.keys.down) + Number(this.keys.up) * -1) * deltaTime * 150;
    this.camera.center.addInplace(new Vector(x, y));
  }

  draw() {
    this.scene.render(this.canvas);
  }
}
