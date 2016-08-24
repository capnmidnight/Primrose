pliny.value({
  name: "isHomeScreen",
  type: "Boolean",
  description: "Flag indicating the script is currently running in an IFRAME or not."
});
const isInIFrame = (window.self !== window.top);