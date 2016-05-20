function addButton(text, thunk) {
  var btn = document.createElement("button");
  btn.type = "button";
  btn.appendChild(document.createTextNode(text));
  btn.addEventListener("click", thunk);
  document.getElementById("fullScreenButtonContainer").appendChild(btn);
}
function vrButton(display, i) {
  addButton(display.displayName, env.goVR.bind(env, i));
}
window.addEventListener("load", function () {
  env.addEventListener("ready", function () {
    addButton("Fullscreen", env.goFullScreen.bind(env));
    if (env.input.VRDisplays) {
      env.input.VRDisplays.forEach(vrButton);
    }
  }, false);
}, false);