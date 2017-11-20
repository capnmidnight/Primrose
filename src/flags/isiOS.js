/*
pliny.value({
  parent: "Flags",
  name: "isiOS",
  type: "Boolean",
  description: "Flag indicating the current system is a device running the Apple iOS operating system: iPad, iPod Touch, iPhone. Useful for invoking optional code paths necessary to deal with deficiencies in Apple's implementation of web standards."
});
*/

export default /iP(hone|od|ad)/.test(navigator.userAgent || "");
