/*
pliny.function({
  parent: "Primrose.Displays",
  name: "calculateElementSize",
  description: "Figure out the size the canvas needs to be for rendering."
})
*/

import { isiOS, isLandscape } from "../../flags";

export default function calculateElementSize() {
  let width = 0,
    height = 0;

  if(!isiOS) {
    width = document.body.clientWidth,
    height = document.body.clientHeight;
  }
  else if(isLandscape()) {
    width = screen.height;
    height = screen.width;
  }
  else{
    width = screen.width;
    height = screen.height;
  }

  width *= devicePixelRatio;
  height *= devicePixelRatio;

  return { width, height };
}
