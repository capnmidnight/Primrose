pliny.value({
  name: "isChrome",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Chrome\n\
or Chromium."
});
import isOpera from "./isOpera";
export default isChrome = !!window.chrome && !isOpera;