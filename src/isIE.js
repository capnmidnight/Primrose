pliny.value({
  name: "isIE",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Internet\n\
Explorer. Once the bane of every web developer's existence, it has since passed\n\
the torch on to Safari in all of its many useless incarnations."
});
const isIE = /*@cc_on!@*/ false || !!document.documentMode;