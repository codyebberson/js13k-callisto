/**
 * Components refer to the GLSL inputs.
 * They can be 32 bit floats (for vec3 coordinates and transformation matrices),
 * or they can be 32 bit unsigned integers (for colors).
 * @const {number}
 */
const BYTES_PER_COMPONENT = 4;

/**
 * Vertices are simple 3-dimensional vectors.
 * No color or texture data is on the vertex.
 * @const {number}
 */
const COMPONENTS_PER_VERTEX = 3;

/** @const {number} */
const BYTES_PER_VERTEX = COMPONENTS_PER_VERTEX * BYTES_PER_COMPONENT;

/** @const {number} */
const COMPONENTS_PER_MATRIX = 4 * 4;

/** @const {number} */
const BYTES_PER_MATRIX = COMPONENTS_PER_MATRIX * BYTES_PER_COMPONENT;

/**
 * Each instance has one 32-bit color and one 4x4 transofrmation matrix.
 * @const {number}
 */
const COMPONENTS_PER_INSTANCE = 1 + COMPONENTS_PER_MATRIX;

/** @const {number} */
const BYTES_PER_INSTANCE = COMPONENTS_PER_INSTANCE * BYTES_PER_COMPONENT;

/** @typedef {number} */
let GLenum;

/**
 * The BufferSet class represents a collection of WebGL buffers for a render pass.
 *
 * There are 2 buffers:
 * 1) Geometry data.  This is the same for each instance.
 * 2) Instance data.  This is different for each instance.
 *
 * Geometry data includes:
 * 1) Position coordinates (x, y, z) in unit space.
 * 2) That's it.  No color or texture data.
 *
 * Geometry therefore is 3 float components = 12 bytes.
 *
 * Instance data includes:
 * 1) A 32-bit color.
 * 2) Model matrix (4x4 transformation)
 *
 * Instance data therefore is 17 float components = 68 bytes.
 */
class BufferSet {
  /**
   * Creates a new buffer set.
   *
   * @param {!GLenum} usage The usage pattern (either STATIC_DRAW or DYNAMIC_DRAW).
   * @param {!Float32Array} geometry The unit geometry for a single instance.
   * @param {number} maxInstances Maximum number of instances.
   */
  constructor(usage, geometry, maxInstances) {
    /** @const {!GLenum} */
    this.usage = usage;

    /** @const {number} */
    this.verticesPerInstance = geometry.length / COMPONENTS_PER_VERTEX;

    /** @type {number}  */
    this.instanceCount = 0;

    /** @const {!WebGLVertexArrayObject} */
    this.vao = /** @type {!WebGLVertexArrayObject} */ (gl.createVertexArray());
    gl.bindVertexArray(this.vao);

    /** @const {!WebGLBuffer} */
    this.geometryBuffer = /** @type {!WebGLBuffer} */ (gl.createBuffer());

    gl.bindBuffer(ARRAY_BUFFER, this.geometryBuffer);
    gl.bufferData(ARRAY_BUFFER, geometry, STATIC_DRAW);

    // Geometry attributes
    // One vertex is [x, y, z], 3 components, 12 bytes
    gl.enableVertexAttribArray(positionAttrib);
    gl.vertexAttribPointer(positionAttrib, 3, FLOAT, false, BYTES_PER_VERTEX, 0);

    /** @const {!Uint32Array} */
    this.instanceData = new Uint32Array(maxInstances * COMPONENTS_PER_INSTANCE);

    /** @const {!WebGLBuffer} */
    this.instanceBuffer = /** @type {!WebGLBuffer} */ (gl.createBuffer());

    gl.bindBuffer(ARRAY_BUFFER, this.instanceBuffer);
    gl.bufferData(ARRAY_BUFFER, this.instanceData, usage);

    // Instance attributes
    // Colors and model matrices are interleaved
    // One vertex is [color, mat4], 17 components, 68 bytes
    // Actually...
    // In JavaScript code, we refer to color as a single 32-bit number
    // In GLSL code, we refer to color as a vec4, composed of 4 unsigned bytes.
    gl.enableVertexAttribArray(colorAttrib);
    gl.vertexAttribPointer(colorAttrib, 4, UNSIGNED_BYTE, true, BYTES_PER_INSTANCE, 0);
    gl.vertexAttribDivisor(colorAttrib, 1);

    /** @const {!Array.<!mat4>} */
    this.matrices = new Array(maxInstances);
    for (let i = 0; i < maxInstances; i++) {
      // Find the offset for the matrix...
      // Jump to the offset for the instance (i * BYTES_PER_INSTANCE)
      // plus one component for the color (1 * BYTES_PER_COMPONENT)
      const byteOffsetToMatrix = 1 * BYTES_PER_COMPONENT + i * BYTES_PER_INSTANCE;
      this.matrices[i] = new Float32Array(
          this.instanceData.buffer,
          byteOffsetToMatrix,
          COMPONENTS_PER_MATRIX);
    }

    gl.enableVertexAttribArray(worldMatrixAttrib);

    // Set all 4 attributes for matrix
    // Technically a matrix is passed in as 4 separate vec4's
    for (let i = 0; i < 4; i++) {
      const loc = worldMatrixAttrib + i;
      gl.enableVertexAttribArray(loc);
      // Calculate the stride and offset for each matrix row
      // Stride is simple: one stride per instance -> BYTES_PER_INSTANCE
      // Offset is a little more tricky:
      // First, 8 bytes for the texture offset (2 components * 4 bytes per float)
      // Plus i * 16 for 4 floats per row * 4 bytes per float
      const offset = 4 + i * 16;
      gl.vertexAttribPointer(
          loc, // location
          4, // size (num values to pull from buffer per iteration)
          FLOAT, // type of data in buffer
          false, // normalize
          BYTES_PER_INSTANCE, // stride, num bytes to advance to get to next set of values
          offset, // offset in buffer
      );
      // this line says this attribute only changes for each 1 instance
      gl.vertexAttribDivisor(loc, 1);
    }
  }

  /**
   * Resets the buffers to empty state.
   */
  resetBuffers() {
    this.instanceCount = 0;
  }

  /**
   * Adds a new instance to the set.
   * @param {number} color The 32-bit color.
   * @return {!mat4}
   */
  addInstance(color) {
    const i = this.instanceCount++;
    if (DEBUG) {
      if (i * COMPONENTS_PER_INSTANCE >= this.instanceData.length) {
        throw new Error('Out of instances ' +
          '(i=' + i + ', max=' + (this.instanceData.length / COMPONENTS_PER_INSTANCE) + ')');
      }
    }
    this.instanceData[i * COMPONENTS_PER_INSTANCE] = color;
    return mat4.identity(this.matrices[i]);
  }

  /**
   * Updates the WebGL buffers with the current data.
   */
  updateBuffers() {
    gl.bindBuffer(ARRAY_BUFFER, this.instanceBuffer);
    gl.bufferData(ARRAY_BUFFER, this.instanceData, this.usage);
  }

  /**
   * Draws the buffer set.
   */
  render() {
    gl.bindVertexArray(this.vao);

    if (this.usage === DYNAMIC_DRAW) {
      // TODO:  Combine this with updateBuffers
      // Can these be called before bindVertex array?
      // TODO:  Use overload to only update minimum number of elements
      // Use bufferSubData for number of instances * BYTES_PER_INSTANCE
      gl.bindBuffer(ARRAY_BUFFER, this.instanceBuffer);
      // gl.bufferData(ARRAY_BUFFER, this.instanceData, this.usage);
      // void gl.bufferSubData(target, dstByteOffset, ArrayBufferView srcData, srcOffset, length);
      gl.bufferSubData(ARRAY_BUFFER, 0, this.instanceData, 0, this.instanceCount * COMPONENTS_PER_INSTANCE);
    }

    gl.drawArraysInstanced(TRIANGLES, 0, this.verticesPerInstance, this.instanceCount);
  }
}
