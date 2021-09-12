// ZzFX - Zuper Zmall Zound Zynth - Micro Edition
// MIT License - Copyright 2019 Frank Force
// https://github.com/KilledByAPixel/ZzFX

// This is a tiny build of zzfx with only a zzfx function to play sounds.
// You can use zzfxV to set volume.
// There is a small bit of optional code to improve compatibility.
// Feel free to minify it further for your own needs!
// let zzfx; let zzfxV; let zzfxX; let zzfxR;

// ZzFXMicro - Zuper Zmall Zound Zynth

// Modifications:
//   1) Removed randomness
//   2) Added reverb

/**
 * Volume
 * @const {number}
 */
const zzfxV = 0.3;

/**
 * Generates a sound effect.
 * @param {number=} volume
 * @param {number=} randomness
 * @param {number=} frequency
 * @param {number=} attack
 * @param {number=} sustain
 * @param {number=} release
 * @param {number=} shape
 * @param {number=} shapeCurve
 * @param {number=} slide
 * @param {number=} deltaSlide
 * @param {number=} pitchJump
 * @param {number=} pitchJumpTime
 * @param {number=} repeatTime
 * @param {number=} noise
 * @param {number=} modulation
 * @param {number=} bitCrush
 * @param {number=} delay
 * @param {number=} sustainVolume
 * @param {number=} decay
 * @param {number=} tremolo
 * @return {!Array.<number>}
 */
const zzfxG = (
    volume = 1,
    randomness = .05,
    frequency = 220,
    attack = 0,
    sustain = 0,
    release = .1,
    shape = 0,
    shapeCurve = 1,
    slide = 0,
    deltaSlide = 0,
    pitchJump = 0,
    pitchJumpTime = 0,
    repeatTime = 0,
    noise = 0,
    modulation = 0,
    bitCrush = 0,
    delay = 0,
    sustainVolume = 1,
    decay = 0,
    tremolo = 0) => {

    // init parameters
    const PI2 = Math.PI*2;
    let sign = v => v>0?1:-1,
    startSlide = slide *= 500 * PI2 / zzfxR / zzfxR,
    startFrequency = frequency *= PI2 / zzfxR,
    b=[], t=0, tm=0, i=0, j=1, r=0, c=0, s=0, f, length;

    // scale by sample rate
    attack = attack * zzfxR + 9; // minimum attack to prevent pop
    decay *= zzfxR;
    sustain *= zzfxR;
    release *= zzfxR;
    delay *= zzfxR;
    deltaSlide *= 500 * PI2 / zzfxR**3;
    modulation *= PI2 / zzfxR;
    pitchJump *= PI2 / zzfxR;
    pitchJumpTime *= zzfxR;
    repeatTime = repeatTime * zzfxR | 0;

    // generate waveform
    for(length = attack + decay + sustain + release + delay | 0;
        i < length; b[i++] = s)
    {
        if (!(++c%(bitCrush*100|0)))                      // bit crush
        {
            s = shape? shape>1? shape>2? shape>3?         // wave shape
                Math.sin((t%PI2)**3) :                    // 4 noise
                Math.max(Math.min(Math.tan(t),1),-1):     // 3 tan
                1-(2*t/PI2%2+2)%2:                        // 2 saw
                1-4*Math.abs(Math.round(t/PI2)-t/PI2):    // 1 triangle
                Math.sin(t);                              // 0 sin

            s = (repeatTime ?
                    1 - tremolo + tremolo*Math.sin(PI2*i/repeatTime) // tremolo
                    : 1) *
                sign(s)*(Math.abs(s)**shapeCurve) *       // curve 0=square, 2=pointy
                volume * zzfxV * (                        // envelope
                i < attack ? i/attack :                   // attack
                i < attack + decay ?                      // decay
                1-((i-attack)/decay)*(1-sustainVolume) :  // decay falloff
                i < attack  + decay + sustain ?           // sustain
                sustainVolume :                           // sustain volume
                i < length - delay ?                      // release
                (length - i - delay)/release *            // release falloff
                sustainVolume :                           // release volume
                0);                                       // post release

            s = delay ? s/2 + (delay > i ? 0 :            // delay
                (i<length-delay? 1 : (length-i)/delay) *  // release delay
                b[i-delay|0]/2) : s;                      // sample delay
        }

        f = (frequency += slide += deltaSlide) *          // frequency
            Math.cos(modulation*tm++);                    // modulation
        t += f - f*noise*(1 - (Math.sin(i)+1)*1e9%2);     // noise

        if (j && ++j > pitchJumpTime)       // pitch jump
        {
            frequency += pitchJump;         // apply pitch jump
            startFrequency += pitchJump;    // also apply to start
            j = 0;                          // stop pitch jump time
        }

        if (repeatTime && !(++r % repeatTime)) // repeat
        {
            frequency = startFrequency;     // reset frequency
            slide = startSlide;             // reset slide
            j = j || 1;                     // reset pitch jump time
        }
    }

    return b;
};

/**
 * Plays a sound.
 * @param {...!Array.<number>} t
 * @return {!AudioBufferSourceNode}
 */
const zzfxP = (...t) => {
  const e = zzfxX.createBufferSource();
  const f = zzfxX.createBuffer(t.length, t[0].length, zzfxR);
  t.map((d, i) => f.getChannelData(i).set(d));
  e.buffer = f;
  e.connect(zzfxX.destination);
  e.connect(reverbConvolver);
  e.start();
  return e;
};

/**
 * Generates and plays a sound effect.
 * @param {...*} t
 * @return {!AudioBufferSourceNode}
 */
const zzfx = (...t) => zzfxP(zzfxG(...t));

/**
 * Audio context.
 * @const {!AudioContext}
 */
const zzfxX = new AudioContext();

/**
 * Sample rate.
 * @const {number}
 */
const zzfxR = 44100;

/**
 * Creates a reverb convolver.
 * @param {number} duration Duration in seconds.
 * @returns {!ConvolverNode} The reverb convolver.
 */
function createReverbConvolver(duration) {
  const sampleRate = zzfxX.sampleRate;
  const length = sampleRate * duration;
  const impulse = zzfxX.createBuffer(2, length, sampleRate);
  const impulseL = impulse.getChannelData(0);
  const impulseR = impulse.getChannelData(1);
  const decay = 1.5;

  for (let i = 0; i < length; i++){
    impulseL[i] = 0.5 * (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    impulseR[i] = 0.5 * (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
  }

  const convolver = zzfxX.createConvolver();
  convolver.buffer = impulse;
  convolver.connect(zzfxX.destination);
  return convolver;
}

/**
 * The reverb convolver.
 * @const {!ConvolverNode}
 */
const reverbConvolver = createReverbConvolver(1);
