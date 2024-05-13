/**
 * Validates user input to allow only symbols '!_-+.' and a maximum length of 1 character.
 *
 * @param {string} input The user prefix to be validated.
 * @returns {boolean} True if the prefix is valid, false otherwise.
 */
function validateCommandPrefix(prefix) {
  const allowedSymbolsRegex = /^[!_-+.]$/;

  return prefix.length === 1 && allowedSymbolsRegex.test(prefix);
}

module.exports = { validateCommandPrefix };
