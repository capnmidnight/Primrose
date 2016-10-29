pliny.value({
  name: "isChrome",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Chrome\n\
or Chromium. Chromium was one of the first browsers to implement virtual reality\n\
features directly in the browser, thanks to the work of Brandon \"Toji\" Jones."
});
const isChrome = !!window.chrome && !window.isOpera;