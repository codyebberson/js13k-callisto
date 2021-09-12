
/**
 * @typedef {{
  *            source:!vec3,
  *            pitch:number,
  *            yaw:number,
  *            fov:number,
  *            distance:number
  *          }}
  */
let Camera;

/**
 * Creates a new camera.
 * @return {!Camera}
 */
const createCamera = () => ({
  source: vec3.create(),
  pitch: 0,
  yaw: 0,
  fov: 0,
  distance: 0,
});

/**
 * Sets the camera configuration.
 * @param {!Camera} camera
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} pitch
 * @param {number} yaw
 * @param {number} fov
 */
const setCamera = (camera, x, y, z, pitch, yaw, fov) => {
  vec3.set(camera.source, x, y, z);
  camera.pitch = pitch;
  camera.yaw = yaw;
  camera.fov = fov;
};

/**
 * Configures the camera to look from the source to the target.
 * @param {!Camera} camera
 * @param {!vec3} source
 * @param {!vec3} target
 * @param {number} fov
 */
const lookAt = (camera, source, target, fov) => {
  vec3.copy(camera.source, source);
  vec3.subtract(tempVec, target, source);
  camera.distance = vec3.magnitude(tempVec);
  camera.yaw = Math.atan2(tempVec[0], tempVec[2]);
  camera.pitch = Math.atan2(tempVec[1], Math.hypot(tempVec[0], tempVec[2]));
  camera.fov = fov;
};
