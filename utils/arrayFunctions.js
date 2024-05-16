function containsMultipleData(target, pattern) {
  var value = 0;
  pattern.forEach(function (word) {
    value = value + +!!target.includes(word);
  });
  return value === 1;
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Removes empty elements (falsy values) from an array, creating a new one.
 *
 * @param {any[]} arr The array to be cleared.
 * @returns {any[]} A new array containing only the non-empty elements from the original array.
 * @throws {TypeError} If the input is not an array.
 */
function clearEmptyArray(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError("Input must be an array.");
  }

  // Use filter for efficient removal and avoid modifying the original array
  return arr.filter((item) => !!item); // !! coerces to boolean and removes falsy values
}

module.exports = {
  containsMultipleData,
  removeItemOnce,
  removeItemAll,
  shuffleArray,
  clearEmptyArray,
};
