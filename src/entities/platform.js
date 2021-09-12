
/**
 * The Platform class represents something that other entities can stand on.
 * Platforms can be stationary or moving.
 */
class Platform extends GameEntity {
  /**
   * Creates a new particle.
   * @param {number=} x
   * @param {number=} y
   * @param {number=} z
   */
  constructor(x, y, z) {
    super(x, y, z);

    /** @type {number} */
    this.color = COLOR_SILVER;

    /** @const {!vec3} */
    this.scale = vec3.fromValues(1, 1, 1);

    /** @type {!Array.<!vec3>} */
    this.waypoints = [];

    /** @type {number} */
    this.waypointIndex = 0;
  }

  /**
   * Updates the platform.
   * @override
   */
  update() {
    const waypoint = this.updateWaypoints();
    if (waypoint) {
      vec3.subtract(this.velocity, waypoint, this.pos);
      vec3.normalize(this.velocity, this.velocity);
      vec3.scale(this.velocity, this.velocity, 6.0);
      vec3.scaleAndAdd(this.pos, this.pos, this.velocity, dt);
    }
  }

  /**
   * Renders the platform.
   * @override
   */
  render() {
    if (this.waypoints.length > 0) {
      // Draw lift
      {
        // Draw yellow base
        const m = buffers[DYNAMIC_CUBES].addInstance(COLOR_YELLOW);
        mat4.multiply(m, m, this.transformMatrix);
        mat4.scale(m, m, this.scale);
      }
      {
        // Black center stripe
        const m = buffers[DYNAMIC_CUBES].addInstance(COLOR_BLACK);
        mat4.multiply(m, m, this.transformMatrix);
        mat4.rotateY(m, m, Math.PI / 4);
        mat4.scale(m, m, vec3.fromValues(2.5, 0.31, 0.32));
      }
      {
        // Left corner stripe
        const m = buffers[DYNAMIC_CUBES].addInstance(COLOR_BLACK);
        mat4.multiply(m, m, this.transformMatrix);
        mat4.rotateY(m, m, Math.PI / 4);
        mat4.translate(m, m, vec3.fromValues(0, 0, -1.2));
        mat4.scale(m, m, vec3.fromValues(1.35, 0.31, 0.32));
      }
      {
        // Right corner stripe
        const m = buffers[DYNAMIC_CUBES].addInstance(COLOR_BLACK);
        mat4.multiply(m, m, this.transformMatrix);
        mat4.rotateY(m, m, Math.PI / 4);
        mat4.translate(m, m, vec3.fromValues(0, 0, 1.2));
        mat4.scale(m, m, vec3.fromValues(1.35, 0.31, 0.32));
      }

      {
        // South border
        const m = buffers[DYNAMIC_CUBES].addInstance(COLOR_BLACK);
        mat4.multiply(m, m, this.transformMatrix);
        mat4.translate(m, m, vec3.fromValues(0, 0, -1.82));
        mat4.scale(m, m, vec3.fromValues(2.04, 0.32, 0.2));
      }
      {
        // North border
        const m = buffers[DYNAMIC_CUBES].addInstance(COLOR_BLACK);
        mat4.multiply(m, m, this.transformMatrix);
        mat4.translate(m, m, vec3.fromValues(0, 0, 1.82));
        mat4.scale(m, m, vec3.fromValues(2.04, 0.32, 0.2));
      }
      {
        // West border
        const m = buffers[DYNAMIC_CUBES].addInstance(COLOR_BLACK);
        mat4.multiply(m, m, this.transformMatrix);
        mat4.translate(m, m, vec3.fromValues(-1.82, 0, 0));
        mat4.scale(m, m, vec3.fromValues(0.2, 0.32, 2.04));
      }
      {
        // East border
        const m = buffers[DYNAMIC_CUBES].addInstance(COLOR_BLACK);
        mat4.multiply(m, m, this.transformMatrix);
        mat4.translate(m, m, vec3.fromValues(1.82, 0, 0));
        mat4.scale(m, m, vec3.fromValues(0.2, 0.32, 2.04));
      }
    } else {
      // Draw normal platform
      const m = buffers[DYNAMIC_CUBES].addInstance(this.color);
      mat4.multiply(m, m, this.transformMatrix);
      mat4.scale(m, m, this.scale);
    }
  }
}
