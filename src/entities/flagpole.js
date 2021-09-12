
/**
 * The Flagpole class represents the flag goal of the level.
 */
class Flagpole extends GameEntity {
  /**
   * Creates a new flagpole.
   * @param {number=} x
   * @param {number=} y
   * @param {number=} z
   */
  constructor(x, y, z) {
    super(x, y, z);
    this.triggered = false;
  }
  /**
   * Updates the flagpole.
   * @override
   */
  update() {
    const dist = this.getDistanceToPlayer();
    if (coins === availableCoins && dist < 2.0 && !this.triggered) {
      playMusic(flagpoleSongData);
      bestTimes[level] = bestTimes[level] ? Math.min(bestTimes[level], gameTime) : gameTime;
      localStorage['callisto-times'] = JSON.stringify(bestTimes);
      addTrophy(`Level ${level}`, `${gameTime.toFixed(1)} sec`);
      stopJetpackSound();
      setMenu(winScreen);
      gameState = GameState.AFTER_LEVEL;
      this.triggered = true;
    }
  }

  /**
   * Renders the flagpole.
   * @override
   */
  render() {
    const r = (time % 1.0) * 2 * Math.PI;
    const y = 4.7 + 0.1 * Math.sin(r);

    // Main flag pole
    {
      const m = this.createSphere(COLOR_SILVER);
      mat4.translate(m, m, vec3.fromValues(0, 2.5, 0));
      mat4.scale(m, m, vec3.fromValues(0.2, 2.5, 0.2));
    }

    // Base
    {
      const m = this.createSphere(COLOR_SILVER);
      mat4.scale(m, m, vec3.fromValues(0.5, 0.5, 0.5));
    }

    // Red ball on top
    {
      const m = this.createSphere(COLOR_RED);
      mat4.translate(m, m, vec3.fromValues(0, y, 0));
      mat4.rotateY(m, m, r);
      mat4.scale(m, m, vec3.fromValues(0.5, 0.5, 0.5));
    }
  }
}
