pliny.function({
  name: "range",
  description: "| [under construction]"
});

function range(n, m, s, t) {
  const n2 = s && n || 0,
    m2 = s && m || n,
    s2 = t && s || 1,
    t2 = t || s || m,
    output = [];
  for (let i = n2; i < m2; i += s2) {
    output.push(t2(i));
  }
  return output;
}