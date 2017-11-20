/*
pliny.value({
  parent: "Flags",
  name: "isWebKit",
  type: "Boolean",
  description: "Flag indicating the browser is one of Chrome, Safari, or Opera. WebKit browsers have certain issues in common that can be treated together, like a common basis for orientation events."
});
*/

import isOpera from "./isOpera";
import isChrome from "./isChrome";
import isSafari from "./isSafari";


export default isOpera || isChrome || isSafari;
