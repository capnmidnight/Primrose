"use strict";

pliny.value({
  name: "isOSX",
  type: "Boolean",
  description: "Flag indicating the current system is a computer running the Apple\n\
OSX operating system. Useful for changing keyboard shortcuts to support Apple's\n\
idiosynchratic, concensus-defying keyboard shortcuts."
});
const isOSX = /Macintosh/.test(navigator.userAgent || "");