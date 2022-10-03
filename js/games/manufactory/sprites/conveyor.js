import { Canvas, Color, Style } from "../../../canvas.js";
import { Vector } from "../vector.js";

/**
 * @param {Direction} enter
 * @param {Direction} exit
 */
export function ConveyorSprite(enter, exit) {
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {Vector} center
   * @param {Number} direction
   */
  function drawArrow(ctx, center, direction) {
    var point1 = center.addScalars(-5, 2).rotateAroundPoint(center, direction);
    var point2 = center.addScalars(0, -2).rotateAroundPoint(center, direction);
    var point3 = center.addScalars(5, 2).rotateAroundPoint(center, direction);
    ctx.save();
    ctx.strokeStyle = "#dd3";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.lineTo(point3.x, point3.y);
    ctx.stroke();
    ctx.restore();
  }
  /**
   * @param {Canvas} canvas
   * @param {Vector} pos
   */
  return function (canvas, pos) {
    const BUFFER = 5;
    const SIZE = 50;
    const SIDE_WIDTH = 2;
    const CENTER = new Vector(25, 25);
    const ctx = canvas.getCanvas();
    var entranceAngle = 0;
    var angleDifference;
    switch (enter) {
      case "north":
        entranceAngle = 0;
        break;
      case "east":
        entranceAngle = 90;
        break;
      case "south":
        entranceAngle = 180;
        break;
      case "west":
        entranceAngle = 270;
        break;
    }
    switch (exit) {
      case "north":
        angleDifference = entranceAngle - 0;
        break;
      case "east":
        angleDifference = entranceAngle - 90;
        break;
      case "south":
        angleDifference = entranceAngle - 180;
        break;
      case "west":
        angleDifference = entranceAngle - 270;
        break;
    }
    ctx.save();
    if (Math.abs(angleDifference) === 180) {
      ctx.fillStyle = "#b7b7b7";
      if (entranceAngle === 0 || entranceAngle === 180) {
        ctx.fillRect(
          pos.x + BUFFER + SIDE_WIDTH,
          pos.y,
          SIZE - BUFFER * 2 - SIDE_WIDTH * 2,
          SIZE
        );
      } else {
        ctx.fillRect(
          pos.x,
          pos.y + BUFFER + SIDE_WIDTH,
          SIZE,
          SIZE - BUFFER * 2 - SIDE_WIDTH * 2
        );
      }
      ctx.strokeStyle = "#8c8c8c";
      var leftStart = new Vector(
        BUFFER + SIDE_WIDTH / 2,
        0
      ).rotateAroundPointFast(CENTER, entranceAngle);

      var leftEnd = new Vector(
        BUFFER + SIDE_WIDTH / 2,
        SIZE
      ).rotateAroundPointFast(CENTER, entranceAngle);

      var rightStart = new Vector(
        SIZE - (BUFFER + SIDE_WIDTH / 2),
        0
      ).rotateAroundPointFast(CENTER, entranceAngle);

      var rightEnd = new Vector(
        SIZE - (BUFFER + SIDE_WIDTH / 2),
        SIZE
      ).rotateAroundPointFast(CENTER, entranceAngle);

      ctx.lineWidth = SIDE_WIDTH;
      ctx.beginPath();
      ctx.moveTo(pos.x + leftStart.x, pos.y + leftStart.y);
      ctx.lineTo(pos.x + leftEnd.x, pos.y + leftEnd.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x + rightStart.x, pos.y + rightStart.y);
      ctx.lineTo(pos.x + rightEnd.x, pos.y + rightEnd.y);
      ctx.stroke();
      // ctx.fillRect(pos.x + BUFFER, pos.y, SIDE_WIDTH, SIZE);
      // ctx.fillRect(pos.x + (SIZE - BUFFER - SIDE_WIDTH), pos.y, SIDE_WIDTH, SIZE);
    } else {
    }
    drawArrow(
      ctx,
      new Vector(pos.x + 25, pos.y + 25),
      (entranceAngle + 180) * (Math.PI / 180)
    );
    ctx.restore();
  };
}
