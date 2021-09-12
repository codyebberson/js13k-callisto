
const mysteryColors = [
  0xFFFF3030,
  0xFF30FF00,
  0xFF3030FF,
  0xFFFFFF30,
  0xFFFF30FF,
  0xFF30FFFF,
];

/**
 * A Mystery cube flies through the final credits.
 */
class Mystery extends GameEntity {
  /**
   * Creates a new particle.
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} sx
   * @param {number} sy
   * @param {number} sz
   */
  constructor(x, y, z, sx, sy, sz) {
    super(x, y, z);

    /** @type {number} */
    this.deathRate = 20;

    /** @type {number} */
    this.color = mysteryColors[(Math.random() * 6) | 0];

    /** @const {!vec3} */
    this.scale = vec3.fromValues(sx, sy, sz);
  }

  /**
   * Updates the particle.
   * @override
   */
  update() {
    vec3.scaleAndAdd(this.pos, this.pos, this.velocity, dt);
    this.health -= dt * this.deathRate;
  }

  /**
   * Renders the particle.
   * @override
   */
  render() {
    const m = buffers[DYNAMIC_CUBES].addInstance(this.color);
    mat4.multiply(m, m, this.transformMatrix);
    mat4.scale(m, m, this.scale);
  }
}
