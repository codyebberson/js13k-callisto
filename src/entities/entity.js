
/**
 * The GameEntity class represents an entity in the game.
 */
class GameEntity {
  /**
   * Creates a new game entity.
   * @param {number=} x
   * @param {number=} y
   * @param {number=} z
   */
  constructor(x, y, z) {
    /** @const {!vec3} */
    this.pos = vec3.fromValues(x || 0, y || 0, z || 0);

    /** @const {!vec3} */
    this.velocity = vec3.create();

    /** @const {!mat4} */
    this.transformMatrix = mat4.create();

    /** @type {number} */
    this.health = 100;

    /** @type {number} */
    this.yaw = 0;

    /** @type {boolean} */
    this.accelerating = false;

    /** @type {number} */
    this.groundedTime = 0;

    /** @type {?Platform} */
    this.groundedPlatform = null;

    /** @type {number} */
    this.shootTime = 0;

    /** @type {number} */
    this.bounciness = 0.0;

    /** @type {!Array.<!vec3>} */
    this.waypoints = [];

    /** @type {number} */
    this.waypointIndex = 0;

    /** @type {boolean} */
    this.rendered = true;
  }

  /**
   * Returns true if the entity is on the ground.
   * @return {boolean}
   */
  isGrounded() {
    return this.groundedTime === gameTime;
  }

  /**
   * Returns true if the entity can jump.
   * @return {boolean}
   */
  canShoot() {
    return (gameTime - this.shootTime) > 0.5;
  }

  /**
   * Launches the player.
   */
  jump() {
    this.velocity[1] = JUMP_POWER;
    this.groundedTime = 0;
    this.groundedPlatform = null;
    if (this === player) {
      playJumpSound();
    }
  }

  /**
   * Updates the entity.
   * By default, does nothing.
   */
  update() {
    // Subclasses should override
  }

  /**
   * Renders the entity.
   * By default, does nothing.
   * Static entities can use this default implementation.
   */
  render() {
    // Subclasses should override
  }

  /**
   * Returns the distance to the player.
   * @return {number} Distance to the player.
   */
  getDistanceToPlayer() {
    if (player.health <= 0) {
      return 1000;
    }
    return vec3.distance(player.pos, this.pos);
  }

  /**
   * Updates waypoints.
   * Silently ignores if no waypoints are setup.
   * @return {?vec3} The current waypoint if available.
   */
  updateWaypoints() {
    if (this.waypoints.length === 0) {
      return null;
    }
    const waypoint = this.waypoints[this.waypointIndex];
    if (vec3.distance(this.pos, waypoint) < 0.1) {
      this.waypointIndex = (this.waypointIndex + 1) % this.waypoints.length;
    }
    return waypoint;
  }

  /**
   * Sets up the default transform matrix.
   */
  setupTransformMatrix() {
    const theta = time * 20;
    const speed = Math.hypot(this.velocity[0], this.velocity[2]);
    const bodyOffsetY = this.bounciness * Math.sin(theta) * speed;
    const bodyRotationX = 0.02 * speed;

    vec3.copy(tempVec, this.pos);

    if (this.isGrounded()) {
      tempVec[1] += bodyOffsetY;
    }

    mat4.identity(this.transformMatrix);
    mat4.translate(this.transformMatrix, this.transformMatrix, tempVec);
    mat4.rotateY(this.transformMatrix, this.transformMatrix, this.yaw);
    mat4.rotateX(this.transformMatrix, this.transformMatrix, bodyRotationX);
  }

  /**
   * Creates a new sphere transformed to instance space.
   * @param {number} color
   * @return {!mat4}
   */
  createSphere(color) {
    const m = buffers[DYNAMIC_SPHERES].addInstance(color);
    mat4.multiply(m, m, this.transformMatrix);
    return m;
  }
}
