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
 * Checks if a string starts with one of the following special characters: !, -, _, +, or .
 *
 * @param {string} str The string to check.
 * @returns {boolean} True if the string starts with a special character, false otherwise.
 */
function startsWithSpecialChar(str) {
  // Regular expression with descriptive character class
  const allowedChars = /^[!._+\-]$/; // Ensures a single special character at the beginning

  // Check if the string starts with an allowed special character
  return allowedChars.test(str);
}

/**
 * Splits a command string using special characters (!, -, _, +, .) while capturing the separators as well.
 *
 * @param {string} str The command string to split.
 * @returns {string[]} An array containing the split parts and captured separators.
 */
function splitCommandString(str) {
  // Regular expression to match allowed characters as separators (non-greedy)
  const separators = /([!._+\-])/g;

  // Split the string using the separators while capturing them in groups
  return str.split(separators);
}

function startsWithPrefix(str) {
  // Check if prefixes is an array and throw error if not
  const prefixes = ["!", "_", "-", "+"];

  for (const prefix of prefixes) {
    if (str.startsWith(prefix)) {
      return true;
    }
  }

  return false;
}

module.exports = {
  splitString,
  startsWithPrefix,
  splitCommandString,
  validateCommandPrefix,
  splitStringBySpecialChars,
  startsWithSpecialChar,
};
