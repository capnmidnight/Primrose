var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  months = null,
  currentMonth = new Date().getMonth(),
  primaryColor = 0xec2471,
  secondaryColor = 0xe0e0e0,
  todayColor = 0x306080,
  angleThreshold = 15,
  primaryMaterial = material({color:primaryColor}),
  secondaryMaterial = material({color:secondaryColor}),
  todayMaterial = material({color:todayColor}),
  objs = [],
  dim = 50,
  boxSize = dim / 300,
  boxSpacing = boxSize * 50,
  textSize = boxSize * 0.333,
  hDim = dim / 2,
  env = new Primrose.BrowserEnvironment({
    groundTexture: "../shared_assets/images/ideck.png",
    font: "../shared_assets/fonts/helvetiker_regular.typeface.json",
    backgroundColor: secondaryColor,
    useFog: true,
    drawDistance: hDim,
    enableShadows: true,
    fullScreenButtonContainer: "#fullScreenButtonContainer",
  });


function deg2rad(a) {
  return Math.PI * a / 180;
}

function rad2deg(r) {
  return 180 * r / Math.PI;
}

function rand() {
  Primrose.Random.number(0, dim);
}

function randDegree() {
  Primrose.Random.number(-Math.PI, Math.PI);
}

function setColor(isHighlighted){
  var date = new Date(),
      month = date.getMonth(),
      d = date.getDate() - 1;

  if(isHighlighted){
    this.box.material = primaryMaterial;
    this.lbl.material = secondaryMaterial;
    this.bev.material = secondaryMaterial;
  }
  else {
    this.box.material = secondaryMaterial;
    this.lbl.material = primaryMaterial;
    this.bev.material = primaryMaterial;
  }
}

function text(text, size) {
  size = size || 1;
  return text3D(size * textSize, text).center();
}

function hitDate(month, date){
  var d = new Date();
  d.setMonth(month);
  d.setDate(date);
  var msg = dayNames[d.getDay()] + ", " + monthNames[month] + " " + date + ", " + d.getFullYear();
  env.speech.speak(msg);
}

function showMonth(month){
  env.ui.children.splice(0);

  var date = new Date(),
      today = null;

  if(month == date.getMonth()) {
    today = date.getDate();
  }
  else{
    date.setMonth(month);
  }

  date.setDate(1);
  var x = 0,
    y = 0,
    lastDay = 0;
  env.ui.add(months[month].latLng(-72, 0));
  while(date.getMonth() === month){
    x = date.getDay();
    if(x < lastDay){
      ++y;
    }

    var d = date.getDate(),
      o = objs[d-1];
    if(today == d){
      o.box.material = todayMaterial;
    }
    else {
      o.box.material = secondaryMaterial;
    }

    o.box.addEventListener("enter", setColor.bind(o, true));
    o.box.addEventListener("exit", setColor.bind(o, false));
    o.box.addEventListener("select", hitDate.bind(null, month, d));
    env.ui.add(o.hub.latLng(boxSpacing * (y - 2) - 45, boxSpacing * (3 - x)));
    date.setDate(date.getDate() + 1);
    lastDay = x;
  }
}

env.addEventListener("ready", function(){
  env.insertFullScreenButtons("body");
  months = monthNames
    .map(function(month){
      return text(month, 3.5)
        .colored(primaryColor, {
          shadow: true
        })
        .named(month);
    });

  for(var d = 0; d < 31; ++d){
    var o = hub(),
      b = box(boxSize)
        .colored(secondaryColor)
        .named("box" + (d+1))
        .addTo(o),
      bev = box(boxSize * 1.1,boxSize * 1.1,boxSize * 0.9)
        .colored(primaryColor, {
          shadow: true
        })
        .named("bev" + (d+1))
        .addTo(b),
      t = text((d + 1).toString())
        .colored(primaryColor)
        .named("txt" + (d + 1))
        .addTo(b)
        .at(0, 0, 0.08);

    objs.push({
      hub: o,
      box: b,
      lbl: t,
      bev: bev
    });
  }

  showMonth(currentMonth);

  env.ui.add(text("Turn left or right to change month", 0.5)
    .colored(primaryColor)
    .named("inst1")
    .latLng(-20, 0, 1));
  env.ui.add(text("Click on dates.", 0.5)
    .colored(primaryColor)
    .named("inst2")
    .latLng(-17, 0, 1));

  Preloader.hide();
});

var lt = 0;
env.addEventListener("update", function(){
  var dt = env.turns.degrees - lt;
  if(Math.abs(dt) > angleThreshold){
    currentMonth = currentMonth + (dt < 0 ? 1 : -1);
    if(currentMonth < 0) {
      currentMonth += 12;
    }
    else if (currentMonth >= 12){
      currentMonth -= 12;
    }
    showMonth(currentMonth);
    lt = env.turns.degrees;
  }
});
