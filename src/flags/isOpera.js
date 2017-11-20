/*
pliny.value({
  parent: "Flags",
  name: "isOpera",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Opera."
});
*/

export default !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
