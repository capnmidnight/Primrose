const cache = {};
function debug(label, digits) {
  var val = this.toString(digits);
  if (val !== cache[label]) {
    cache[label] = val;
    console.log(label, val);
  }
}