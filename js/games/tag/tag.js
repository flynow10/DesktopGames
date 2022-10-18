import { Game } from "../../game.js";

var Engine = Matter.Engine,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Common = Matter.Common,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint,
  Vector = Matter.Vector,
  Body = Matter.Body;
const Catagories = {
  default: 0x0001,
  player: 0x0002,
  map: 0x0004,
};
class Player {
  SPEED = 5;
  constructor(playerNumber) {
    this.playerNumber = playerNumber;
    this.body = Bodies.rectangle(0, 0, 30, 30, {
      frictionAir: 0.1,
      inertia: Infinity,
      collisionFilter: {
        group: 0,
        category: Catagories.player,
        mask: Catagories.default | Catagories.map,
      },
    });
  }

  update(keys) {
    var vector = Vector.create(0, 0);
    if (this.playerNumber === 1) {
      if (keys.ArrowDown) {
        vector.y += this.SPEED;
      }
      if (keys.ArrowUp) {
        vector.y -= this.SPEED;
      }
      if (keys.ArrowRight) {
        vector.x += this.SPEED;
      }
      if (keys.ArrowLeft) {
        vector.x -= this.SPEED;
      }
    }
    if (this.playerNumber === 2) {
      if (keys.KeyS) {
        vector.y += this.SPEED;
      }
      if (keys.KeyW) {
        vector.y -= this.SPEED;
      }
      if (keys.KeyD) {
        vector.x += this.SPEED;
      }
      if (keys.KeyA) {
        vector.x -= this.SPEED;
      }
    }
    Body.setVelocity(this.body, vector);
  }
}
export class Tag extends Game {
  constructor(canvas) {
    super(canvas);
    this.options.updateStep = 10;
    this.engine = Engine.create({
      gravity: { scale: 0 },
    });
    this.player1 = new Player(1);
    this.player2 = new Player(2);
    this.ground = Bodies.rectangle(canvas.size / 2, 300, 400, 10, {
      isStatic: true,
      angle: 45,
      collisionFilter: {
        group: Catagories.map,
      },
    });
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      KeyW: false,
      KeyA: false,
      KeyS: false,
      KeyD: false,
    };
    Composite.add(this.engine.world, [
      this.player1.body,
      this.player2.body,
      this.ground,
    ]);
    this.afterInit();
  }

  update() {
    this.player1.update(this.keys);
    this.player2.update(this.keys);
    var deltaTime = this.updateTime - this.lastUpdate;
    var clamped = Common.clamp(deltaTime, 0, 30);
    Engine.update(this.engine, clamped);
  }

  draw() {
    var bodies = Composite.allBodies(this.engine.world);
    var ctx = this.canvas.getCanvas();
    ctx.beginPath();
    for (let i = 0; i < bodies.length; i++) {
      var vertices = bodies[i].vertices;
      ctx.moveTo(vertices[0].x, vertices[0].y);

      for (let j = 1; j < vertices.length; j++) {
        ctx.lineTo(vertices[j].x, vertices[j].y);
      }
      ctx.lineTo(vertices[0].x, vertices[0].y);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#999";
    ctx.stroke();
  }

  keyDownEvent(e) {
    if (e.code in this.keys) {
      this.keys[e.code] = true;
    }
  }
  keyUpEvent(e) {
    if (e.code in this.keys) {
      this.keys[e.code] = false;
    }
  }
}
