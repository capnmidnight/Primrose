pliny.function({
  name: "findProperty",
  description: "| [under construction]"
});
function findProperty(elem, arr) {
  for (var i = 0; i < arr.length; ++i) {
    if (elem[arr[i]] !== undefined) {
      return arr[i];
    }
  }
}