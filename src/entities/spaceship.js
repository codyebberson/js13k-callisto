
/**
 * The spaceship entity is used during the opening scene.
 */
class Spaceship extends GameEntity {
  /**
   * Renders the spaceship.
   * @override
   */
  render() {
    const white = COLOR_WHITE;
    const orange = COLOR_ORANGE;
    const silver = COLOR_DARK_SILVER;

    {
      // Main body
      const m = this.createSphere(white);
      mat4.scale(m, m, vec3.fromValues(5, 1, 1.3));
    }

    {
      // Cockpit
      const m = this.createSphere(orange);
      mat4.translate(m, m, vec3.fromValues(1.5, .5, 0));
      mat4.scale(m, m, vec3.fromValues(2, .6, .8));
    }

    {
      // Left wing
      const m = this.createSphere(white);
      mat4.translate(m, m, vec3.fromValues(0, 0, 2));
      mat4.rotateY(m, m, .5);
      mat4.scale(m, m, vec3.fromValues(3, 0.3, 1));
    }

    {
      // Right wing
      const m = this.createSphere(white);
      mat4.translate(m, m, vec3.fromValues(0, 0, -2));
      mat4.rotateY(m, m, -.5);
      mat4.scale(m, m, vec3.fromValues(3, 0.3, 1));
    }

    {
      // Left engine
      const m = this.createSphere(silver);
      mat4.translate(m, m, vec3.fromValues(-3, 0.3, 0.7));
      mat4.scale(m, m, vec3.fromValues(3, .5, .5));
    }

    {
      // Right engine
      const m = this.createSphere(silver);
      mat4.translate(m, m, vec3.fromValues(-3, 0.3, -0.7));
      mat4.scale(m, m, vec3.fromValues(3, .5, .5));
    }
  }
}
