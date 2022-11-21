import "./style.css";
import { Canvas } from "./Canvas";
import { CanvasImage } from "./CanvasImage";
import { Color } from "./Color";

const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
if (canvasElement !== null) {
  const canvas = new Canvas(canvasElement);

  const snake = new CanvasImage(500, 500, (image) => {
    image.fillRect(50, 50, 400, 400, new Color("#3d3"));
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
  const twentyFourtyEight = new CanvasImage(500, 500, (image) => {
    var color = new Color("#edc22e");
    image.fillRoundedRect(
      20 * (5 / 3),
      20 * (5 / 3),
      260 * (5 / 3),
      260 * (5 / 3),
      30 * (5 / 3),
      color
    );
    image.setFontSize(100 * (5 / 3));
    image.setFontWeight("bold");
    image.setTextAlign("center");
    image.setTextBaseline("middle");
    image.fillText(150 * (5 / 3), 150 * (5 / 3), "2048", new Color("#fff"));
  });
  canvas.beginPath();
  canvas.roundedRect(51.2, 51.2, 409.6, 409.6, 76.8);
  canvas.clip();
  canvas.drawImage(
    twentyFourtyEight,
    0,
    0,
    0,
    canvas.width / twentyFourtyEight.width
  );
} else {
  console.log("element doesn't exist");
}
