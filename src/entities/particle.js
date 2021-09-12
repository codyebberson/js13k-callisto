
/**
 * Projectile types.
 * @enum {number}
 */
const ProjectileType = {
  None: 0,
  Player: 1,
  Enemy: 2,
};

/**
 * The Particle class represents a purely visual entity.
 * Particles are used for:
 *   1) Floaties - small specks that rise slowly and fade away.
 *   2) Running dust - dust clouds when entities run around.
 *   3) Explosion particles - flying everywhere.
 */
class Particle extends GameEntity {
  /**
   * Creates a new particle.
   * @param {number=} x
   * @param {number=} y
   * @param {number=} z
   */
  constructor(x, y, z) {
    super(x, y, z);

    /** @type {number} */
    this.size = 0.2;

    /** @type {number} */
    this.deathRate = 100;

    /** @type {number} */
    this.color = COLOR_WHITE;

    /** @const {!vec3} */
    this.acceleration = vec3.create();

    /** @type {?vec3} */
    this.lightColor = null;

    /** @type {!ProjectileType} */
    this.projectile = ProjectileType.None;
  }

  /**
   * Updates the particle.
   * @override
   */
  update() {
    vec3.scaleAndAdd(this.velocity, this.velocity, this.acceleration, dt);
    vec3.scaleAndAdd(this.pos, this.pos, this.velocity, dt);
    this.health -= dt * this.deathRate;
  }

  /**
   * Renders the particle.
   * @override
   */
  render() {
    const radius = this.size * (this.health / 100);
    const m = this.createSphere(this.color);
    mat4.scale(m, m, vec3.fromValues(radius, radius, radius));

    if (this.lightColor) {
      addLight(this.pos, this.lightColor);
    }
  }
}
