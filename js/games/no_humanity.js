import { Color, Style } from "../canvas.js";
import { Game } from "../game.js";
import { GameLoop } from "../game_loop.js";

export class NoHumanity extends Game {
  constructor(canvas) {
    super(canvas);
    this.options.updateStep = 3000;
    this.options.drawWhenPaused = false;
    this.mouse = {
      pos: {
        x: 0,
        y: 0,
      },
      lastPos: {
        x: 0,
        y: 0,
      },
      click: false,
    };
    this.started = false;
    this.timer = 0;
    /** @type {Missile[]} */
    this.missiles = [];
    GameLoop.mouseObjects.push(
      this.canvas.getCanvasElement(),
      (e) => {
        this.mouse.click = true;
      },
      (e) => {
        var newPos = this.getMousePos(e);
        if (newPos.x !== this.mouse.pos.x || newPos.y !== this.mouse.pos.y) {
          this.mouse.lastPos = Object.assign({}, this.mouse.pos);
          this.mouse.pos = newPos;
        }
      },
      (e) => {
        if (this.mouse.click) {
          if (!this.started) {
            this.started = true;
            this.timer = 0;
            this.missiles = [];
          }
          this.mouse.click = false;
        }
      }
    );
    this.afterInit();
  }

  update() {
    if (this.started) {
      for (let i = 0; i < 10; i++) {
        this.missiles.push(new Missile(this));
      }
    }
  }

  draw() {
    this.updateTimer();
    this.updateMissiles();
    this.drawMissiles();
    this.drawShip();
    this.drawTimer();
    this.updateShipCollision();
  }

  updateShipCollision() {
    if (this.started) {
      this.missiles.forEach((missile) => {
        if (
          Math.abs(distance(missile.pos, this.mouse.pos)) <=
          7 + missile.size
        ) {
          this.started = false;
          this.missiles = [];
        }
      });
    }
  }

  drawShip() {
    var ctx = this.canvas.getCanvas();
    var shipPosition;
    if (this.started) {
      shipPosition = this.mouse.pos;
    } else {
      shipPosition = {
        x: this.canvas.size / 2,
        y: this.canvas.size / 2,
      };
    }
    var points = [
      { x: 0, y: -10 },
      { x: 5, y: 7 },
      { x: 0, y: 5 },
      { x: -5, y: 7 },
    ];
    this.canvas.setColor("#000");
    ctx.beginPath();
    ctx.moveTo(shipPosition.x + points[0].x, shipPosition.y + points[0].y);
    ctx.lineTo(shipPosition.x + points[1].x, shipPosition.y + points[1].y);
    ctx.lineTo(shipPosition.x + points[2].x, shipPosition.y + points[2].y);
    ctx.lineTo(shipPosition.x + points[3].x, shipPosition.y + points[3].y);
    ctx.lineTo(shipPosition.x + points[0].x, shipPosition.y + points[0].y);
    ctx.stroke();
  }

  // Transforms coordinate offsets to a position and rotation in radians
  rotatePoint(pos, point, direction) {
    var s = Math.sin(direction);
    var c = Math.cos(direction);
    return {
      x: point.x + (pos.x * c - pos.y * s),
      y: point.y + (pos.y * c + pos.x * s),
    };
  }

  updateMissiles() {
    for (const missile of this.missiles) {
      missile.update();
    }
  }

  drawMissiles() {
    for (const missile of this.missiles) {
      this.canvas.drawRect(
        missile.pos.x - missile.size,
        missile.pos.y - missile.size,
        missile.size * 2,
        missile.size * 2,
        Color.PrimaryColor,
        Style.Fill
      );
    }
  }

  updateTimer() {
    if (this.started) {
      this.timer += GameLoop.deltaTime;
    }
  }

  drawTimer() {
    var ctx = this.canvas.getCanvas();
    ctx.font = '25px "Fira Sans", sans-serif';
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    this.canvas.setColor("#fff");
    var nf = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    ctx.fillText(nf.format(this.timer / 1000), 10, 10);
  }

  cleanup() {
    super.cleanup();
    GameLoop.mouseObjects.remove(this.canvas.getCanvasElement());
  }
}

class Missile {
  constructor(noHumanity) {
    /** @type {NoHumanity} */
    this.noHumanity = noHumanity;
    this.size = Math.floor(Math.random() * 3) + 5;
    var side = Math.floor(Math.random() * 4);
    var canvasSize = this.noHumanity.canvas.size;
    this.pos = {
      x: -100,
      y: -100,
    };
    switch (side) {
      case 0:
        this.pos.x = 0;
        this.pos.y = Math.floor(Math.random() * canvasSize);
        console.log("Left");
        break;
      case 1:
        this.pos.x = canvasSize;
        this.pos.y = Math.floor(Math.random() * canvasSize);
        console.log("Right");
        break;
      case 2:
        this.pos.x = Math.floor(Math.random() * canvasSize);
        this.pos.y = 0;
        console.log("Up");
        break;
      case 3:
        this.pos.x = Math.floor(Math.random() * canvasSize);
        this.pos.y = canvasSize;
        console.log("Down");
        break;
    }

    this.directionVector = {
      x: this.pos.x - this.noHumanity.mouse.pos.x,
      y: this.pos.y - this.noHumanity.mouse.pos.y,
    };

    var mag = Math.sqrt(
      this.directionVector.x * this.directionVector.x +
        this.directionVector.y * this.directionVector.y
    );
    this.directionVector.x /= mag;
    this.directionVector.y /= mag;
  }

  update() {
    this.pos.x -= this.directionVector.x * 0.1 * GameLoop.deltaTime;
    this.pos.y -= this.directionVector.y * 0.1 * GameLoop.deltaTime;
  }
}

const distance = (v1, v2) => {
  return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
};
