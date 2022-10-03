import { Canvas } from "./canvas.js";
import { GameLoop } from "./game_loop.js";
import { Modal } from "./modal.js";

export class Game {
  constructor(canvas) {
    this.options = {
      updateStep: 250,
      drawWhenPaused: true,
      clearCanvas: true,
      bindRestartKey: false,
      whiteBackground: false,
    };
    /** @type {Canvas} */
    this.canvas = canvas;
    this.updateTime = 0;
    this.lastUpdate = 0;
    this.paused = false;
    this.abortSignal = new AbortController();
    this.boundLoopMethod = this.internalLoop.bind(this);
  }

  getMousePos(evt) {
    var rect = this.canvas.getCanvasElement().getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }

  afterInit() {
    GameLoop.onUpdate.push(this.boundLoopMethod);

    window.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape") {
          this.togglePause();
          return;
        }
        if (!this.paused) {
          if (e.code === "KeyR" && this.options.bindRestartKey) {
            this.restart();
          }
          // Deprecated
          this.keyPressEvent(e);
          this.keyDownEvent(e);
        }
      },
      {
        capture: false,
        signal: this.abortSignal.signal,
      }
    );
    window.addEventListener(
      "keyup",
      (e) => {
        if (!this.paused) {
          this.keyUpEvent(e);
        }
      },
      {
        capture: false,
        signal: this.abortSignal.signal,
      }
    );
    if (this.options.whiteBackground) {
      this.canvas.getCanvasElement().classList.add("white");
    }
  }

  togglePause() {
    this.paused = !this.paused;
    if (this.paused) {
      var modal = Modal.createModal("dark");
      modal.innerHTML =
        '<span style="text-align: center; font-size: 3rem;">Paused</span>';
      var unpauseButton = Modal.createButton("Back to game");
      unpauseButton.addEventListener("click", () => {
        this.togglePause();
      });
      modal.appendChild(unpauseButton);
      var backButton = Modal.createButton("Main menu");
      backButton.addEventListener("click", () => {
        window.mainMenu();
      });
      modal.appendChild(backButton);
    } else {
      Modal.clearModals();
    }
  }
  internalLoop() {
    this.canvas.fillContainer();
    this.internalUpdate();
    this.internalDraw();
  }

  internalUpdate() {
    if (!this.paused) {
      this.updateTime += GameLoop.deltaTime;
      if (this.updateTime >= this.lastUpdate + this.options.updateStep) {
        this.update();
        this.lastUpdate = this.updateTime;
      }
    }
  }

  update() {}

  internalDraw() {
    if (!this.paused || this.options.drawWhenPaused) {
      if (this.options.clearCanvas) {
        this.canvas
          .getCanvas()
          .clearRect(0, 0, this.canvas.size, this.canvas.size);
      }
      this.draw();
    }
  }

  draw() {}
  /**
   * @param {KeyboardEvent} e
   * @deprecated use keyDownEvent instead
   */
  keyPressEvent(e) {}
  /**
   * @param {KeyboardEvent} e
   */
  keyUpEvent(e) {}
  /**
   * @param {KeyboardEvent} e
   */
  keyDownEvent(e) {}

  restart() {}

  cleanup() {
    this.abortSignal.abort();
    GameLoop.mouseObjects.remove(this.canvas.getCanvasElement());
  }
}
