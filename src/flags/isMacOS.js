pliny.value({
  name: "isMacOS",
  type: "Boolean",
  description: "Flag indicating the current system is a computer running the Apple\n\
macOS operating system. Useful for changing keyboard shortcuts to support Apple's\n\
idiosyncratic, consensus-defying keyboard shortcuts."
});
export default /Macintosh/.test(navigator.userAgent || "");