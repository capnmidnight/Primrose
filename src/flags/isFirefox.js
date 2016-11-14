pliny.value({
  name: "isFirefox",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Firefox."
});
export default isFirefox = typeof window.InstallTrigger !== 'undefined';