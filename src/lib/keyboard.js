
/**
 * Flag to control whether keyboard inputs are enabled.
 * @const {boolean}
 */
const KEYBOARD_ENABLED = true;

const KEY_COUNT = 256;
const KEY_ENTER = 13;
const KEY_SHIFT = 16;
const KEY_ESCAPE = 27;
const KEY_SPACE = 32;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_1 = 49;
const KEY_2 = 50;
const KEY_3 = 51;
const KEY_4 = 52;
const KEY_5 = 53;
const KEY_6 = 54;
const KEY_7 = 55;
const KEY_8 = 56;
const KEY_9 = 57;
const KEY_A = 65;
const KEY_D = 68;
const KEY_M = 77;
const KEY_Q = 81;
const KEY_R = 82;
const KEY_S = 83;
const KEY_W = 87;
const KEY_X = 88;
const KEY_Z = 90;


/**
 * @typedef {{
 *            down:boolean,
 *            downCount:number,
 *            upCount:number
 *          }}
 */
let Key;

/**
 * Array of keyboard keys.
 * @const {!Array.<!Key>}
 */
const keys = new Array(256).fill(undefined).map(() => ({down: false, downCount: 0, upCount: 1}));

/**
 * All keys update this key.
 */
const anyKey = {down: false, downCount: 0, upCount: 1};

/**
 * Updates keyboard state.
 */
const updateKeys = () => {
  anyKey.down = false;
  keys.forEach((k) => {
    if (k.down) {
      anyKey.down = true;
      k.upCount = 0;
      k.downCount++;
    } else {
      k.upCount++;
      k.downCount = 0;
    }
  });

  if (anyKey.down) {
    anyKey.upCount = 0;
    anyKey.downCount++;
  } else {
    anyKey.upCount++;
    anyKey.downCount = 0;
  }
};

/**
 * Resets keyboard to all keys unpressed.
 */
const resetKeys = () => {
  anyKey.down = false;
  keys.forEach((k) => k.down = false);
  updateKeys();
};

/**
 * Returns if the key is down.
 * @param {number} keyCode
 * @return {boolean}
 */
const isKeyDown = (keyCode) => KEYBOARD_ENABLED && keys[keyCode].down;

/**
 * Returns if the key is down.
 * @param {number} keyCode
 * @return {boolean}
 */
const isKeyPressed = (keyCode) => KEYBOARD_ENABLED && keys[keyCode].upCount === 1;

document.addEventListener('keydown', (e) => {
  killEvent(e);
  keys[e.keyCode].down = true;
});

document.addEventListener('keyup', (e) => {
  killEvent(e);
  keys[e.keyCode].down = false;
});

window.addEventListener('blur', resetKeys);
