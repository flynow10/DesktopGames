import { Canvas } from "./internal";

export interface Scene {
  draw(canvas: Canvas, dt: number): void;
}
