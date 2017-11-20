/*
pliny.value({
  parent: "Flags",
  name: "isMacOS",
  type: "Boolean",
  description: "Flag indicating the current system is a computer running the Apple macOS operating system. Useful for changing keyboard shortcuts to support Apple's idiosyncratic, consensus-defying keyboard shortcuts."
});
*/

export default /Macintosh/.test(navigator.userAgent || "");
