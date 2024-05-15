/**
 * Validates user input to allow only symbols '!_-+.' and a maximum length of 1 character.
 *
 * @param {string} input The user prefix to be validated.
 * @returns {boolean} True if the prefix is valid, false otherwise.
 */
function validateCommandPrefix(prefix) {
  const allowedSymbolsRegex = /^[!\-_.+]$/;
  return prefix.length === 1 && allowedSymbolsRegex.test(prefix);
}

function splitString(input) {
  // Regular expression that matches the characters !, _, -, +, .
  // Note: - is escaped as \- and . is escaped as \.
  const regex = /[!\_\-+\.]/;

  // Split the string based on the pattern
  const result = input.split(regex);

  return result;
}

/**
 * Splits a string based on special characters (!, -, _, +, .) while ensuring the string contains only allowed characters.
 *
 * @param {string} str The string to split.
 * @throws {Error} If the string contains invalid characters.
 * @returns {string[]} An array of substrings separated by the allowed special characters.
 */
function splitStringBySpecialChars(str) {
  // Regular expression to match allowed characters
  const allowedChars = /[!\_\-+\.]/;

  // Validate input string
  if (!allowedChars.test(str)) return false;

  // Split the string using the allowed characters as separators
  return str.split(/[!\_\-+\.]/);
}

/**
 * Checks if a string starts with one of the specified special characters: !, -, _, +, or ..
 *
 * @param {string} str The string to check.
 * @param {boolean} [extractFirstChar=false] Optional flag indicating whether to extract the first character if it's a special character. Defaults to false.
 * @returns {boolean|string} If the string starts with a special character:
 *  - `true` if `extractFirstChar` is false.
 *  - The extracted first character if `extractFirstChar` is true.
 *  Otherwise, returns `false`.
 */
function startsWithSpecialChar(str, extractFirstChar = false) {
  const allowedChars = /^[!_-\+.]/; // Regular expression for allowed special characters

  const match = allowedChars.exec(str);
  return match ? (extractFirstChar ? match[0] : true) : false;
}

module.exports = {
  validateCommandPrefix,
  splitStringBySpecialChars,
  startsWithSpecialChar,
};
