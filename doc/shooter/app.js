var cube = range(0, 6, function(i) { return "../images/space" + i + ".jpg"; }),
  env = new Primrose.BrowserEnvironment({
    font: "../fonts/helvetiker_regular.typeface.json",
    skyTexture: cube,
    backgroundColor: 0x000000,
    drawDistance: 100,
    gazeLength: 0.25,
    showHeadPointer: isMobile,
    ambientSound: "../audio/space.ogg"
  }),
  blocks = [],
  shots = [],
  TEMP = new THREE.Vector3(),
  baseVectorSize = 3,
  asteroidColor = 0x7f7f7f,
  shotSoundType = "sawtooth",
  asteroid = [
    box(baseVectorSize).colored("asteroid1", asteroidColor),
    [],
    []
  ],
  sounds = null,
  nextSound = 0,
  explosion = null,
  checker = new THREE.Raycaster();
for(var s = 1; s <= 2; ++s){
  for(var x = 0; x < 2; ++x){
    for(var y = 0; y < 2; ++y){
      for(var z = 0; z < 2; ++z){
        var sz = baseVectorSize * 0.5 / s,
          b = box(sz)
            .colored("asteroid" + s + "_" + x + "_" + y + "_" + z, asteroidColor);
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
  Promise.all(range(0, 10, () => env.audio.loadSource("../audio/exp.ogg")))
    .then(function(snds) {
      sounds = snds;
      for(var i = 0; i < sounds.length; ++i){
        var snd = sounds[i];
        snd.volume.gain.setValueAtTime(0, env.audio.context.currentTime);
        snd.volume.connect(env.audio.mainVolume);
      }
      for(var i = 0; i < 10; ++i){
        var b = asteroid[0].clone();
        b.nextSize = 1;
        b.position.copy(Primrose.Random.vector(-15, 15));
        b.velocity = Primrose.Random.vector(-1, 1);
        blocks.push(b);
        env.scene.add(b);
      }
    });
});

THREE.Object3D.prototype.update = function(dt) {
  if(this.velocity){
    TEMP.copy(this.velocity)
      .multiplyScalar(dt)
      .add(this.position);
    if(this.age !== undefined) {
      this.lookAt(TEMP);
    }
    this.position.copy(TEMP);
  }
};

env.addEventListener("update", function(dt){
  for(var i = 0; i < blocks.length; ++i){
    var block = blocks[i];
    TEMP.copy(env.input.head.position)
      .sub(block.position);
    var dist = TEMP.lengthSq();
    block.velocity.add(TEMP.normalize()
      .multiplyScalar(0.5 / dist));
    block.update(dt);
  }

  for(var i = 0; i < shots.length; ++i){
    var shot = shots[i],
      v = shot.velocity.lengthSq() * dt;
    shot.update(dt);
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
          if(sounds){
            var snd = sounds[nextSound];
            nextSound = (nextSound + 1) % sounds.length;
            snd.volume.gain.setValueAtTime(1, env.audio.context.currentTime);
            snd.source.mediaElement.play()
              .then(console.log.bind(console));
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
      .colored("shot" + shots.length, 0xffff7f, {
        unshaded: true
      });
    block.velocity = new THREE.Vector3();
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
  block.visible = true;
  var note = env.music.noteOn(shotSoundType, 0.25, 30, block.position.x, block.position.y, block.position.z);
  note.timeout = setTimeout(function(i){
    env.music.noteOff(shotSoundType, i)
  }, 500, note.index);
  note.osc.frequency.exponentialRampToValueAtTime(Primrose.Output.Music.piano(5), env.audio.context.currentTime + 0.5);
}

env.addEventListener("pointerend", shoot);
env.addEventListener("gazecomplete", shoot);