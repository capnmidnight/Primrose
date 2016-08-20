"use strict";

pliny.value({
  name: "isiOS",
  type: "Boolean",
  description: "Flag indicating the current system is a device running the Apple\n\
iOS operating system: iPad, iPod Touch, iPhone. Useful for invoking optional code\n\
paths necessary to deal with deficiencies in Apple's implementation of web standards."
});
window.isiOS = /iP(hone|od|ad)/.test(navigator.userAgent || "");