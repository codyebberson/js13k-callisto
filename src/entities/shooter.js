
/**
 * Shooter is a mid level shooting enemy.
 */
class Shooter extends GameEntity {
  /**
   * Creates Shooter.
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} yaw
   * @param {number} nextShootTime
   */
  constructor(x, y, z, yaw, nextShootTime) {
    super(x, y, z);

    this.yaw = yaw;

    /**
     * The next time Shooter will shoot.
     * When gameTime > nextShootTime, Shooter shoots,
     * and then the time is reset.
     */
    this.nextShootTime = nextShootTime;
  }

  /**
   * Updates Shooter.
   * @override
   */
  update() {
    // Float up and down
    this.pos[1] += dt * 0.5 * Math.sin(time * 2);
    this.velocity[1] = 0;

    if (gameState === GameState.PLAYING &&
      gameTime > this.nextShootTime &&
      player.health > 0) {
      const projectile = new Particle();
      projectile.projectile = ProjectileType.Enemy;
      projectile.color = 0xFF4040FF;
      projectile.deathRate = 10;
      projectile.lightColor = vec3.fromValues(1.0, 0.0, 0.0);
      projectile.size = 0.5;
      vec3.copy(projectile.pos, this.pos);
      projectile.pos[1] += 0.75;
      vec3.rotateY(projectile.velocity, forward, origin, this.yaw);
      vec3.scale(projectile.velocity, projectile.velocity, 20);
      entities.push(projectile);
      this.nextShootTime = gameTime + 5;
      playKangShootSound();
    }
  }

  /**
   * Renders the alien.
   * @override
   */
  render() {
    mat4.identity(this.transformMatrix);
    mat4.translate(this.transformMatrix, this.transformMatrix, this.pos);
    mat4.rotateY(this.transformMatrix, this.transformMatrix, this.yaw);

    // Draw main body
    {
      const m = this.createSphere(COLOR_ALIEN_GREEN);
      mat4.translate(m, m, vec3.fromValues(0, 0.8, 0));
      mat4.scale(m, m, vec3.fromValues(0.5, 0.5, 0.5));
    }

    // Draw the metal cradle
    {
      const m = this.createSphere(COLOR_SILVER);
      mat4.translate(m, m, vec3.fromValues(0, 0.4, 0));
      mat4.scale(m, m, vec3.fromValues(0.5, 0.5, 0.5));
    }

    // Draw the jet
    {
      const m = this.createSphere(0xFF00A0FF);
      mat4.translate(m, m, vec3.fromValues(0, -.2, 0));
      mat4.scale(m, m, vec3.fromValues(0.3, 0.3, 0.3));
    }

    // Draw left eye
    {
      const m = this.createSphere(COLOR_BLACK);
      mat4.translate(m, m, vec3.fromValues(-0.25, 1, 0.4));
      mat4.rotateZ(m, m, -1);
      mat4.scale(m, m, vec3.fromValues(0.15, 0.1, 0.1));
    }

    // Draw right eye
    {
      const m = this.createSphere(COLOR_BLACK);
      mat4.translate(m, m, vec3.fromValues(0.25, 1, 0.4));
      mat4.rotateZ(m, m, 1);
      mat4.scale(m, m, vec3.fromValues(0.15, 0.1, 0.1));
    }
  }
}
