import type { CanvasImage } from "./internal";
import { Color } from "@/core/utils/Color";
import { Vector } from "@/core/utils/Vector";

export abstract class CanvasWrapper {
  protected abstract get context(): CanvasRenderingContext2D;

  public get width(): number {
    return this.context.canvas.width;
  }

  public get height(): number {
    return this.context.canvas.height;
  }

  private fontSize: number = 10;
  private fontFamily: string = "sans-serif";
  private fontStyle: string = "normal";
  private fontWeight: string = "normal";

  public commands: { command: string; args: IArguments; argCount: number }[] =
    [];

  private get font() {
    return `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
  }

  public fillText(
    x: number,
    y: number,
    t: string,
    c: Color | null = null,
    maxWidth: number | undefined = undefined,
    quiet = false
  ) {
    if (c !== null) {
      this.context.fillStyle = c.getColor();
    }
    this.context.fillText(t, x, y, maxWidth);
    if (!quiet) {
      this.commands.push({ command: "fillText", args: arguments, argCount: 5 });
    }
  }

  public strokeText(
    x: number,
    y: number,
    t: string,
    c: Color | null = null,
    maxWidth: number | undefined,
    quiet = false
  ) {
    if (c !== null) {
      this.context.strokeStyle = c.getColor();
    }
    this.context.strokeText(t, x, y, maxWidth);
    if (!quiet) {
      this.commands.push({
        command: "strokeText",
        args: arguments,
        argCount: 5,
      });
    }
  }

  public fillCircle(
    x: number,
    y: number,
    r: number,
    c: Color | null = null,
    quiet = false
  ) {
    if (c !== null) {
      this.context.fillStyle = c.getColor();
    }
    this.context.beginPath();
    this.context.arc(x, y, r, 0, 2 * Math.PI);
    this.context.fill();
    if (!quiet) {
      this.commands.push({
        command: "fillCircle",
        args: arguments,
        argCount: 4,
      });
    }
  }

  public strokeCircle(
    x: number,
    y: number,
    r: number,
    c: Color | null = null,
    quiet = false
  ) {
    if (c !== null) {
      this.context.strokeStyle = c.getColor();
    }
    this.context.beginPath();
    this.context.arc(x, y, r, 0, 2 * Math.PI);
    this.context.stroke();
    if (!quiet) {
      this.commands.push({
        command: "strokeCircle",
        args: arguments,
        argCount: 4,
      });
    }
  }

  public circle(x: number, y: number, r: number, quiet = false) {
    this.context.arc(x, y, r, 0, 2 * Math.PI);
    if (!quiet) {
      this.commands.push({ command: "circle", args: arguments, argCount: 3 });
    }
  }

  public fillRect(
    x: number,
    y: number,
    w: number,
    h: number,
    c: Color | null = null,
    quiet: boolean = false
  ) {
    if (c !== null) {
      this.context.fillStyle = c.getColor();
    }
    this.context.fillRect(x, y, w, h);
    if (!quiet) {
      this.commands.push({ command: "fillRect", args: arguments, argCount: 5 });
    }
  }

  public strokeRect(
    x: number,
    y: number,
    w: number,
    h: number,
    c: Color | null = null,
    quiet: boolean = false
  ) {
    if (c !== null) {
      this.context.strokeStyle = c.getColor();
    }
    this.context.strokeRect(x, y, w, h);
    if (!quiet) {
      this.commands.push({
        command: "strokeRect",
        args: arguments,
        argCount: 5,
      });
    }
  }

  public rect(x: number, y: number, w: number, h: number, quiet = false) {
    this.context.rect(x, y, w, h);
    if (!quiet) {
      this.commands.push({ command: "rect", args: arguments, argCount: 4 });
    }
  }

  public fillRoundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    c: Color | null = null,
    quiet: boolean = false
  ) {
    if (c !== null) {
      this.context.fillStyle = c.getColor();
    }
    this.context.beginPath();
    this.roundedRect(x, y, w, h, r, true);
    this.context.fill();
    if (!quiet) {
      this.commands.push({
        command: "fillRoundedRect",
        args: arguments,
        argCount: 6,
      });
    }
  }

  public strokeRoundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    c: Color | null = null,
    quiet: boolean = false
  ) {
    if (c !== null) {
      this.context.strokeStyle = c.getColor();
    }
    this.context.beginPath();
    this.roundedRect(x, y, w, h, r, true);
    this.context.stroke();
    if (!quiet) {
      this.commands.push({
        command: "strokeRoundedRect",
        args: arguments,
        argCount: 6,
      });
    }
  }

  public roundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    quiet: boolean = false
  ): void {
    this.context.moveTo(x + r, y);
    this.context.lineTo(x + w - r, y);
    this.context.quadraticCurveTo(x + w, y, x + w, y + r);
    this.context.lineTo(x + w, y + h - r);
    this.context.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.context.lineTo(x + r, y + h);
    this.context.quadraticCurveTo(x, y + h, x, y + h - r);
    this.context.lineTo(x, y + r);
    this.context.quadraticCurveTo(x, y, x + r, y);
    if (!quiet) {
      this.commands.push({
        command: "roundedRect",
        args: arguments,
        argCount: 5,
      });
    }
  }

  public fillTriangle(
    p1: Vector,
    p2: Vector,
    p3: Vector,
    c: Color | null = null,
    quiet: boolean = false
  ) {
    if (c !== null) {
      this.context.fillStyle = c.getColor();
    }
    this.context.beginPath();
    this.triangle(p1, p2, p3, true);
    this.context.fill();
    if (!quiet) {
      this.commands.push({
        command: "fillTriangle",
        args: arguments,
        argCount: 4,
      });
    }
  }

  public strokeTriangle(
    p1: Vector,
    p2: Vector,
    p3: Vector,
    c: Color | null = null,
    quiet = false
  ) {
    if (c !== null) {
      this.context.strokeStyle = c.getColor();
    }
    this.context.beginPath();
    this.triangle(p1, p2, p3, true);
    this.context.stroke();
    if (!quiet) {
      this.commands.push({
        command: "strokeTriangle",
        args: arguments,
        argCount: 4,
      });
    }
  }

  public triangle(p1: Vector, p2: Vector, p3: Vector, quiet = false) {
    this.context.moveTo(p1.x, p1.y);
    this.context.lineTo(p2.x, p2.y);
    this.context.lineTo(p3.x, p3.y);
    this.context.lineTo(p1.x, p1.y);
    if (!quiet) {
      this.commands.push({ command: "triangle", args: arguments, argCount: 3 });
    }
  }

  public drawImage(
    image: CanvasImageSource | CanvasImage,
    x: number,
    y: number,
    rotation: number = 0,
    scale: number = 1,
    quiet = false
  ) {
    if ("canvas" in image) {
      image = image.canvas;
    }
    var width = (image.width as number) * scale;
    var height = (image.height as number) * scale;
    this.context.save();
    this.context.translate(x + width / 2, y + height / 2);
    this.context.rotate(rotation);
    this.context.drawImage(image, -width / 2, -height / 2, width, height);
    this.context.restore();
    if (!quiet) {
      this.commands.push({
        command: "drawImage",
        args: arguments,
        argCount: 5,
      });
    }
  }

  public save(quiet = false) {
    this.context.save();
    if (!quiet) {
      this.commands.push({ command: "save", args: arguments, argCount: 0 });
    }
  }

  public restore(quiet = false) {
    this.context.restore();
    if (!quiet) {
      this.commands.push({ command: "restore", args: arguments, argCount: 0 });
    }
  }

  public translate(x: number, y: number, quiet = false) {
    this.context.translate(x, y);
    if (!quiet) {
      this.commands.push({
        command: "translate",
        args: arguments,
        argCount: 2,
      });
    }
  }

  public rotate(angle: number, quiet = false) {
    this.context.rotate(angle);
    if (!quiet) {
      this.commands.push({ command: "rotate", args: arguments, argCount: 1 });
    }
  }

  public scale(x: number, y: number, quiet = false) {
    this.context.scale(x, y);
    if (!quiet) {
      this.commands.push({ command: "scale", args: arguments, argCount: 2 });
    }
  }

  public clip(fillRule: CanvasFillRule | undefined = undefined, quiet = false) {
    this.context.clip(fillRule);
    if (!quiet) {
      this.commands.push({ command: "clip", args: arguments, argCount: 1 });
    }
  }

  public beginPath(quiet = false) {
    this.context.beginPath();
    if (!quiet) {
      this.commands.push({
        command: "beginPath",
        args: arguments,
        argCount: 0,
      });
    }
  }

  public fill(c: Color | null = null, close: boolean = true, quiet = false) {
    if (c !== null) {
      this.context.fillStyle = c.getColor();
    }
    if (close) {
      this.context.closePath();
    }
    this.context.fill();
    if (!quiet) {
      this.commands.push({ command: "fill", args: arguments, argCount: 2 });
    }
  }

  public stroke(c: Color | null = null, close: boolean = true, quiet = false) {
    if (c !== null) {
      this.context.strokeStyle = c.getColor();
    }
    if (close) {
      this.context.closePath();
    }
    this.context.stroke();
    if (!quiet) {
      this.commands.push({ command: "stroke", args: arguments, argCount: 2 });
    }
  }

  public moveTo(x: number, y: number, quiet = false) {
    this.context.moveTo(x, y);
    if (!quiet) {
      this.commands.push({ command: "moveTo", args: arguments, argCount: 2 });
    }
  }

  public lineTo(x: number, y: number, quiet: boolean = false) {
    this.context.lineTo(x, y);
    if (!quiet) {
      this.commands.push({ command: "lineTo", args: arguments, argCount: 2 });
    }
  }

  public arc(
    x: number,
    y: number,
    r: number,
    s: number,
    e: number,
    quiet = false
  ) {
    this.context.arc(x, y, r, s, e);
    if (!quiet) {
      this.commands.push({ command: "arc", args: arguments, argCount: 5 });
    }
  }

  public closePath(quiet = false) {
    this.context.closePath();
    if (!quiet) {
      this.commands.push({
        command: "closePath",
        args: arguments,
        argCount: 0,
      });
    }
  }

  public setLineWidth(w: number, quiet: boolean = false) {
    this.context.lineWidth = w;
    if (!quiet) {
      this.commands.push({
        command: "setLineWidth",
        args: arguments,
        argCount: 1,
      });
    }
  }

  public setFontSize(s: number, quiet = false) {
    this.fontSize = s;
    this.context.font = this.font;
    if (!quiet) {
      this.commands.push({
        command: "setFontSize",
        args: arguments,
        argCount: 1,
      });
    }
  }

  public setFontFamily(f: string, quiet: boolean = false) {
    this.fontFamily = f;
    this.context.font = this.font;
    if (!quiet) {
      this.commands.push({
        command: "setFontFamily",
        args: arguments,
        argCount: 1,
      });
    }
  }

  public setFontStyle(s: string, quiet = false) {
    this.fontStyle = s;
    this.context.font = this.font;
    if (!quiet) {
      this.commands.push({
        command: "setFontStyle",
        args: arguments,
        argCount: 1,
      });
    }
  }

  public setFontWeight(w: string, quiet: boolean = false) {
    this.fontWeight = w;
    this.context.font = this.font;
    if (!quiet) {
      this.commands.push({
        command: "setFontWeight",
        args: arguments,
        argCount: 1,
      });
    }
  }

  public setTextAlign(a: CanvasTextAlign, quiet: boolean = false) {
    this.context.textAlign = a;
    if (!quiet) {
      this.commands.push({
        command: "setTextAlign",
        args: arguments,
        argCount: 1,
      });
    }
  }

  public setTextBaseline(b: CanvasTextBaseline, quiet: boolean = false) {
    this.context.textBaseline = b;
    if (!quiet) {
      this.commands.push({
        command: "setTextBaseline",
        args: arguments,
        argCount: 1,
      });
    }
  }

  public setLineCap(c: CanvasLineCap, quiet = false) {
    this.context.lineCap = c;
    if (!quiet) {
      this.commands.push({
        command: "setLineCap",
        args: arguments,
        argCount: 1,
      });
    }
  }

  public setLineJoin(j: CanvasLineJoin, quiet = false) {
    this.context.lineJoin = j;
    if (!quiet) {
      this.commands.push({
        command: "setLineJoin",
        args: arguments,
        argCount: 1,
      });
    }
  }

  public setMiterLimit(l: number, quiet = false) {
    this.context.miterLimit = l;
    if (!quiet) {
      this.commands.push();
    }
  }

  public setLineDash(d: number[], quiet = false) {
    this.context.setLineDash(d);
    if (!quiet) {
      this.commands.push({
        command: "setLineDash",
        args: arguments,
        argCount: 1,
      });
    }
  }

  public setLineDashOffset(o: number, quiet = false) {
    this.context.lineDashOffset = o;
    if (!quiet) {
      this.commands.push({
        command: "setLineDashOffset",
        args: arguments,
        argCount: 1,
      });
    }
  }

  public clearCommands() {
    this.commands = [];
  }

  public reset() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.fillStyle = "#000000";
    this.context.strokeStyle = "#000000";
    this.context.lineWidth = 1;
    this.fontSize = 10;
    this.fontFamily = "sans-serif";
    this.fontStyle = "normal";
    this.fontWeight = "normal";
    this.context.font = this.font;
    this.context.textAlign = "start";
    this.context.textBaseline = "alphabetic";
    this.context.lineCap = "butt";
    this.context.lineJoin = "miter";
    this.context.miterLimit = 10;
    this.context.setLineDash([]);
    this.context.lineDashOffset = 0;
  }

  public redraw() {
    this.reset();
    for (let i = 0; i < this.commands.length; i++) {
      let command = this.commands[i];
      console.log(command);
      if (command.command in this) {
        var args = [...command.args];
        args[command.argCount] = true;
        for (let i = 0; i < command.argCount; i++) {
          if (args[i] === undefined) {
            args[i] = undefined;
          }
        }
        (this as any)[command.command].apply(this, args);
      }
    }
  }
}
