
/**
 * Kills an event by preventing default behavior and stopping all propagation.
 * @param {!Event} e
 */
const killEvent = (e) => {
  e.preventDefault();
  e.stopPropagation();
};
