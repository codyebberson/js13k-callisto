
/**
 * Hero
 */
class Hero extends GameEntity {
  /**
   * Creates a new astronaut / hero.
   * @param {number=} x
   * @param {number=} y
   * @param {number=} z
   */
  constructor(x, y, z) {
    super(x, y, z);
    this.bounciness = 0.01;
    this.fuel = 100;
    this.jetpack = false;
  }

  /**
   * Renders the player model.
   * @override
   */
  render() {
    let leftArmRotationX = 0.0;
    let leftArmRotationZ = 1.2;
    let rightArmRotationX = 0.0;
    let rightArmRotationZ = -1.2;
    let leftLegRotationX = 0;
    let rightLegRotationX = 0;

    if (!this.isGrounded() || gameState === GameState.AFTER_LEVEL) {
      // Jumping = arms up
      leftArmRotationZ = -0.5;
      rightArmRotationZ = 0.5;
    } else if (this.accelerating) {
      // Running = arms back
      const r = (gameTime % 0.8) / 0.8 * 2 * Math.PI;
      rightLegRotationX = leftArmRotationX = 0.07 * Math.hypot(this.velocity[0], this.velocity[2]) * Math.sin(r);
      rightArmRotationX = leftLegRotationX = -leftArmRotationX;
      leftArmRotationZ = 1.2;
      rightArmRotationZ = -1.2;
    }

    // Draw face
    {
      const m = this.createSphere(COLOR_ORANGE);
      mat4.translate(m, m, vec3.fromValues(0, 1.8, 0));
      mat4.scale(m, m, vec3.fromValues(0.38, 0.38, 0.38));
    }

    // Draw helmet
    {
      const m = this.createSphere(COLOR_WHITE);
      mat4.translate(m, m, vec3.fromValues(0, 1.8, -0.08));
      mat4.scale(m, m, vec3.fromValues(0.45, 0.5, 0.38));
    }

    // Draw stomach
    {
      const m = this.createSphere(COLOR_WHITE);
      mat4.translate(m, m, vec3.fromValues(0, 1.05, 0));
      mat4.scale(m, m, vec3.fromValues(0.3, 0.47, 0.27));
    }

    // Draw left jetpack
    {
      const m = this.createSphere(COLOR_DARK_SILVER);
      mat4.translate(m, m, vec3.fromValues(-0.12, 1.2, -0.35));
      mat4.scale(m, m, vec3.fromValues(0.15, 0.32, 0.15));
    }

    // Draw right jetpack
    {
      const m = this.createSphere(COLOR_DARK_SILVER);
      mat4.translate(m, m, vec3.fromValues(0.12, 1.2, -0.35));
      mat4.scale(m, m, vec3.fromValues(0.15, 0.32, 0.15));
    }

    if (this.jetpack) {
      const m = this.createSphere(0xFF00A0FF);
      mat4.translate(m, m, vec3.fromValues(0, 0.9, -0.35));
      mat4.scale(m, m, vec3.fromValues(0.2, 0.2, 0.2));
      addLight(vec3.fromValues(this.pos[0], this.pos[1]+1, this.pos[2]), vec3.fromValues(1, 0.75, 0));
    }

    // Draw left arm
    {
      const m = this.createSphere(COLOR_WHITE);
      mat4.translate(m, m, vec3.fromValues(-.3, 1.4, 0));
      mat4.rotateX(m, m, leftArmRotationX);
      mat4.rotateZ(m, m, leftArmRotationZ);
      mat4.translate(m, m, vec3.fromValues(-.4, 0, 0));
      mat4.scale(m, m, vec3.fromValues(0.4, 0.16, 0.16));
    }

    // Draw right arm
    {
      const m = this.createSphere(COLOR_WHITE);
      mat4.translate(m, m, vec3.fromValues(0.3, 1.4, 0));
      mat4.rotateX(m, m, rightArmRotationX);
      mat4.rotateZ(m, m, rightArmRotationZ);
      mat4.translate(m, m, vec3.fromValues(.4, 0, 0));
      mat4.scale(m, m, vec3.fromValues(0.4, 0.16, 0.16));
    }

    // Draw left leg
    {
      const m = this.createSphere(COLOR_WHITE);
      mat4.translate(m, m, vec3.fromValues(0.0, 1.1, 0.0));
      mat4.rotateX(m, m, leftLegRotationX);
      mat4.translate(m, m, vec3.fromValues(-0.21, -0.6, 0.0));
      mat4.scale(m, m, vec3.fromValues(0.18, 0.6, 0.18));
    }

    // Draw right leg
    {
      const m = this.createSphere(COLOR_WHITE);
      mat4.translate(m, m, vec3.fromValues(0, 1.1, 0.0));
      mat4.rotateX(m, m, rightLegRotationX);
      mat4.translate(m, m, vec3.fromValues(0.21, -0.6, 0.0));
      mat4.scale(m, m, vec3.fromValues(0.18, 0.6, 0.18));
    }
  }
}
