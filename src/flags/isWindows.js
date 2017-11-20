/*
pliny.value({
  parent: "Flags",
  name: "isWindows",
  type: "Boolean",
  description: "Flag indicating the current system is a computer running one of the Microsoft Windows operating systems."
});
*/

export default /Windows/.test(navigator.userAgent || "");
