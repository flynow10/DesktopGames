export class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /* Vector Math */
  magnitude() {
    return Math.hypot(this.x, this.y);
  }

  normalize() {
    const len = Math.max(1e-5, Math.hypot(this.x, this.y));
    return new Vector(this.x / len, this.y / len);
  }

  normalizeIfGreaterOne() {
    const len = Math.max(1, Math.hypot(this.x, this.y));
    return new Vector(this.x / len, this.y / len);
  }

  /**
   * @param {Vector} vector
   */
  direction(vector) {
    return new Vector(vector.x - this.x, vector.y - this.y);
  }

  /**
   * @param {Vector} vector
   */
  normalizedDirection(vector) {
    const dx = vector.x - this.x;
    const dy = vector.y - this.y;
    const len = Math.max(1e-5, Math.hypot(dx, dy));
    return new Vector(dx / len, dy / len);
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  /**
   * @param {Vector} vector
   */
  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  /**
   * @param {Vector} vector
   */
  addInplace(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  addScalar(scalar) {
    return new Vector(this.x + scalar, this.y + scalar);
  }

  addScalars(scalarX, scalarY) {
    return new Vector(this.x + scalarX, this.y + scalarY);
  }

  inverse() {
    return new Vector(-this.x, -this.y);
  }

  /**
   * @param {Vector} vector
   */
  sub(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  /**
   * @param {Vector} vector
   */
  subInplace(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  subScalar(scalar) {
    return new Vector(this.x - scalar, this.y - scalar);
  }

  subScalars(scalarX, scalarY) {
    return new Vector(this.x - scalarX, this.y - scalarY);
  }

  /**
   * @param {Vector} vector
   */
  mul(vector) {
    return new Vector(this.x * vector.x, this.y * vector.y);
  }

  rotate(angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  rotateAroundPoint(point, angle) {
    return this.sub(point).rotate(angle).add(point);
  }

  /**
   * @param {0|90|180|270|360} angle
   */
  rotateFast(angle) {
    switch (angle) {
      case 0:
      case 360:
        return this;
      case 90:
        return new Vector(-this.y, this.x);
      case 180:
        return new Vector(-this.x, -this.y);
      case 270:
        return new Vector(this.y, -this.x);
      default:
        throw new Error("Invalid angle for fast rotation");
    }
  }

  rotateAroundPointFast(point, angle) {
    return this.sub(point).rotateFast(angle).add(point);
  }

  /**
   * @param {Vector} vector
   */
  multiplyInplace(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  }

  multiplyScalar(scalar) {
    return new Vector(scalar * this.x, scalar * this.y);
  }

  multiplyScalars(scalarX, scalarY) {
    return new Vector(this.x * scalarX, this.y * scalarY);
  }

  /**
   * @param {Number} direction in deg
   * @param {Number} magnitude
   */
  static fromDirMag(direction, magnitude) {
    var degToRad = Math.PI / 180;
    return new Vector(
      magnitude * Math.cos(direction * degToRad),
      magnitude * Math.sin(direction * degToRad)
    );
  }

  /* Coordinate Math */
  /**
   * @param {Vector} vector
   */
  distance(vector) {
    return Math.hypot(this.x - vector.x, this.y - vector.y);
  }
}
