const { DateTime } = require("luxon");

// Output: 5/7/2024 01:16
function formattedCurrentDateTime() {
  return DateTime.now().toFormat("D T");
}

function timestampToFormattedDateTime(str) {
  return DateTime.fromMillis(str).toFormat("D T");
}

// Define time unit symbols and their corresponding Luxon duration units
const units = {
  i: "minutes",
  h: "hours",
  d: "days",
  w: "weeks",
  m: "months",
  y: "years",
};

/**
 * Function to add a time duration to the current date using Luxon.
 *
 * @param {string} timeString - A string representing the time duration.
 * Format: "<number><unit>", where:
 * - number: An integer representing the time value.
 * - unit: A character representing the time unit (m: minutes, h: hours, d: days, w: weeks, M: months, y: years).
 * @returns {object} An object containing two properties:
 * - firstFutureDate: The date after adding the specified time duration. (ISO 8601 format)
 * - formattedFirstDate: The first future date formatted concisely (e.g., "1m", "2h", "1w").
 */
function addTime(timeString) {
  if (!timeString || typeof timeString !== "string") {
    throw Error("Invalid time string provided.");
  }

  const timeMatch = timeString.match(/^(\d+)([ihdwmy])$/i); // Regular expression for time string format validation
  if (!timeMatch) {
    throw Error(`Invalid time string format: ${timeString}`);
  }

  const timeValue = parseInt(timeMatch[1]);
  const timeUnit = units[timeMatch[2].toLowerCase()]; // Use defined units object

  const dateString = DateTime.now();
  const duration = {};
  duration[timeUnit] = timeValue;

  return dateString.plus(duration).toFormat("D T");
}

/**
 * Function to convert a time duration string to a descriptive format.
 *
 * @param {string} timeString - A string representing the time duration.
 * Format: "<number><unit>", where:
 * - number: An integer representing the time value.
 * - unit: A character representing the time unit (i: minutes, h: hours, d: days, w: weeks, m: months, y: years).
 * @returns {string} The descriptive format of the time duration (e.g., "1 minute", "2 hours").
 */
function formatTimeDuration(timeString) {
  if (!timeString || typeof timeString !== "string") {
    throw new Error("Invalid time string provided.");
  }

  const timeMatch = timeString.match(/^(\d+)([ihwdmy])$/i); // Regular expression for time string format validation
  if (!timeMatch) {
    throw new Error(`Invalid time string format: ${timeString}`);
  }

  const timeValue = parseInt(timeMatch[1]);
  const unit = units[timeMatch[2].toLowerCase()]; // Use defined units object

  // Handle singular/plural forms based on time value
  const formattedUnit = timeValue === 1 ? unit : `${unit}`;

  return `${timeValue} ${formattedUnit
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")}`;
}

module.exports = {
  formattedCurrentDateTime,
  timestampToFormattedDateTime,
  addTime,
  formatTimeDuration,
};
