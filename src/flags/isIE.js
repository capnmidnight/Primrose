/*
pliny.value({
  parent: "Flags",
  name: "isIE",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Internet Explorer. Once the bane of every web developer's existence, it has since passed the torch on to Safari in all of its many useless incarnations."
});
*/

export default /*@cc_on!@*/ false || !!document.documentMode;
