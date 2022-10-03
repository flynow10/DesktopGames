import { Canvas, Color, Style } from "../../../canvas.js";
import { Vector } from "../vector.js";
export function BoxSprite(width, height) {
  /**
   * @param {Canvas} canvas
   * @param {Vector} pos
   */
  return function (canvas, pos) {
    canvas.drawRect(
      pos.x,
      pos.y,
      width,
      height,
      Color.PrimaryColor,
      Style.Fill
    );
  };
}
