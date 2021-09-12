
/**
 * Plays the "jump" sound effect.
 * @return {!AudioBufferSourceNode}
 */
const playJumpSound = () => zzfx(...[.6, 0, 130, .01, .02, , , .4, 5, , , , , , , , , .9]);

/**
 * Plays the "coin" sound effect.
 * @return {!AudioBufferSourceNode}
 */
// const playCoinSound = () => zzfx(...[.7, 0, 1000 * (1 + 1 / 12) ** coinSequence, , .06, .15, 1, 1.5, , , 300, .05, , , , , , .6, .06]);
const playCoinSound = () => zzfx(...[.7, 0, 1e3 * (1 + 1 / 12) ** coinSequence, , .05, , 1, 1.5, , , 300, .1, , , , , , .5, .05]); // Loaded Sound 228

/**
 * Plays the "fuel" pickup sound effect.
 * @return {!AudioBufferSourceNode}
 */
const playFuelSound = () => zzfx(...[.5, 0, 328, .04, .1, .35, , .97, , .5, 9, .01, .06, , 12, .1, , .74, .08]);

/**
 * Plays the player "shoot" sound effect.
 * @return {!AudioBufferSourceNode}
 */
const playShootSound = () => zzfx(...[.3, 0, 40, .02, .02, .04, 4, .87, , .9, , , , , , , , .83, .02, .28]);

/**
 * Plays the Kang "shoot" sound effect.
 * @return {!AudioBufferSourceNode}
 */
const playKangShootSound = () => zzfx(...[.2, 0, 20, .02, .1, , 4, .87, , .9, , , , , , , , .83, .02, .28]); // Loaded Sound 269

/**
 * Plays the "explode" sound effect.
 * @return {!AudioBufferSourceNode}
 */
const playExplosionSound = () => zzfx(...[.5, 0, 101, , , .5, 4, 2.8, , , , , , , .8, .4, , .95, , .42]);

/**
 * Plays a menu beep sound.
 * @return {!AudioBufferSourceNode}
 */
const playMenuBeep = () => zzfx(...[.5, 0, 80, .02, .04, .02, 1, .3, 56,,,,, .1, 7.5,,, .39]); // Blip 290

/**
 * Precomputed "jetpack" audio buffer.
 * @const {!Array.<number>}
 */
const jetpackAudioBuffer = zzfxG(...[.05, 0, 900, .2, 3, 0, 4, 0, , , , , , 4, , .1]);

/**
 * Reference to the jetpack AudioBuffer when the sound is playing.
 * Undefined when the sound is not playing.
 * @type {?AudioBufferSourceNode}
 */
let jetpackSound;

/**
 * Starts the "jetpack" sound.
 * If it is already playing, then ends it.
 */
const startJetpackSound = () => {
  if (!jetpackSound) {
    jetpackSound = zzfxP(jetpackAudioBuffer);
    jetpackSound.loop = true;
  }
};

/**
 * Stops the "jetpack" sound.
 * Silently ignores if not playing.
 */
const stopJetpackSound = () => {
  if (jetpackSound) {
    jetpackSound.stop();
    jetpackSound = null;
  }
};
