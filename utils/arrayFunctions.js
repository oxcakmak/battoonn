function containsMultipleData(target, pattern) {
  var value = 0;
  pattern.forEach(function (word) {
    value = value + +!!target.includes(word);
  });
  return value === 1;
}

module.exports = { containsMultipleData };
