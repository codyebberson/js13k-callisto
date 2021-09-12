
/**
 * Kang is the final boss.
 */
class Kang extends GameEntity {
  /**
   * Creates Kang.
   */
  constructor() {
    super(16, 5, 16);

    /**
     * The next time Kang will shoot.
     * When gameTime > nextShootTime, Kang shoots,
     * and then the time is reset.
     */
    this.nextShootTime = 0;
  }

  /**
   * Updates Kang.
   * @override
   */
  update() {
    // Face the player
    this.yaw = Math.atan2(player.pos[0] - this.pos[0], player.pos[2] - this.pos[2]);

    // Float up and down
    this.pos[1] = player.pos[1] + 6.0 + Math.sin(time * 2);
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
      projectile.pos[1] += 3.0;
      const target = vec3.fromValues(player.pos[0], player.pos[1] + 1, player.pos[2]);
      vec3.subtract(projectile.velocity, target, projectile.pos);
      vec3.normalize(projectile.velocity, projectile.velocity);
      vec3.scale(projectile.velocity, projectile.velocity, 40);
      entities.push(projectile);
      this.nextShootTime = gameTime + 5;
      playKangShootSound();
    }
  }

  /**
   * Renders the Kang.
   * @override
   */
  render() {
    mat4.identity(this.transformMatrix);
    mat4.translate(this.transformMatrix, this.transformMatrix, this.pos);
    mat4.rotateY(this.transformMatrix, this.transformMatrix, this.yaw);

    // Draw Kang main body
    {
      const m = this.createSphere(COLOR_ALIEN_GREEN);
      mat4.scale(m, m, vec3.fromValues(3, 7, 3));
    }

    // Draw white of eye
    {
      const m = this.createSphere(COLOR_KANG_EYE_YELLOW);
      mat4.translate(m, m, vec3.fromValues(0, 3, 1.2));
      mat4.scale(m, m, vec3.fromValues(2, 2, 2));
    }

    // Draw black of eye
    {
      const remaining = this.nextShootTime - gameTime;
      const charge = Math.min((5.0 - remaining) / 4.5, 1.0);
      const color = 0xFF333333 + charge * 0xCC;
      const m = this.createSphere(color);
      mat4.translate(m, m, vec3.fromValues(0, 3, 3));
      mat4.scale(m, m, vec3.fromValues(0.5, 1.2, 0.3));
    }

    // Draw tentacles
    for (let i = 0; i < 10; i++) {
      const m = this.createSphere(COLOR_ALIEN_GREEN);
      mat4.rotateY(m, m, i / 10 * Math.PI * 2);
      mat4.rotateX(m, m, 0.5 + 0.4 * Math.sin(time * 4 + i));
      mat4.translate(m, m, vec3.fromValues(0, -2, 4));
      mat4.scale(m, m, vec3.fromValues(0.5, 0.5, 4));
    }
  }
}
