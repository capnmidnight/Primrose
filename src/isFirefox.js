"use strict";

pliny.value({
  name: "isFirefox",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Firefox.\n\
Firefox was one of the first browsers to implement virtual reality features directly\n\
in the browser, thanks to the work of the MozVR team."
});
const isFirefox = typeof window.InstallTrigger !== 'undefined';