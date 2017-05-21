export default function calculateElementSize(display) {
  let width = 0,
    height = 0;

  if(!isiOS) {
    const curLayer = display.getLayers()[0],
      elem = display.DOMElement || curLayer && curLayer.source || document.body;
    width = elem.clientWidth,
    height = elem.clientHeight;
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
