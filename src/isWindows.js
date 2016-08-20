"use strict";

pliny.value({
  name: "isWindows",
  type: "Boolean",
  description: "Flag indicating the current system is a computer running one of\n\
the Microsoft Windows operating systems. We have not yet found a use for this flag."
});
const isWindows = /Windows/.test(navigator.userAgent || "");