
// This file is for silly code optimizations.
// See: https://xem.github.io/articles/webgl_quest.html
// See: https://github.com/carlini/js13k2019-yet-another-doom-clone/blob/master/make.py

/**
 * Builds a shortcut name for a property.
 * @param {string} name The original name.
 * @return {string} The abbreviated name.
 */
const buildShortcut = (name) => name.substr(0, 3) + name.substr(-3) + (name[name.length - 8] || '_');

/**
 * Builds shortcut properties for all existing properties on an object.
 * @param {!Object} obj
 */
const buildShortcuts = (obj) => {
  for (const key in obj) {
    const s = buildShortcut(key);
    if (!(s in obj)) {
      log(`Shortcut '${s}' for '${key}'`);
      obj[s] = obj[key];
    }
  }
};
