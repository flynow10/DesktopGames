export class Vector {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public add(vector: Vector): Vector {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  public addScalar(scalar: number): Vector {
    return new Vector(this.x + scalar, this.y + scalar);
  }

  public sub(vector: Vector): Vector {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  public subScalar(scalar: number): Vector {
    return new Vector(this.x - scalar, this.y - scalar);
  }

  public mul(vector: Vector): Vector {
    return new Vector(this.x * vector.x, this.y * vector.y);
  }

  public mulScalar(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  public div(vector: Vector): Vector {
    return new Vector(this.x / vector.x, this.y / vector.y);
  }

  public divScalar(scalar: number): Vector {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public normalize(): Vector {
    const length = this.length();
    return new Vector(this.x / length, this.y / length);
  }

  public distance(vector: Vector): number {
    return this.sub(vector).length();
  }

  public angle(): number {
    return Math.atan2(this.y, this.x);
  }

  public angleTo(vector: Vector): number {
    return Math.atan2(vector.y - this.y, vector.x - this.x);
  }

  public rotate(angle: number): Vector {
    return new Vector(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle)
    );
  }

  public lerp(vector: Vector, t: number): Vector {
    return new Vector(
      this.x + (vector.x - this.x) * t,
      this.y + (vector.y - this.y) * t
    );
  }

  public cubicBezierInterpolation(
    end: Vector,
    c1: Vector,
    c2: Vector,
    t: number
  ): Vector {
    var r = 1 - t;
    var tt = t * t;
    var rr = r * r;
    var rrr = rr * r;
    var ttt = tt * t;

    var p = this.mulScalar(rrr);
    p = p.add(c2.mulScalar(3 * r * tt));
    p = p.add(c1.mulScalar(3 * rr * t));
    p = p.add(end.mulScalar(ttt));
    return p;
  }

  public equals(vector: Vector): boolean {
    return this.x === vector.x && this.y === vector.y;
  }

  public clone(): Vector {
    return new Vector(this.x, this.y);
  }

  public toString(): string {
    return `(${this.x}, ${this.y})`;
  }

  public static fromAngle(angle: number): Vector {
    return new Vector(Math.cos(angle), Math.sin(angle));
  }

  public static random(): Vector {
    return new Vector(Math.random(), Math.random());
  }

  public static randomRange(min: number, max: number): Vector {
    return new Vector(
      Math.random() * (max - min) + min,
      Math.random() * (max - min) + min
    );
  }

  public static randomCircle(): Vector {
    const angle = Math.random() * Math.PI * 2;
    return new Vector(Math.cos(angle), Math.sin(angle));
  }

  public static randomCircleRange(min: number, max: number): Vector {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * (max - min) + min;
    return new Vector(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }

  public static zero(): Vector {
    return new Vector(0, 0);
  }

  public static one(): Vector {
    return new Vector(1, 1);
  }

  public static up(): Vector {
    return new Vector(0, -1);
  }

  public static down(): Vector {
    return new Vector(0, 1);
  }

  public static left(): Vector {
    return new Vector(-1, 0);
  }

  public static right(): Vector {
    return new Vector(1, 0);
  }

  public static dot(vector1: Vector, vector2: Vector): number {
    return vector1.x * vector2.x + vector1.y * vector2.y;
  }

  public static cross(vector1: Vector, vector2: Vector): number {
    return vector1.x * vector2.y - vector1.y * vector2.x;
  }

  public static angleBetween(vector1: Vector, vector2: Vector): number {
    return Math.acos(Vector.dot(vector1.normalize(), vector2.normalize()));
  }
}
