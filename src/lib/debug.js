
/**
 * Controls logging level.
 * When false, all logging becomes no-op, so compiled to nothing.
 * @const {boolean}
 */
const DEBUG = false;

/**
 * Logs to std out.
 * Only if debug is enabled.
 * @param {string} str
 */
function log(str) {
  if (DEBUG) {
    console.log(str);
  }
}
