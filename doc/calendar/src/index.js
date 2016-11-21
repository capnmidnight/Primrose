import * as liveAPI from "../../../src/live-api";
Object.assign(window, liveAPI);
import BrowserEnvironment from "../../../src/Primrose/BrowserEnvironment";
import randNum from "../../../src/Primrose/Random/number";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      primaryColor = 0xb09000,
      secondaryColor = 0x303030,
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
      deg2rad = (a) => Math.PI * a / 180,
      rad2deg = (r) => 180 * r / Math.PI,
      rand = () => randNum(0, dim),
      randDegree = () => randNum(-Math.PI, Math.PI),
      env = new BrowserEnvironment({
        groundTexture: "../images/deck.png",
        font: "../fonts/helvetiker_regular.typeface.json",
        backgroundColor: 0x000000,
        useFog: true,
        drawDistance: hDim / 2,
        enableShadows: true,
        fullScreenButtonContainer: "#fullScreenButtonContainer"
      });

let months = null,
    currentMonth = new Date().getMonth();

function setColor(){
  var date = new Date(),
      month = date.getMonth(),
      d = date.getDate() - 1;
  objs.forEach((o, i) => {
    if(o.box === this){
      o.box.material = primaryMaterial;
      o.lbl.material = secondaryMaterial;
      o.bev.material = secondaryMaterial;
    }
    else {
      o.box.material = (month === currentMonth && i === d) ? todayMaterial : secondaryMaterial;
      o.lbl.material = primaryMaterial;
      o.bev.material = primaryMaterial;
    }
  });
}

function text(text, size) {
  size = size || 1;
  return text3D(size * textSize, text).center();
}

function hitDate(month, date){
  var d = new Date();
  d.setMonth(month);
  d.setDate(date);
  env.speech.speak(dayNames[d.getDay()] + ", " + monthNames[month] + " " + date + ", " + d.getFullYear());
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
  env.ui.add(months[month].latLon(-72, 0));
  while(date.getMonth() === month){
    x = date.getDay();
    if(x < lastDay){
      ++y;
    }

    const d = date.getDate(),
          o = objs[d-1];
    if(today == d){
      o.box.material = todayMaterial;
    }
    else {
      o.box.material = secondaryMaterial;
    }
    o.box.onenter = setColor.bind(o.box);
    env.registerPickableObject(o.box);
    o.box.onselect = hitDate.bind(null, month, d);
    env.ui.add(o.hub.latLon(boxSpacing * (y - 2) - 45, boxSpacing * (3 - x)));
    date.setDate(date.getDate() + 1);
    lastDay = x;
  }
  env.ground.onenter = setColor.bind(env.ground);
}

env.addEventListener("ready", function(){
  env.insertFullScreenButtons("body");
  months = monthNames
    .map((month) => text(month, 3.5)
    .colored(primaryColor)
    .named(month));

  for(let d = 0; d < 31; ++d){
    const o = hub(),
          b = box(boxSize)
            .colored(secondaryColor)
            .named("box" + (d+1)),
          bev = box(boxSize * 1.1,boxSize * 1.1,boxSize * 0.9)
            .colored(primaryColor)
            .named("bev" + (d+1)),
          t = text((d + 1).toString())
            .colored(primaryColor)
            .named("txt" + (d + 1));

    t.castShadow = true;
    b.receiveShadow = true;
    t.position.z = 0.08;
    o.add(b);
    b.add(bev);
    b.add(t);
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
    .latLon(-20, 0, 1));
  env.ui.add(text("Click on dates.", 0.5)
    .colored(primaryColor)
    .named("inst2")
    .latLon(-17, 0, 1));
});

let lt = 0;
env.addEventListener("update", function(){
  const dt = env.turns.degrees - lt;
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