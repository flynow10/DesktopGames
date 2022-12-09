import { Canvas } from "@/core/canvas/internal";
import { Scene } from "@/core/canvas/internal";
import { Game, GameOptions } from "./Game";

export abstract class CanvasGame extends Game {
  private _canvas: Canvas | null = null;
  protected abstract _scene: Scene;
  public get canvas(): Canvas {
    if (this._canvas === null) {
      throw "Canvas is not set!";
    }
    return this._canvas;
  }
  public pauseData: ImageData | null = null;

  constructor(options: Partial<GameOptions> = {}) {
    super(Object.assign({}, options, { drawWhenPaused: true }));
  }

  public draw(dt: number): void {
    this._canvas?.clearCommands();
    this._canvas?.reset();
    if (this.paused) {
      if (this.pauseData !== null) {
        this.canvas.setPauseImage(this.pauseData);
      }
    } else {
      if (this._scene !== null) {
        this._scene.draw(this.canvas, dt);
      }
    }
  }

  public attach(node: { getCanvas: () => Canvas }): void {
    this._canvas = node.getCanvas();
    this.onPause.push(() => {
      if (this.paused) {
        this.pauseData = this.canvas.getPauseImage();
      }
    });
    this._canvas.onRequireRedraw.push(() => {
      if (this.paused && this.pauseData !== null) {
        this.canvas.setPauseImage(this.pauseData);
      }
    });
    this.canvas.onMouseDown.push((event) => {
      if (!this.paused) {
        this.mouseDown(event);
      }
    });
    this.canvas.onMouseUp.push((event) => {
      if (!this.paused) {
        this.mouseUp(event);
      }
    });
  }

  public mouseDown(event: MouseEvent) {}
  public mouseUp(event: MouseEvent) {}
}
