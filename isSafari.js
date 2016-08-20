"use strict";

pliny.value({
  name: "isSafari",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Safari.\n\
Safari is an overly opinionated browser that thinks users should be protected from\n\
themselves in such a way as to prevent users from gaining access to the latest in\n\
cutting-edge web technologies. Essentially, it was replaced Microsoft Internet\n\
Explorer as the Internet Explorer of the web."
});
const isSafari = Object.prototype.toString.call(window.HTMLElement)
  .indexOf('Constructor') > 0;