
// Use custom GL constants for minifier.
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants

/** @const {!GLenum} */
const ZERO = 0;

/** @const {!GLenum} */
const ONE = 1;

/** @const {!GLenum} */
const DEPTH_BUFFER_BIT = 0x00000100;

/** @const {!GLenum} */
const COLOR_BUFFER_BIT = 0x00004000;

/** @const {!GLenum} */
const TRIANGLES = 0x0004;

/** @const {!GLenum} */
const LEQUAL = 0x0203;

/** @const {!GLenum} */
const SRC_ALPHA = 0x0302;

/** @const {!GLenum} */
const ONE_MINUS_SRC_ALPHA = 0x0303;

/** @const {!GLenum} */
const CULL_FACE = 0x0B44;

/** @const {!GLenum} */
const DEPTH_TEST = 0x0B71;

/** @const {!GLenum} */
const BLEND = 0x0BE2;

/** @const {!GLenum} */
const TEXTURE_2D = 0x0DE1;

/** @const {!GLenum} */
const UNSIGNED_BYTE = 0x1401;

/** @const {!GLenum} */
const UNSIGNED_SHORT = 0x1403;

/** @const {!GLenum} */
const FLOAT = 0x1406;

/** @const {!GLenum} */
const DEPTH_COMPONENT = 0x1902;

/** @const {!GLenum} */
const RGBA = 0x1908;

/** @const {!GLenum} */
const NEAREST = 0x2600;

/** @const {!GLenum} */
const LINEAR = 0x2601;

/** @const {!GLenum} */
const TEXTURE_MAG_FILTER = 0x2800;

/** @const {!GLenum} */
const TEXTURE_MIN_FILTER = 0x2801;

/** @const {!GLenum} */
const TEXTURE_WRAP_S = 0x2802;

/** @const {!GLenum} */
const TEXTURE_WRAP_T = 0x2803;

/** @const {!GLenum} */
const CLAMP_TO_EDGE = 0x812F;

/** @const {!GLenum} */
const DEPTH_COMPONENT16 = 0x81A5;

/** @const {!GLenum} */
const TEXTURE0 = 0x84C0;

/** @const {!GLenum} */
const TEXTURE1 = 0x84C1;

/** @const {!GLenum} */
const TEXTURE2 = 0x84C2;

/** @const {!GLenum} */
const ARRAY_BUFFER = 0x8892;

/** @const {!GLenum} */
const ELEMENT_ARRAY_BUFFER = 0x8893;

/** @const {!GLenum} */
const STATIC_DRAW = 0x88E4;

/** @const {!GLenum} */
const DYNAMIC_DRAW = 0x88E8;

/** @const {!GLenum} */
const FRAGMENT_SHADER = 0x8B30;

/** @const {!GLenum} */
const VERTEX_SHADER = 0x8B31;

/** @const {!GLenum} */
const COMPILE_STATUS = 0x8B81;

/** @const {!GLenum} */
const LINK_STATUS = 0x8B82;

/** @const {!GLenum} */
const DEPTH_COMPONENT32F = 0x8CAC;

/** @const {!GLenum} */
const COLOR_ATTACHMENT0 = 0x8CE0;

/** @const {!GLenum} */
const DEPTH_ATTACHMENT = 0x8D00;

/** @const {!GLenum} */
const FRAMEBUFFER = 0x8D40;

/** @const {!GLenum} */
const RENDERBUFFER = 0x8D41;

/**
 * Epsilon for vec3 and mat4 comparisons.
 * @const {number}
 */
const EPSILON = 0.00001;
