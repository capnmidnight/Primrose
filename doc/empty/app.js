const env = new Primrose.BrowserEnvironment({
  backgroundColor: 0x000000,
  groundTexture: "../images/deck.png",
  useFog: true,
  useGaze: true,
  drawDistance: 100,
  fullScreenButtonContainer: "#fullScreenButtonContainer",
  progress: Preloader.thunk
});

var elements = [
  new Primrose.Controls.Image(
    ["../images/axis.png", "../images/box.jpg"], {
      pickable: true
    }).at(0, 1, -3),

  new Primrose.Controls.Model(
    "../models/dolphin.obj", {
      pickable: true
    }).at(0, 0, -3),

  new Primrose.Controls.Video(
    "../../../Legend3D/videos/fireplace.mp4", {
      pickable: true
    }).at(-1, 1, -3)
];

var events = ["select", "enter", "exit"];

elements.forEach((elem) => {
  env.appendChild(elem);
  events.forEach((evtname) =>
    elem.addEventListener(evtname, (evt) => console.log(elem.name + " " + evtname)));

  elem.addEventListener("enter", () => elem.position.z = -2.9);
  elem.addEventListener("exit", () => elem.position.z = -3);
});

env.addEventListener("ready", Preloader.hide);
