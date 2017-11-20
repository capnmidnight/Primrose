/*
pliny.function({
  parent: "Flags",
  name: "isLandscape",
  returns: "Boolean",
  description: "Indicates whether or not the phone has been flipped to landscape mode."
});
*/

export default function isLandscape() {
  return Math.abs(window.orientation) === 90;
};
