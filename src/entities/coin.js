
/**
 * The Coin class represents a gold coin that the player can pick up.
 */
class Coin extends GameEntity {
  /**
   * Updates the coin.
   * @override
   */
  update() {
    const dist = this.getDistanceToPlayer();
    if (dist < 1.0) {
      // Give the player a coin
      this.health = 0;
      coins++;
      coinSequence++;
      lastCoinTime = gameTime;
      playCoinSound();
    } else if (dist < 3) {
      // Move the coin toward the player
      this.pos[0] = 0.9 * this.pos[0] + 0.1 * player.pos[0];
      this.pos[1] = 0.9 * this.pos[1] + 0.1 * player.pos[1];
      this.pos[2] = 0.9 * this.pos[2] + 0.1 * player.pos[2];
    }
  }

  /**
   * Renders the coin.
   * @override
   */
  render() {
    const r = (time % 1.0) * 2 * Math.PI;
    const y = 1.5 + 0.2 * Math.sin(r);
    const m = this.createSphere(COLOR_YELLOW);
    mat4.translate(m, m, vec3.fromValues(0, y, 0));
    mat4.rotateY(m, m, r);
    mat4.scale(m, m, vec3.fromValues(0.5, 0.5, 0.1));
  }
}
