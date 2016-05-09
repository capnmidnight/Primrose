function addButton(text, thunk) {
  var btn = document.createElement("button");
  btn.type = "button";
  btn.appendChild(document.createTextNode(text));
  btn.addEventListener("click", thunk);
  document.getElementById("fullScreenButtonContainer").appendChild(btn);
}
function vrButton(display, i) {
  addButton(display.displayName, app.goVR.bind(app, i));
}
window.addEventListener("load", function () {
  app.addEventListener("ready", function () {
    addButton("Fullscreen", app.goFullScreen.bind(app));
    if (app.input.VRDisplays) {
      app.input.VRDisplays.forEach(vrButton);
    }
  }, false);
}, false);