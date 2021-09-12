
const icon = '👨‍🚀';

const gameName = 'Captain Callisto';

/**
 * Adds an OS13k trophy.
 * @param {string} trophyName
 * @param {string=} message
 */
const addTrophy = (trophyName, message = '') => {
  localStorage[`OS13kTrophy,${icon},${gameName},${trophyName}`] = message;
};

/**
 * Registers a song with OS13k.
 * @param {string} songName
 * @param {!Object} song
 */
const registerSong = (songName, song) => {
  localStorage[`OS13kMusic,${songName}`] = JSON.stringify(song);
};
