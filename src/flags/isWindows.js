pliny.value({
  name: "isWindows",
  type: "Boolean",
  description: "Flag indicating the current system is a computer running one of the Microsoft Windows operating systems."
});
export default isWindows = /Windows/.test(navigator.userAgent || "");