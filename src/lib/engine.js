
// Basic WebGL setup
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL

/**
 * Creates the WebGL program.
 * @param {string} vertexShaderSource
 * @param {string} fragmentShaderSource
 * @param {boolean=} bindAttribs
 * @return {!WebGLProgram}
 */
function initShaderProgram(vertexShaderSource, fragmentShaderSource, bindAttribs) {
  const vertexShader = loadShader(VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = loadShader(FRAGMENT_SHADER, fragmentShaderSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  if (bindAttribs) {
    gl.bindAttribLocation(program, positionAttrib, ATTRIBUTE_POSITION);
    gl.bindAttribLocation(program, colorAttrib, ATTRIBUTE_COLOR);
    gl.bindAttribLocation(program, worldMatrixAttrib, ATTRIBUTE_WORLDMATRIX);
  }

  gl.linkProgram(program);

  if (DEBUG) {
    const compiled = gl.getProgramParameter(program, LINK_STATUS);
    log('Program compiled: ' + compiled);
    const compilationLog = gl.getProgramInfoLog(program);
    log('Program compiler log: ' + compilationLog);
  }

  return program;
}

/**
 * Creates a shader.
 * @param {!GLenum} type
 * @param {string} source
 * @return {!WebGLShader}
 */
function loadShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (DEBUG) {
    const compiled = gl.getShaderParameter(shader, COMPILE_STATUS);
    log('Shader compiled: ' + compiled);
    const compilationLog = gl.getShaderInfoLog(shader);
    log('Shader compiler log: ' + compilationLog);
  }

  return shader;
}

/**
 * Returns the uniform location.
 * This is a simple wrapper, but helps with compression.
 * @param {!WebGLProgram} program
 * @param {string} name
 * @return {!WebGLUniformLocation} The uniform location.
 */
function getUniform(program, name) {
  return /** @type {!WebGLUniformLocation} */ (gl.getUniformLocation(program, name));
}

/**
 * Resets the WebGL state for a new render.
 * Clears color buffer and depth buffer.
 */
function resetGl() {
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  // gl.enable(CULL_FACE);
  gl.enable(DEPTH_TEST);
  gl.depthFunc(LEQUAL);
  gl.enable(BLEND);
  gl.blendFunc(SRC_ALPHA, ONE_MINUS_SRC_ALPHA);
  gl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
}

/**
 * Sets up the game camera.
 * @param {!Camera} camera
 * @param {number} w Viewport width.
 * @param {number} h Viewport height.
 */
function setupCamera(camera, w, h) {
  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  const aspect = w / h;
  const zNear = 0.1;
  const zFar = 1000.0;
  mat4.perspective(projectionMatrix, camera.fov, aspect, zNear, zFar);

  // Rotate around the X-axis by the pitch
  mat4.rotateX(pitchMatrix, mat4.identity(pitchMatrix), camera.pitch);

  // Rotate around the Y-axis by the yaw
  mat4.rotateY(yawMatrix, mat4.identity(yawMatrix), -camera.yaw);

  // Combine the pitch and yaw transformations
  mat4.multiply(modelViewMatrix, pitchMatrix, yawMatrix);

  // Finally, translate the world the opposite of the camera position
  vec3.subtract(cameraTranslate, origin, camera.source);
  mat4.translate(modelViewMatrix, modelViewMatrix, cameraTranslate);
}
