var numButtons = 16,
    height = Math.floor(Math.sqrt(numButtons)),
    width = Math.ceil(numButtons/height),
    midWidth = (width - 1) / 2,
    midHeight = (height - 1) / 2,
    colorOn = 0xffffff,
    colorOff = 0xff0000,
    colorPlay = 0xffff00,
    boards = [],
    t = 0,
    measure = 0,
    lastMeasure = null,
    padSize = 0.22,
    padDepth = 0.02,
    textSize = 0.05,
    skipOne = false,
    perMeasure = 1 / width,
    DIST = new THREE.Vector3(),
    env = new Primrose.BrowserEnvironment({
      groundTexture: "../images/deck.png",
      font: "../fonts/helvetiker_regular.typeface.json",
      backgroundColor: 0x000000,
      useFog: true,
      useGaze: isMobile,
      drawDistance: 10
    });

function text(size, text) {
  size = size || 1;
  return text3D(size * textSize, text).center();
}

function Board(type){
  this.object = hub();
  this.title = put(text3D(0.15, type)
      .center()
      .colored("text" + type, colorPlay))
    .on(this.object)
    .at(0, 0.7, -1.3)
    .obj();
  this.btns = [];
  this.btnState = [];
  this.type = type;
  range(numButtons, function(i){
    var x = Math.floor(i / height),
      y = i % height,
      lon = (midWidth - x) * 10,
      lat = (y - midHeight) * 10,
      btn = box(padSize, padSize, padDepth)
        .colored("btn" + i, colorOff)
        .latLon(lat, lon);
    put(box(padSize * 1.1, padSize * 1.1, padDepth * 0.9)
        .colored("bevel" + i, colorPlay))
      .on(btn);
    env.registerPickableObject(btn);
    btn.onselect = this.select.bind(this, i);
    btn.onenter = this.play.bind(this, i);
    this.object.add(btn);
    this.btns.push(btn);
  }.bind(this));
}

Board.prototype.play = function(i) {
  this.highlight(i, colorPlay);
  this.object.getWorldDirection(DIST);
  env.music.play(this.type, 25 - numButtons + i * 4, 0.25, perMeasure * 0.85,
    this.object.x, this.object.y, this.object.z,
    DIST.x, DIST.y, DIST.z)
    .then(function(){
      this.highlight(i);
    }.bind(this));
}

Board.prototype.update = function() {
  if(measure !== lastMeasure){
    for(var y = 0; y < height; ++y){
      var i = y * width + measure;
      if(this.btnState[i]){
        this.play(i);
      }
    }
  }
  DIST.set(this.object.position.x, env.input.head.position.y, this.object.position.z);
  this.object.position.lerp(DIST, 0.01);
};

Board.prototype.highlight = function(i, color) {
  color = color || this.btnState[i] && colorOn || colorOff;
  var btn = this.btns[i]
  btn.colored(btn.name, color);
};

Board.prototype.select = function(i, evt) {
  if(!env.input.hasMouse || evt.pointer.name === "MousePointer") {
    this.btnState[i] = !this.btnState[i];
    this.highlight(i);
  }
};

env.addEventListener("ready", function () {
  const types = Primrose.Output.Music.TYPES,
    nTypes = types.length;
  types.forEach(function(type, t) {
    var board = new Board(type);
    boards.push(board);
    env.scene.add(board.object);
    board.object.latLon(0, (t - (nTypes - 1) / 2) * 100 / nTypes);
  });
});

env.addEventListener("update", function(dt){
  if(!skipOne){
    t += dt;
    if(t > perMeasure){
      t -= perMeasure;
      measure = (measure + 1) % width;
    }
    boards.forEach(function(board) {
      board.update();
    });
    lastMeasure = measure;
  }
  skipOne = false;
});

window.addEventListener("focus", function(){
  skipOne = true;
});