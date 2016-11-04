const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      primaryColor = 0xb09000,
      secondaryColor = 0x303030,
      todayColor = 0x306080,
      angleThreshold = 15,
      primaryMaterial = new THREE.MeshStandardMaterial({color:primaryColor}),
      secondaryMaterial = new THREE.MeshStandardMaterial({color:secondaryColor}),
      todayMaterial = new THREE.MeshStandardMaterial({color:todayColor}),
      objs = [],
      dim = 50,
      boxSize = dim / 300,
      boxSpacing = boxSize * 50,
      textSize = boxSize * 0.333,
      hDim = dim / 2,
      deg2rad = (a) => Math.PI * a / 180,
      rad2deg = (r) => 180 * r / Math.PI,
      rand = () => Primrose.Random.number(0, dim),
      randDegree = () => Primrose.Random.number(-Math.PI, Math.PI),
      env = new Primrose.BrowserEnvironment({
        groundTexture: "../images/deck.png",
        font: "../fonts/helvetiker_regular.typeface.json",
        backgroundColor: 0x000000,
        useFog: true,
        drawDistance: hDim / 2
      });

let months = null,
    currentMonth = new Date().getMonth();

THREE.Mesh.prototype.select = function(thunk){
  env.registerPickableObject(this);
  this.onselect = thunk;
  return this;
};

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
    o.box.select(hitDate.bind(null, month, d));
    env.ui.add(o.hub.latLon(boxSpacing * (y - 2) - 45, boxSpacing * (3 - x)));
    date.setDate(date.getDate() + 1);
    lastDay = x;
  }
  env.ground.onenter = setColor.bind(env.ground);
}

env.addEventListener("ready", function(){
  env.insertFullScreenButtons("body");
  env.renderer.shadowMap.enabled = true;
  env.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  env.sun.castShadow = true;
  env.sun.shadow.mapSize.width =
  env.sun.shadow.mapSize.height = 1024;
  months = monthNames
    .map((month) => text(month, 3.5)
    .colored(month, primaryColor));

  for(let d = 0; d < 31; ++d){
    const o = hub(),
          b = box(boxSize)
            .colored("box" + (d+1), secondaryColor),
          bev = box(boxSize * 1.1,boxSize * 1.1,boxSize * 0.9)
            .colored("bev" + (d+1), primaryColor),
          t = text((d + 1).toString())
            .colored("txt" + (d + 1), primaryColor);

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
    .colored("inst1", primaryColor)
    .latLon(-20, 0, 1));
  env.ui.add(text("Click on dates.", 0.5)
    .colored("inst2", primaryColor)
    .latLon(-17, 0, 1));
});

let lt = 0;
env.addEventListener("update", function(){
  const dt = rad2deg(env.turns - lt);
  if(Math.abs(dt) > angleThreshold){
    currentMonth = currentMonth + (dt < 0 ? 1 : -1);
    if(currentMonth < 0) {
      currentMonth += 12;
    }
    else if (currentMonth >= 12){
      currentMonth -= 12;
    }
    showMonth(currentMonth);
    lt = env.turns;
  }
});