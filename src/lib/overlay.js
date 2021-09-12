
const OVERLAY_WHITE = '#f0f0f0';
const OVERLAY_BLACK = '#000';
const OVERLAY_LIGHT_GRAY = '#aaa';
const OVERLAY_DARK_GRAY = '#444';
const OVERLAY_YELLOW = '#fffe37';
const OVERLAY_DARK_YELLOW = '#881';
const OVERLAY_GREEN = '#0c0';
const OVERLAY_DARK_GREEN = '#080';
const OVERLAY_ORANGE = '#fe9400';

const ALIGN_LEFT = 'left';
const ALIGN_CENTER = 'center';
const ALIGN_RIGHT = 'right';

// /**
//  * Draws a transparent black overlay.
//  * Used for menus.
//  */
// function drawDarkBackground() {
//   overlayCtx.fillStyle = 'rgba(0,0,0,0.5)';
//   overlayCtx.fillRect(0, 0, WIDTH, HEIGHT);
// }

/**
 * Draws white text with a black shadow.
 * @param {string} str
 * @param {number} x
 * @param {number} y
 * @param {string=} fillColor
 */
function drawText(str, x, y, fillColor = OVERLAY_BLACK) {
  overlayCtx.fillStyle = fillColor;
  overlayCtx.fillText(str, x, y);
}

/**
 * Draws white text with a black shadow.
 * @param {string} str
 * @param {number} x
 * @param {number} y
 * @param {string=} fillColor
 */
function drawShadowText(str, x, y, fillColor = OVERLAY_WHITE) {
  drawText(str, x + 2, y + 2);
  drawText(str, x, y, fillColor);
}

/**
 * Sets the overlay context font size.
 * @param {number} size
 * @param {string=} style
 */
function setFontSize(size, style = '') {
  // overlayCtx.font = size + 'px Verdana';
  overlayCtx.font = `bold ${style} ${size}px Comic Sans MS`;
}

/**
 * Sets the overlay context text alignment.
 * @param {string} align
 */
function setTextAlign(align) {
  overlayCtx.textAlign = align;
}

/**
 * Draws a keyboard key icon.
 * @param {string} str
 * @param {number} x
 * @param {number} y
 * @param {number=} width Optional width in pixels.
 */
function drawKeyIcon(str, x, y, width = 36) {
  drawRectangle(x - width / 2, y - 8, width, 36, 'rgba(0,0,0,0.5)', OVERLAY_WHITE);
  drawShadowText(str, x, y);
}

/**
 * Draws a rectangle.
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {string} fillStyle
 * @param {string} strokeStyle
 */
function drawRectangle(x, y, width, height, fillStyle, strokeStyle) {
  overlayCtx.fillStyle = fillStyle;
  overlayCtx.fillRect(x, y, width, height);
  overlayCtx.strokeStyle = strokeStyle;
  overlayCtx.lineWidth = 3;
  overlayCtx.strokeRect(x, y, width, height);
}
