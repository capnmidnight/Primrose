/*
pliny.value({
  parent: "Flags",
  name: "isHomeScreen",
  type: "Boolean",
  description: "Flag indicating the script is currently running in an IFRAME or not."
});
*/

export default (window.self !== window.top);
