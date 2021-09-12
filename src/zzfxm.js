/**
 * ZzFX Music Renderer v2.0.3 by Keith Clark and Frank Force
 */

/** @typedef {!Array.<number>} */
const Channel = {};

/** @typedef {!Array.<!Channel>} */
const Pattern = {};

/** @typedef {!Array.<number>} */
const Instrument = {};

/**
 * Converts a boolean to integer.
 * Technically, just using a boolean should do this automatically.
 * However...
 * 1) Google Closure does not accept it.
 * 2) It is apparently very slow.
 * @param {boolean} b
 * @return {number}
 */
const boolToInt = (b) => b ? 1 : 0;

/**
 * Generate a song
 *
 * @param {!Array.<!Instrument>} instruments - Array of ZzFX sound paramaters.
 * @param {!Array.<!Pattern>} patterns - Array of pattern data.
 * @param {!Array.<number>} sequence - Array of pattern indexes.
 * @param {number=} BPM - Playback speed of the song (in BPM).
 * @return {!Array.<!Array.<number>>} Left and right channel sample data.
 */
const zzfxM = (instruments, patterns, sequence, BPM = 125) => {
  let instrumentParameters;
  let i;
  let j;
  let k;
  let note;
  let sample;
  let patternChannel;
  let notFirstBeat;
  let stop;
  let instrument;
  let attenuation;
  let outSampleOffset;
  let isSequenceEnd;
  let sampleOffset = 0;
  let nextSampleOffset;
  let sampleBuffer = [];
  const leftChannelBuffer = [];
  const rightChannelBuffer = [];
  let channelIndex = 0;
  let panning = 0;
  let hasMore = 1;
  const sampleCache = {};
  const beatLength = zzfxR / BPM * 60 >> 2;

  // for each channel in order until there are no more
  for (; hasMore; channelIndex++) {
    // reset current values
    sampleBuffer = [hasMore = notFirstBeat = outSampleOffset = 0];

    // for each pattern in sequence
    sequence.map((patternIndex, sequenceIndex) => {
      // get pattern for current channel, use empty 1 note pattern if none found
      patternChannel = patterns[patternIndex][channelIndex] || [0, 0, 0];

      // check if there are more channels
      hasMore |= boolToInt(!!patterns[patternIndex][channelIndex]);

      // get next offset, use the length of first channel
      nextSampleOffset = outSampleOffset +
        (patterns[patternIndex][0].length - 2 - boolToInt(!notFirstBeat)) * beatLength;

      // for each beat in pattern, plus one extra if end of sequence
      isSequenceEnd = sequenceIndex == sequence.length - 1;
      for (i = 2, k = outSampleOffset; i < patternChannel.length + isSequenceEnd; notFirstBeat = ++i) {
        // <channel-note>
        note = patternChannel[i];

        // stop if end, different instrument or new note
        stop = i == patternChannel.length + isSequenceEnd - 1 && isSequenceEnd ||
          boolToInt(instrument != (patternChannel[0] || 0)) | note | 0;

        // fill buffer with samples for previous beat, most cpu intensive part
        j = 0;
        while (j < beatLength && notFirstBeat) {
          // copy sample to stereo buffers with panning
          sample = (1 - attenuation) * sampleBuffer[sampleOffset++] / 2 || 0;
          leftChannelBuffer[k] = (leftChannelBuffer[k] || 0) - sample * panning + sample;
          rightChannelBuffer[k] = (rightChannelBuffer[k++] || 0) + sample * panning + sample;
          if (j++ > beatLength - 99 && stop) {
            attenuation += boolToInt(attenuation < 1) / 99;
          }
        }

        // set up for next note
        if (note) {
          // set attenuation
          attenuation = note % 1;
          panning = patternChannel[1] || 0;
          if (note |= 0) {
            // get cached sample
            sampleBuffer = sampleCache[
                [
                  instrument = patternChannel[sampleOffset = 0] || 0,
                  note,
                ]
            ] = sampleCache[[instrument, note]] || (
              // add sample to cache
              instrumentParameters = [...instruments[instrument]],
              instrumentParameters[2] *= 2 ** ((note - 12) / 12),

              // allow negative values to stop notes
              note > 0 ? zzfxG(...instrumentParameters) : []
            );
          }
        }
      }

      // update the sample offset
      outSampleOffset = nextSampleOffset;
    });
  }

  return [leftChannelBuffer, rightChannelBuffer];
};
