
/**
 * The Alien class represents a small mostly harmless enemy.
 */
class Alien extends GameEntity {
  /**
   * Creates a new alien.
   * @param {number=} x
   * @param {number=} y
   * @param {number=} z
   */
  constructor(x, y, z) {
    super(x, y, z);

    /**
     * Alien acceleration power in meters per second per second.
     * @type {number}
     */
    this.acceleration = 60.0;

    /**
     * Distance from player before aggro.
     * @type {number}
     */
    this.aggroRange = 15;

    /**
     * Alien color.
     * @type {number}
     */
    this.color = COLOR_ALIEN_GREEN;

    this.bounciness = 0.01;
  }

  /**
   * Updates the alien.
   * @override
   */
  update() {
    const waypoint = this.updateWaypoints();
    const dist = this.getDistanceToPlayer();
    if (dist < 1.5) {
      if (player.pos[1] > this.pos[1]) {
        this.health = 0;
        player.pos[1] = this.pos[1] + 2.0;
        player.jump();
        createExplosion(this.pos, this.color, 15);
      } else {
        player.health = 0;
        player.rendered = false;
        playerDie();
        createExplosion(player.pos, this.color);
      }
    } else if (dist < this.aggroRange) {
      // Walk toward player
      vec3.subtract(tempVec, player.pos, this.pos);
      tempVec[1] = 0;
      vec3.normalize(tempVec, tempVec);
      vec3.scaleAndAdd(this.velocity, this.velocity, tempVec, dt * this.acceleration);
    } else if (waypoint) {
      // Walk toward waypoint
      vec3.subtract(tempVec, waypoint, this.pos);
      vec3.normalize(tempVec, tempVec);
      vec3.scaleAndAdd(this.velocity, this.velocity, tempVec, dt * this.acceleration);
    }
    updateEntity(this);
  }

  /**
   * Renders the alien.
   * @override
   */
  render() {
    // Draw alien main body
    {
      const m = this.createSphere(this.color);
      mat4.translate(m, m, vec3.fromValues(0, 0.8, 0));
      mat4.scale(m, m, vec3.fromValues(0.8, 0.8, 0.7));
    }

    // Draw left eye
    {
      const m = this.createSphere(COLOR_BLACK);
      mat4.translate(m, m, vec3.fromValues(-0.25, .9, 0.7));
      mat4.rotateZ(m, m, -1);
      mat4.scale(m, m, vec3.fromValues(0.2, 0.1, 0.025));
    }

    // Draw right eye
    {
      const m = this.createSphere(COLOR_BLACK);
      mat4.translate(m, m, vec3.fromValues(0.25, .9, 0.7));
      mat4.rotateZ(m, m, 1);
      mat4.scale(m, m, vec3.fromValues(0.2, 0.1, 0.025));
    }
  }
}
