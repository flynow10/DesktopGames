import "./style.css";
import { Canvas } from "./Canvas";
import { CanvasImage } from "./CanvasImage";
import { Color } from "./Color";

const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
if (canvasElement !== null) {
  const canvas = new Canvas(canvasElement);

  const snake = new CanvasImage(500, 500, (image) => {
    image.fillRoundedRect(50, 50, 400, 400, 75, new Color("#3d3"));
    var radius = 35;
    var pupilSize = (radius * 2) / 3;
    image.setLineWidth(pupilSize);
    image.beginPath();
    image.circle(125, 125, radius);
    image.fill(new Color("#000"));
    image.stroke(new Color("#fff"));
    image.beginPath();
    image.circle(375, 125, radius);
    image.fill(new Color("#000"));
    image.stroke(new Color("#fff"));
  });

  canvas.drawImage(snake, 0, 0, Math.PI / 2, canvas.width / snake.width);
} else {
  console.log("element doesn't exist");
}
