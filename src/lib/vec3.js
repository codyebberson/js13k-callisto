// glMatrix - vec3
// https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/vec3.js

/** @typedef {!Float32Array} */
const vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @return {!vec3} a new 3D vector
 */
vec3.create = () => new Float32Array(3);

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {!vec3} a vector to clone
 * @return {!vec3} a new 3D vector
 */
vec3.clone = (a) => new Float32Array(a);

/**
 * Calculates the magnitude of a vec3
 *
 * @param {!vec3} a vector to calculate length of
 * @return {number} length of a
 */
vec3.magnitude = (a) => Math.hypot(a[0], a[1], a[2]);

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {number} x X component
 * @param {number} y Y component
 * @param {number} z Z component
 * @return {!vec3} a new 3D vector
 * @noinline
 */
vec3.fromValues = (x, y, z) => new Float32Array([x, y, z]);

/**
 * Copy the values from one vec3 to another
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a the source vector
 * @return {!vec3} out
 */
vec3.copy = (out, a) => {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {!vec3} out the receiving vector
 * @param {number} x X component
 * @param {number} y Y component
 * @param {number} z Z component
 * @return {!vec3} out
 */
vec3.set = (out, x, y, z) => {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
};

/**
 * Adds two vec3's
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a the first operand
 * @param {!vec3} b the second operand
 * @return {!vec3} out
 */
vec3.add = (out, a, b) => {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a the first operand
 * @param {!vec3} b the second operand
 * @return {!vec3} out
 */
vec3.subtract = (out, a, b) => {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
};

/**
 * Multiplies two vec3's
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a the first operand
 * @param {!vec3} b the second operand
 * @return {!vec3} out
 */
vec3.multiply = (out, a, b) => {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
};

/**
 * Divides two vec3's
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a the first operand
 * @param {!vec3} b the second operand
 * @return {!vec3} out
 */
vec3.divide = (out, a, b) => {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
};

/**
 * Math.ceil the components of a vec3
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a vector to ceil
 * @return {!vec3} out
 */
vec3.ceil = (out, a) => {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
};

/**
 * Returns the minimum of two vec3's
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a the first operand
 * @param {!vec3} b the second operand
 * @return {!vec3} out
 */
vec3.min = (out, a, b) => {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a the first operand
 * @param {!vec3} b the second operand
 * @return {!vec3} out
 */
vec3.max = (out, a, b) => {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a the vector to scale
 * @param {number} b amount to scale the vector by
 * @return {!vec3} out
 */
vec3.scale = (out, a, b) => {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a the first operand
 * @param {!vec3} b the second operand
 * @param {number} scale the amount to scale b by before adding
 * @return {!vec3} out
 */
vec3.scaleAndAdd = (out, a, b, scale) => {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {!vec3} a the first operand
 * @param {!vec3} b the second operand
 * @return {number} distance between a and b
 */
vec3.distance = (a, b) => {
  const x = b[0] - a[0];
  const y = b[1] - a[1];
  const z = b[2] - a[2];
  return Math.hypot(x, y, z);
};

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {!vec3} a the first operand
 * @param {!vec3} b the second operand
 * @return {number} squared distance between a and b
 */
vec3.squaredDistance = (a, b) => {
  const x = b[0] - a[0];
  const y = b[1] - a[1];
  const z = b[2] - a[2];
  return x * x + y * y + z * z;
};

/**
 * Calculates the squared length of a vec3
 *
 * @param {!vec3} a vector to calculate squared length of
 * @return {number} squared length of a
 */
vec3.squaredLength = (a) => {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  return x * x + y * y + z * z;
};

/**
 * Negates the components of a vec3
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a vector to negate
 * @return {!vec3} out
 */
vec3.negate = (out, a) => {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
};

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a vector to invert
 * @return {!vec3} out
 */
vec3.inverse = (out, a) => {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
};

/**
 * Normalize a vec3
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a vector to normalize
 * @return {!vec3} out
 */
vec3.normalize = (out, a) => {
  const len = vec3.magnitude(a);
  return len > 0 ? vec3.scale(out, a, 1 / len) : vec3.copy(out, a);
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {!vec3} a the first operand
 * @param {!vec3} b the second operand
 * @return {number} dot product of a and b
 */
vec3.dot = (a, b) => {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a the first operand
 * @param {!vec3} b the second operand
 * @return {!vec3} out
 */
vec3.cross = (out, a, b) => {
  const ax = a[0]; const ay = a[1]; const az = a[2];
  const bx = b[0]; const by = b[1]; const bz = b[2];

  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} origin the relative origin point for a and b
 * @param {!vec3} a the first operand
 * @param {!vec3} b the second operand
 * @return {!vec3} out
 */
vec3.cross2 = (out, origin, a, b) => {
  const ax = a[0] - origin[0]; const ay = a[1] - origin[1]; const az = a[2] - origin[2];
  const bx = b[0] - origin[0]; const by = b[1] - origin[1]; const bz = b[2] - origin[2];

  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a the first operand
 * @param {!vec3} b the second operand
 * @param {number} t interpolation amount, in the range [0-1], between the two inputs
 * @return {!vec3} out
 */
vec3.lerp = (out, a, b, t) => {
  out[0] = a[0] + t * (b[0] - a[0]);
  out[1] = a[1] + t * (b[1] - a[1]);
  out[2] = a[2] + t * (b[2] - a[2]);
  return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {!vec3} out the receiving vector
 * @param {!vec3} a the vector to transform
 * @param {!mat4} m matrix to transform with
 * @return {!vec3} out
 */
vec3.transformMat4 = (out, a, m) => {
  const x = a[0]; const y = a[1]; const z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
};

/**
 * Rotate a 3D vector around the x-axis
 * @param {!vec3} out The receiving vec3
 * @param {!vec3} a The vec3 point to rotate
 * @param {!vec3} b The origin of the rotation
 * @param {number} c The angle of rotation
 * @return {!vec3} out
 */
vec3.rotateX = (out, a, b, c) => {
  const p = []; const r = [];
  // Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  // perform rotation
  r[0] = p[0];
  r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
  r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);

  // translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
};

/**
 * Rotate a 3D vector around the y-axis
 * @param {!vec3} out The receiving vec3
 * @param {!vec3} a The vec3 point to rotate
 * @param {!vec3} b The origin of the rotation
 * @param {number} c The angle of rotation
 * @return {!vec3} out
 */
vec3.rotateY = (out, a, b, c) => {
  const p = []; const r = [];
  // Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  // perform rotation
  r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);

  // translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
};

/**
 * Rotate a 3D vector around the z-axis
 * @param {!vec3} out The receiving vec3
 * @param {!vec3} a The vec3 point to rotate
 * @param {!vec3} b The origin of the rotation
 * @param {number} c The angle of rotation
 * @return {!vec3} out
 */
vec3.rotateZ = (out, a, b, c) => {
  const p = []; const r = [];
  // Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  // perform rotation
  r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
  r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
  r[2] = p[2];

  // translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
};

/**
 * Get the angle between two 3D vectors
 * @param {!vec3} a The first operand
 * @param {!vec3} b The second operand
 * @return {number} The angle in radians
 */
vec3.angle = (a, b) => {
  const tempA = vec3.fromValues(a[0], a[1], a[2]);
  const tempB = vec3.fromValues(b[0], b[1], b[2]);

  vec3.normalize(tempA, tempA);
  vec3.normalize(tempB, tempB);

  const cosine = vec3.dot(tempA, tempB);

  if (cosine > 1.0) {
    return 0;
  } else if (cosine < -1.0) {
    return Math.PI;
  } else {
    return Math.acos(cosine);
  }
};

/**
 * Returns a string representation of a vector
 *
 * @param {!vec3} a vector to represent as a string
 * @return {string} string representation of the vector
 */
vec3.str = (a) => {
  return 'vec3(' + a[0].toFixed(4) + ', ' + a[1].toFixed(4) + ', ' + a[2].toFixed(4) + ')';
};

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {!vec3} a The first vector.
 * @param {!vec3} b The second vector.
 * @return {boolean} True if the vectors are equal, false otherwise.
 */
vec3.exactEquals = (a, b) => {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
};

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {!vec3} a The first vector.
 * @param {!vec3} b The second vector.
 * @return {boolean} True if the vectors are equal, false otherwise.
 */
vec3.equals = (a, b) => {
  const a0 = a[0]; const a1 = a[1]; const a2 = a[2];
  const b0 = b[0]; const b1 = b[1]; const b2 = b[2];
  return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)));
};
