pliny.function({
  name: "range",
  description: "| [under construction]"
});
function range(n, m, s, t) {
  var n2 = s && n || 0,
    m2 = s && m || n,
    s2 = t && s || 1,
    t2 = t || s || m;
  for (var i = n2; i < m2; i += s2) {
    t2(i);
  }
}