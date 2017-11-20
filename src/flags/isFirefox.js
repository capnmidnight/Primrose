/*
pliny.value({
  parent: "Flags",
  name: "isFirefox",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Firefox."
});
*/

export default typeof window.InstallTrigger !== "undefined";
