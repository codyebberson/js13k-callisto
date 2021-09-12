const WIDTH = 1920;
const HEIGHT = 1080;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const MAIN_FBO_SIZE = 2048;
const BLOOM_FBO_SIZE = 512;
const canvases = document.querySelectorAll('canvas');
const canvas = /** @const {!HTMLCanvasElement} */ (canvases[0]);
const overlayCanvas = /** @const {!HTMLCanvasElement} */ (canvases[1]);
const overlayCtx = /** @const {!CanvasRenderingContext2D} */ (overlayCanvas.getContext('2d'));
const origin = vec3.create();
const forward = vec3.fromValues(0.0, 0.0, 1.0);
const tempVec = vec3.create();
const camera = createCamera();
const lightSource = createCamera();
const cameraTranslate = vec3.create();
const projectionMatrix = mat4.create();
const modelViewMatrix = mat4.create();
const pitchMatrix = mat4.create();
const yawMatrix = mat4.create();
const identity = mat4.create();
const shadowMapMatrix = mat4.create();
const positionAttrib = 0;
const colorAttrib = 1;
const worldMatrixAttrib = 2; // Must be last!  Matrices are multiple attributes
const gl = /** @type {!WebGL2RenderingContext} */ (canvas.getContext('webgl2', {'alpha': false}));
buildShortcuts(gl);
const shadowProgram = initShaderProgram(SHADOW_VERT, SHADOW_FRAG, true);
const viewMatrixUniform1 = getUniform(shadowProgram, UNIFORM_VIEWMATRIX);
const projectionMatrixUniform1 = getUniform(shadowProgram, UNIFORM_PROJECTIONMATRIX);
const mainProgram = initShaderProgram(MAIN_VERT, MAIN_FRAG, true);
const viewMatrixUniform2 = getUniform(mainProgram, UNIFORM_VIEWMATRIX);
const projectionMatrixUniform2 = getUniform(mainProgram, UNIFORM_PROJECTIONMATRIX);
const colorTextureSamplerUniform = getUniform(mainProgram, UNIFORM_COLORTEXTURE);
const shadowMapMatrixUniform = getUniform(mainProgram, UNIFORM_SHADOWMAPMATRIX);
const depthTextureSamplerUniform = getUniform(mainProgram, UNIFORM_DEPTHTEXTURE);
const lightColorsUniform = getUniform(mainProgram, UNIFORM_LIGHTCOLORS);
const lightPositionsUniform = getUniform(mainProgram, UNIFORM_LIGHTPOSITIONS);
const lightColors = new Float32Array(3 * 16);
const lightPositions = new Float32Array(3 * 16);
let nextLight = 0;
const buffers = /** @const {!Array.<!BufferSet>} */ ([]);

const shadowFbo = createFbo(MAIN_FBO_SIZE);
const mainFbo = createFbo(MAIN_FBO_SIZE);
const pingPongFbo1 = createFbo(BLOOM_FBO_SIZE);
const pingPongFbo2 = createFbo(BLOOM_FBO_SIZE);

const bloomProgram = initShaderProgram(BLOOM_VERT, BLOOM_FRAG);
const bloomPositionAttrib = gl.getAttribLocation(bloomProgram, ATTRIBUTE_POSITION);
const bloomTexCoordAttrib = gl.getAttribLocation(bloomProgram, ATTRIBUTE_TEXCOORD);
const bloomColorTextureUniform = getUniform(bloomProgram, UNIFORM_COLORTEXTURE);
const bloomIterationUniform = getUniform(bloomProgram, UNIFORM_ITERATION);

const depthOfFieldProgram = initShaderProgram(POST_VERT, POST_FRAG);
const depthOfFieldPositionAttrib = gl.getAttribLocation(depthOfFieldProgram, ATTRIBUTE_POSITION);
const depthOfFieldTexCoordAttrib = gl.getAttribLocation(depthOfFieldProgram, ATTRIBUTE_TEXCOORD);
const depthOfFieldColorTextureUniform = getUniform(depthOfFieldProgram, UNIFORM_COLORTEXTURE);
const depthOfFieldDepthTextureUniform = getUniform(depthOfFieldProgram, UNIFORM_DEPTHTEXTURE);
const depthOfFieldBloomTextureUniform = getUniform(depthOfFieldProgram, UNIFORM_BLOOMTEXTURE);

const depthOfFieldVao = /** @type {!WebGLVertexArrayObject} */ (gl.createVertexArray());
gl.bindVertexArray(depthOfFieldVao);

/**
 * Position coordinates buffer.
 * This is the static, flat, two triangle (one quad) buffer
 * that is used for post processing effects.
 * @const {!WebGLBuffer}
 */
const depthOfFieldPositionBuffer = gl.createBuffer();
gl.bindBuffer(ARRAY_BUFFER, depthOfFieldPositionBuffer);
gl.bufferData(ARRAY_BUFFER, new Float32Array([
  // Top-left
  -1.0, -1.0,
  1.0, -1.0,
  -1.0, 1.0,
  // Bottom-right
  1.0, -1.0,
  1.0, 1.0,
  -1.0, 1.0,
]), STATIC_DRAW);
gl.enableVertexAttribArray(depthOfFieldPositionAttrib);
gl.vertexAttribPointer(depthOfFieldPositionAttrib, 2, FLOAT, false, 0, 0);

/**
 * Texture coordinates buffer.
 * This is the static, flat, two triangle (one quad) buffer
 * that is used for post processing effects.
 * @const {!WebGLBuffer}
 */
const depthOfFieldTextureBuffer = gl.createBuffer();
gl.bindBuffer(ARRAY_BUFFER, depthOfFieldTextureBuffer);
gl.bufferData(ARRAY_BUFFER, new Float32Array([
  // Top-left
  0.0, 0.0,
  1.0, 0.0,
  0.0, 1.0,
  // Bottom-right
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
]), STATIC_DRAW);
gl.enableVertexAttribArray(depthOfFieldTexCoordAttrib);
gl.vertexAttribPointer(depthOfFieldTexCoordAttrib, 2, FLOAT, false, 0, 0);

/**
 * Current real world time in seconds.
 * @type {number}
 */
let time = 0;

/**
 * Current game time in seconds.
 * @type {number}
 */
let gameTime = 0;

/**
 * Most recent game time delta in seconds.
 * @type {number}
 */
let dt = 0;

/**
 * Number of webgl draw calls per frame.
 * Debug only.
 * @type {number}
 */
let drawCount = 0;

/**
 * Number of triangles rendered per frame.
 * Debug only.
 * @type {number}
 */
let triangleCount = 0;

/**
 * Last render time (milliseconds since the epoch).
 * Debug only.
 * @type {number}
 */
let lastRenderTime = 0;

/**
 * Current FPS.
 * Debug only.
 * @type {number}
 */
let fps = 0;

/**
 * Moving average FPS.
 * Debug only.
 * @type {number}
 */
let averageFps = 0;

/**
 * Converts a number (i.e., 123.456) to a pixel string (i.e., '123px').
 * @param {number} num The number value.
 * @return {string} The pixel string value.
 */
const pixelString = (num) => Math.floor(num) + 'px';

window.addEventListener('resize', handleResizeEvent, false);
handleResizeEvent();

/**
 * Handles window resize event.
 * Resets the canvas dimensions to match window,
 * then draws the new borders accordingly.
 */
function handleResizeEvent() {
  const scale = Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);
  const width = scale * WIDTH;
  const height = scale * HEIGHT;
  const x = (window.innerWidth - width) / 2;
  const y = (window.innerHeight - height) / 2;

  if (canvas) {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.left = pixelString(x);
    canvas.style.top = pixelString(y);
    canvas.style.width = pixelString(width);
    canvas.style.height = pixelString(height);
  }
  if (overlayCanvas) {
    overlayCanvas.width = WIDTH;
    overlayCanvas.height = HEIGHT;
    overlayCanvas.style.left = pixelString(x);
    overlayCanvas.style.top = pixelString(y);
    overlayCanvas.style.width = pixelString(width);
    overlayCanvas.style.height = pixelString(height);
  }
}

/**
 * Renders the screen.
 * @param {number} now
 */
function render(now) {
  if (DEBUG) {
    drawCount = 0;
    triangleCount = 0;

    if (lastRenderTime === 0) {
      lastRenderTime = now;
    } else {
      const actualDelta = now - lastRenderTime;
      lastRenderTime = now;
      fps = 1000.0 / actualDelta;
      averageFps = 0.9 * averageFps + 0.1 * fps;
    }
  }

  // Update time variables
  // Convert to seconds
  now *= 0.001;

  // Calculate the time delta
  // Maximum of 30 FPS
  // This handles the case where user comes back to browser after long time
  dt = Math.min(now - time, 1.0 / 30.0);

  // Set the current real world time
  time = now;

  // Set the current game time
  if (gameState === GameState.PLAYING && !menu) {
    gameTime += dt;
  }

  // Update input state
  updateKeys();

  // Reset overlay canvas
  overlayCtx.clearRect(0, 0, WIDTH, HEIGHT);
  overlayCtx.textBaseline = 'top';

  // Reset the dynamic buffers
  buffers.forEach((b) => b.usage === DYNAMIC_DRAW && b.resetBuffers());

  // Expect the global function "update()"
  update();

  // Update buffer data
  buffers.forEach((b) => b.usage === DYNAMIC_DRAW && b.updateBuffers());

  // Draw the scene twice
  // First, draw from the POV of the light
  bindFbo(shadowFbo);
  resetGl();
  setupCamera(lightSource, shadowFbo.size, shadowFbo.size);
  gl.useProgram(shadowProgram);
  gl.uniformMatrix4fv(projectionMatrixUniform1, false, projectionMatrix);
  gl.uniformMatrix4fv(viewMatrixUniform1, false, modelViewMatrix);
  renderScene();

  // Build the texture matrix that maps the world space to the depth texture
  mat4.identity(shadowMapMatrix);
  mat4.translate(shadowMapMatrix, shadowMapMatrix, vec3.fromValues(0.5, 0.5, 0.5));
  mat4.scale(shadowMapMatrix, shadowMapMatrix, vec3.fromValues(0.5, 0.5, 0.5));
  mat4.multiply(shadowMapMatrix, shadowMapMatrix, projectionMatrix);
  mat4.multiply(shadowMapMatrix, shadowMapMatrix, modelViewMatrix);

  // Second, draw the scene from the POV of the camera
  // Use the shadow map for lighting
  bindFbo(mainFbo);
  resetGl();
  setupCamera(camera, WIDTH, HEIGHT);
  gl.useProgram(mainProgram);
  gl.uniformMatrix4fv(projectionMatrixUniform2, false, projectionMatrix);
  gl.uniformMatrix4fv(viewMatrixUniform2, false, modelViewMatrix);
  gl.uniformMatrix4fv(shadowMapMatrixUniform, false, shadowMapMatrix);
  gl.uniform3fv(lightColorsUniform, lightColors);
  gl.uniform3fv(lightPositionsUniform, lightPositions);
  gl.activeTexture(TEXTURE0);
  gl.bindTexture(TEXTURE_2D, shadowFbo.depthTexture);
  gl.uniform1i(depthTextureSamplerUniform, 0);
  renderScene();

  // Second, draw the scene projecting the depth tecture
  // Use the ping pong technique to render back and forth between two FBOs
  // 6 iteration process:
  //  0 = filter for emissive pixels
  //  1 and 3 = blur horizontally
  //  2 and 4 = blur vertically
  //  5 = result to output
  let inputFbo = mainFbo;
  let outputFbo = pingPongFbo1;
  gl.useProgram(bloomProgram);
  for (let i = 0; i < 5; i++) {
    bindFbo(outputFbo);
    resetGl();
    gl.bindVertexArray(depthOfFieldVao);
    gl.activeTexture(TEXTURE0);
    gl.bindTexture(TEXTURE_2D, inputFbo.colorTexture);
    gl.uniform1i(bloomColorTextureUniform, 0);
    gl.uniform1i(bloomIterationUniform, i);
    gl.drawArrays(TRIANGLES, 0, 6);

    // Swap buffers
    if (i % 2 === 0) {
      inputFbo = pingPongFbo1;
      outputFbo = pingPongFbo2;
    } else {
      inputFbo = pingPongFbo2;
      outputFbo = pingPongFbo1;
    }
  }

  // Lastly, draw the post-processing effects
  // This includes the adding the bloom blur
  // and the depth-of-field blur
  bindScreen();
  gl.useProgram(depthOfFieldProgram);
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
  gl.bindVertexArray(depthOfFieldVao);
  gl.activeTexture(TEXTURE0);
  gl.bindTexture(TEXTURE_2D, mainFbo.colorTexture);
  gl.uniform1i(depthOfFieldColorTextureUniform, 0);
  gl.activeTexture(TEXTURE1);
  gl.bindTexture(TEXTURE_2D, mainFbo.depthTexture);
  gl.uniform1i(depthOfFieldDepthTextureUniform, 1);
  gl.activeTexture(TEXTURE2);
  gl.bindTexture(TEXTURE_2D, pingPongFbo1.colorTexture);
  gl.uniform1i(depthOfFieldBloomTextureUniform, 2);
  gl.drawArrays(TRIANGLES, 0, 6);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

/**
 * Render the scene using the current camera and buffers.
 */
function renderScene() {
  buffers.forEach((b) => b.render());
}

/**
 * Resets the current lighting values.
 */
function resetLights() {
  lightColors.fill(0);
  lightPositions.fill(0);
  nextLight = 0;
}

/**
 * Adds a light.
 * @param {!vec3} position
 * @param {!vec3} color
 */
function addLight(position, color) {
  lightColors[nextLight * 3] = color[0];
  lightColors[nextLight * 3 + 1] = color[1];
  lightColors[nextLight * 3 + 2] = color[2];
  lightPositions[nextLight * 3] = position[0];
  lightPositions[nextLight * 3 + 1] = position[1];
  lightPositions[nextLight * 3 + 2] = position[2];
  nextLight++;
}
