
/**
 * Player acceleration (meters per second per second).
 * @const {number}
 */
const ACCELERATION = 100.0;

/**
 * Player friction.
 * @const {number}
 */
const FRICTION = 8.0;

/**
 * Gravitational force (meters per second per second).
 * @const {number}
 */
const GRAVITY = 40;

/**
 * Lesser gravity when player is still holding the jump button.
 * @const {number}
 */
const FLOATY_GRAVITY = 20;

/**
 * Grace time in seconds where the player can still jump.
 * For example, if they walk of a ledge, they can still jump for a brief period of time.
 * @const {number}
 */
const JUMP_GRACE_TIME = 0.25;

/**
 * Jump speed at time of jump (meters per second).
 * @const {number}
 */
const JUMP_POWER = 12;

/**
 * Maximum x coordinate on the map.
 * @const {number}
 */
const MAX_X = 32;

/**
 * Maximum y coordinate on the map.
 * @const {number}
 */
const MAX_Y = 64;

/**
 * Maximum z coordinate on the map.
 * @const {number}
 */
const MAX_Z = 32;

/**
 * Size of one tile in meters.
 * @const {number}
 */
const TILE_SIZE = 1;

/**
 * Index of "static cubes" in the buffers array.
 * This must be the correct array index.
 * See index.js.
 * @const {number}
 */
const STATIC_CUBES = 0;

/**
 * Index of "static sphers" in the buffers array.
 * This must be the correct array index.
 * See index.js.
 * @const {number}
 */
const STATIC_SPHERES = 1;

/**
 * Index of "dynamic cubes" in the buffers array.
 * This must be the correct array index.
 * See index.js.
 * @const {number}
 */
const DYNAMIC_CUBES = 2;

/**
 * Index of "dynamic spheres" in the buffers array.
 * This must be the correct array index.
 * See index.js.
 * @const {number}
 */
const DYNAMIC_SPHERES = 3;
