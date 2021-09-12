
/**
 * Random number generator.
 *
 * LCG
 * https://stackoverflow.com/a/424445/2051724
 */
class RNG {
  /**
     * Creates a new random number generator.
     * @param {number} seed  The integer seed.
     */
  constructor(seed) {
    // LCG using GCC's constants
    this.m = 0x80000000; // 2**31;
    this.a = 1103515245;
    this.c = 12345;
    this.state = seed;
  }

  /**
     * @return {number}
     */
  nextInt() {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
  }

  /**
     * @return {number}
     */
  nextFloat() {
    // returns in range [0,1]
    return this.nextInt() / (this.m - 1);
  }

  /**
     * @param {number} start
     * @param {number} end
     * @return {number}
     */
  nextRange(start, end) {
    // returns in range [start, end): including start, excluding end
    // can't modulu nextInt because of weak randomness in lower bits
    const rangeSize = end - start;
    const randomUnder1 = this.nextInt() / this.m;
    return start + ((randomUnder1 * rangeSize) | 0);
  }
}
