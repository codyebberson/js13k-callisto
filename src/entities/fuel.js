
/**
 * The Fuel class represents a jetpack fuel that the player can pick up.
 */
class Fuel extends GameEntity {
  /**
   * Creates a new game entity.
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number=} amount
   */
  constructor(x, y, z, amount) {
    super(x, y, z);
    this.amount = amount || 30;
  }

  /**
   * Updates the Fuel.
   * @override
   */
  update() {
    const dist = this.getDistanceToPlayer();
    if (dist < 1.0) {
      // Increase player jetpack fuel
      player.fuel += this.amount;
      this.health = 0;
      this.amount = 0;
      playFuelSound();
    } else if (dist < 4) {
      // Move the Fuel toward the player
      this.pos[0] = 0.9 * this.pos[0] + 0.1 * player.pos[0];
      this.pos[1] = 0.9 * this.pos[1] + 0.1 * player.pos[1];
      this.pos[2] = 0.9 * this.pos[2] + 0.1 * player.pos[2];
    }
  }

  /**
   * Renders the Fuel.
   * @override
   */
  render() {
    const r = (time % 1.0) * 2 * Math.PI;
    const y = 1.5 + 0.2 * Math.sin(r);

    // Draw left jetpack
    {
      const m = this.createSphere(COLOR_DARK_SILVER);
      mat4.translate(m, m, vec3.fromValues(-0.24, y, 0));
      mat4.rotateY(m, m, r);
      mat4.scale(m, m, vec3.fromValues(0.3, 0.64, 0.3));
    }

    // Draw right jetpack
    {
      const m = this.createSphere(COLOR_DARK_SILVER);
      mat4.translate(m, m, vec3.fromValues(0.24, y, 0));
      mat4.rotateY(m, m, r);
      mat4.scale(m, m, vec3.fromValues(0.3, 0.64, 0.3));
    }
  }
}
