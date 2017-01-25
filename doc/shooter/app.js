var cube = range(6, function(i) { return "../images/space" + i + ".jpg"; }),
  env = new Primrose.BrowserEnvironment({
    font: "../fonts/helvetiker_regular.typeface.json",
    skyTexture: cube,
    backgroundColor: 0x000000,
    drawDistance: 100,
    gazeLength: 0.25,
    showHeadPointer: isMobile,
    ambientSound: "../audio/space.ogg",
    fullScreenButtonContainer: "#fullScreenButtonContainer",
    progress: Preloader.thunk
  }),
  blocks = [],
  shots = [],
  TEMP = v3(),
  baseVectorSize = 3,
  asteroidColor = 0x7f7f7f,
  shotSoundType = "sawtooth",
  asteroid = [
    box(baseVectorSize)
      .colored(asteroidColor)
      .named("asteroid1"),
    [],
    []
  ],
  sounds = null,
  nextSound = 0,
  explosion = null,
  checker = raycaster();
for(var s = 1; s <= 2; ++s){
  for(var x = 0; x < 2; ++x){
    for(var y = 0; y < 2; ++y){
      for(var z = 0; z < 2; ++z){
        var sz = baseVectorSize * 0.5 / s,
          b = box(sz)
            .colored(asteroidColor)
            .named("asteroid" + s + "_" + x + "_" + y + "_" + z);
        b.position.set(sz * (x - 1), sz * (y - 1), sz * (z - 1));
        asteroid[s].push(b);
      }
    }
  }
}

function fixAudio(){
  var auds = document.querySelectorAll("audio");
  for(var i = 0; i < audio.length; ++i){
    auds[i].play();
  }

  if(auds.length > 0){
    env.options.fullScreenElement.removeEventListener("mousedown", fixAudio);
    env.options.fullScreenElement.removeEventListener("touchstart", fixAudio);
    env.options.fullScreenElement.removeEventListener("keydown", fixAudio);
  }
}

env.addEventListener("ready", function(){
  if(isMobile){
    env.options.fullScreenElement.addEventListener("mousedown", fixAudio);
    env.options.fullScreenElement.addEventListener("touchstart", fixAudio);
    env.options.fullScreenElement.addEventListener("keydown", fixAudio);
  }
  env.insertFullScreenButtons("body");
  Promise.all(range(10, function() {
    return new Primrose.Audio.Sound(env.audio, "../audio/exp.ogg").ready;
  }))
    .then(function(snds) {
      sounds = snds;
      range(10, function(){
        var b = asteroid[0].clone();
        b.nextSize = 1;
        b.position.copy(Primrose.Random.vector(-15, 15));
        b.velocity = Primrose.Random.vector(-1, 1);
        blocks.push(b);
        env.scene.add(b);
      });

      Preloader.hide();
    });
});

function updateObj(obj, dt) {
  if(obj.velocity){
    TEMP.copy(obj.velocity)
      .multiplyScalar(dt)
      .add(obj.position);
    obj.position.copy(TEMP);
    if(obj.sound){
      obj.sound.at(obj.position.x, obj.position.y, obj.position.z,
        obj.velocity.x, obj.velocity.y, obj.velocity.z);
    }
  }
};

env.addEventListener("update", function(){
  const dt = env.deltaTime;
  for(var i = 0; i < blocks.length; ++i){
    var block = blocks[i];
    TEMP.copy(env.input.head.position)
      .sub(block.position);
    var dist = TEMP.lengthSq();
    block.velocity.add(TEMP.normalize()
      .multiplyScalar(0.5 / dist));
    updateObj(block, dt);
  }

  for(var i = 0; i < shots.length; ++i){
    var shot = shots[i],
      v = shot.velocity.lengthSq() * dt;
    updateObj(shot, dt);
    shot.age -= dt;
    if(shot.age <= 0){
      shot.visible = false;
    }
    if(shot.visible){
      checker.set(shot.position, shot.velocity);
      checker.ray.direction.normalize();
      var hits = checker.intersectObjects(blocks);
      for(var j = 0; j < hits.length; ++j) {
        var hit = hits[j],
          d = hit.distance * hit.distance;
        if(d < v){
          shot.age = 0;
          shot.visible = false;
          var block = hit.object,
            k = blocks.indexOf(block);
          if(sounds){
            var snd = sounds[nextSound];
            nextSound = (nextSound + 1) % sounds.length;
            snd.play()
              .at(block.position.x, block.position.y, block.position.z,
                block.velocity.x, block.velocity.y, block.velocity.z);
          }
          env.scene.remove(block);
          if(block.nextSize < asteroid.length){
            var newBlocks = asteroid[block.nextSize];
            for(var l = 0; l < newBlocks.length; ++l){
              var newBlock = newBlocks[l].clone();
              newBlock.velocity = Primrose.Random.vector(-1, 1)
                .add(block.velocity);
              newBlock.position.add(block.position);
              newBlock.nextSize = block.nextSize + 1;
              if(l === 0){
                blocks[k] = newBlock;
              }
              else{
                blocks.push(newBlock);
              }
              env.scene.add(newBlock);
            }
          }
          else{
            blocks.splice(k, 1);
          }
          break;
        }
      }
    }
  }
});

function shoot(evt){
  var n = 0;
  for(n = 0; n < shots.length; ++n){
    if(!shots[n].visible){
      break;
    }
  }
  var block = null;
  if(n >= shots.length){
    block = box(0.01, 0.01, 0.05)
      .colored(0xffff7f, {
        unshaded: true
      })
      .named("shot" + shots.length);
    block.velocity = v3();
    shots.push(block);
    env.scene.add(block);
  }
  else{
    block = shots[n];
  }
  block.position.copy(evt.pointer.picker.ray.origin);
  block.position.y -= 0.5;
  block.position.x += (2 * (n % 2) - 1) * 0.5;
  block.velocity.copy(evt.pointer.picker.ray.direction)
    .multiplyScalar(10);
  block.age = 3;
  block.lookAt(TEMP.copy(block.position).add(block.velocity));
  block.visible = true;
  block.sound = env.music.getOsc(shotSoundType)
    .on(30, 0.25)
    .at(block.position.x, block.position.y, block.position.z,
      block.velocity.x, block.velocity.y, block.velocity.z)
    .on(5, 0.25, 0.5, true)
    .off(0.51);
}

env.sky.addEventListener("select", shoot);