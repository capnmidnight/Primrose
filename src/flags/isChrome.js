/*
pliny.value({
  parent: "Flags",
  name: "isChrome",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Chrome or Chromium."
});
*/

import isOpera from "./isOpera";


export default !!window.chrome && !isOpera;
