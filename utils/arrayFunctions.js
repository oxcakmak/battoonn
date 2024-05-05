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

module.exports = { containsMultipleData, removeItemOnce, removeItemAll };
