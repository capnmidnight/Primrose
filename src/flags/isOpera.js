pliny.value({
  name: "isOpera",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Opera.\n\
Opera is a substandard browser that lags adoption of cutting edge web technologies,\n\
so you are not likely to need this flag if you are using Primrose, other than to\n\
cajole users into downloading a more advanced browser such as Mozilla Firefox or\n\
Google Chrome."
});
export default isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;