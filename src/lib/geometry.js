
/**
 * Builds a rounded cube.
 * @param {number} n Number of quads per axis per face.
 * @param {number} maxRadius Maximum distance of a point from the origin.
 * @return {!Float32Array}
 */
const buildRoundedCube = (n, maxRadius) => {
  // Output data
  const data = [];

  // The 8 corners of the unit cube
  const p1 = vec3.fromValues(-1, 1, -1);
  const p2 = vec3.fromValues(1, 1, -1);
  const p3 = vec3.fromValues(1, 1, 1);
  const p4 = vec3.fromValues(-1, 1, 1);
  const p5 = vec3.fromValues(-1, -1, -1);
  const p6 = vec3.fromValues(1, -1, -1);
  const p7 = vec3.fromValues(1, -1, 1);
  const p8 = vec3.fromValues(-1, -1, 1);

  // Temp variables for face edges
  const di = vec3.create();
  const dj = vec3.create();

  // Temp variables for 4 corners of a single quad
  const tmp1 = vec3.create();
  const tmp2 = vec3.create();
  const tmp3 = vec3.create();
  const tmp4 = vec3.create();

  /**
   * Builds a rounded face.
   * @param {!vec3} origin
   * @param {!vec3} topRight
   * @param {!vec3} bottomLeft
   */
  const buildFace = (origin, topRight, bottomLeft) => {
    vec3.subtract(di, topRight, origin);
    vec3.subtract(dj, bottomLeft, origin);

    /**
     * Builds a point for the given i and j.
     * @param {!vec3} out
     * @param {number} i
     * @param {number} j
     */
    const buildPoint = (out, i, j) => {
      vec3.scaleAndAdd(out, origin, di, i / n);
      vec3.scaleAndAdd(out, out, dj, j / n);
      const len = vec3.magnitude(out);
      if (len > maxRadius) {
        vec3.scale(out, out, maxRadius / len);
      }
    };

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        buildPoint(tmp1, i, j);
        buildPoint(tmp2, i + 1, j);
        buildPoint(tmp3, i + 1, j + 1);
        buildPoint(tmp4, i, j + 1);
        addQuad(data, tmp1, tmp2, tmp3, tmp4);
      }
    }
  };

  // Top
  buildFace(p1, p2, p4);

  // Bottom
  buildFace(p8, p7, p5);

  // Back / South
  buildFace(p2, p1, p6);

  // Front / North
  buildFace(p4, p3, p8);

  // Left / West
  buildFace(p1, p4, p5);

  // Right / East
  buildFace(p3, p2, p7);

  return new Float32Array(data);
};

/**
 * Adds a quad to the buffer set.
 * @param {!Array.<number>} data
 * @param {!vec3} p1
 * @param {!vec3} p2
 * @param {!vec3} p3
 * @param {!vec3} p4
 */
const addQuad = (data, p1, p2, p3, p4) => {
  addTriangle(data, p1, p2, p3);
  addTriangle(data, p1, p3, p4);
};

/**
 * Adds a triangle to the buffer set.
 * @param {!Array.<number>} data
 * @param {!vec3} p1
 * @param {!vec3} p2
 * @param {!vec3} p3
 */
const addTriangle = (data, p1, p2, p3) => {
  addPoint(data, p1);
  addPoint(data, p2);
  addPoint(data, p3);
};

/**
 * Adds a point
 * @param {!Array.<number>} data
 * @param {!vec3} p
 * @return {number}
 */
const addPoint = (data, p) => data.push(...p);
