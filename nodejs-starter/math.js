function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

// this is the most common way of exporting functions in Node.js
module.exports = {
  add,
  subtract,
};

// another way of exporting functions
// exports.add = add;
// exports.subtract = subtract;
