export const Color = {
  PrimaryColor: 0,
  SecondaryColor: 1,
  Custom: 2,
};

export const Style = {
  Fill: 0,
  Stroke: 1,
  Both: 2,
};

export class Canvas {
  constructor(canvas) {
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas;

    /** @type {CanvasRenderingContext2D} */
    this.ctx = this.canvas.getContext("2d");

    this.size = 0;
  }

  /**
   * Get the rendering context of this canvas
   */
  getCanvas() {
    return this.ctx;
  }

  /**
   * Get the html element of this canvas
   */
  getCanvasElement() {
    return this.canvas;
  }

  fillContainer() {
    var parent = this.canvas.parentElement;
    if (parent.classList.contains("canvas-container")) {
      var styles = window.getComputedStyle(parent);
      var width = Number.parseInt(styles.getPropertyValue("width"), 10);
      var height = Number.parseInt(styles.getPropertyValue("height"), 10);
      this.size = Math.min(width, height);
      this.canvas.width = this.size;
      this.canvas.height = this.size;
    }
  }
  /**
   * Draws a rectangle
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} color
   * @param {number} style
   */
  drawRect(x, y, width, height, color, style) {
    this.setColor(color);
    if (style === undefined || style === null) {
      style = Style.Both;
    }
    if (style !== Style.Stroke) {
      this.ctx.fillRect(x, y, width, height);
    }
    if (style !== Style.Fill) {
      this.ctx.strokeRect(x, y, width, height);
    }
  }

  /**
   * Draws a circle
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {number} color
   * @param {number} style
   */
  drawCircle(x, y, radius, color, style) {
    this.setColor(color);
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (style === undefined || style === null) {
      style = Style.Both;
    }
    if (style !== Style.Stroke) {
      this.ctx.fill();
    }
    if (style !== Style.Fill) {
      this.ctx.stroke();
    }
  }

  /**
   * Sets the color of canvas actions
   * @param {String|number} color
   */
  setColor(color) {
    if (typeof color === "number") {
      if (color === Color.Custom) {
        return;
      }
      if (color === Color.PrimaryColor) {
        this.ctx.fillStyle = "#444444";
        this.ctx.strokeStyle = "#444444";
      } else if (color === Color.SecondaryColor) {
        this.ctx.fillStyle = "#3d3d3d";
        this.ctx.strokeStyle = "#3d3d3d";
      }
    } else {
      this.ctx.fillStyle = color;
      this.ctx.strokeStyle = color;
    }
  }
}
