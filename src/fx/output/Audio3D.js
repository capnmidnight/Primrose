Primrose.Output.Audio3D = (function () {

  // polyfill
  Window.prototype.AudioContext =
    Window.prototype.AudioContext ||
    Window.prototype.webkitAudioContext ||
    function () {
    };

  pliny.class({
    parent: "Primrose.Output",
    name: "Audio3D",
    description: "| [under construction]"
  });
  function Audio3D() {

    try {
      this.context = new AudioContext();
      this.sampleRate = this.context.sampleRate;
      this.mainVolume = this.context.createGain();

      var vec = new THREE.Vector3(),
        up = new THREE.Vector3(),
        left = new THREE.Matrix4().identity(),
        right = new THREE.Matrix4().identity(),
        swap = null;

      this.setVelocity = this.context.listener.setVelocity.bind(this.context.listener);
      this.setPlayer = (obj) => {
        var head = obj;
        left.identity();
        right.identity();
        while (head !== null) {
          left.fromArray(head.matrix.elements);
          left.multiply(right);
          swap = left;
          left = right;
          right = swap;
          head = head.parent;
        }
        swap = left;
        var mx = swap.elements[12],
          my = swap.elements[13],
          mz = swap.elements[14];
        swap.elements[12] = swap.elements[13] = swap.elements[14] = 0;

        this.context.listener.setPosition(mx, my, mz);
        vec.set(0, 0, 1);
        vec.applyProjection(right);
        vec.normalize();
        up.set(0, -1, 0);
        up.applyProjection(right);
        up.normalize();
        this.context.listener.setOrientation(vec.x, vec.y, vec.z, up.x, up.y, up.z);
        right.elements[12] = mx;
        right.elements[13] = my;
        right.elements[14] = mz;
      };
      this.isAvailable = true;
    }
    catch (exp) {
      console.error(exp);
      console.error("AudioContext not available.");
      this.isAvailable = false;
      this.setPlayer = function () {
      };
      this.setVelocity = function () {
      };
      this.start = function () {
      };
      this.stop = function () {
      };
      this.error = exp;
    }
  }


  Audio3D.prototype.start = function () {
    this.mainVolume.connect(this.context.destination);
  };

  Audio3D.prototype.stop = function () {
    this.mainVolume.disconnect();
  };

  Audio3D.prototype.loadURL = function (src) {
    return Primrose.HTTP.getBuffer(src)
      .then((data) => new Promise((resolve, reject) =>
        this.context.decodeAudioData(data, resolve, reject)));
  };

  Audio3D.prototype.loadURLCascadeSrcList = function (srcs, index) {
    index = index || 0;
    if (index >= srcs.length) {
      return Promise.reject("Failed to load a file from " + srcs.length + " files.");
    }
    else {
      return this.loadURL(srcs[index])
        .catch((err) => {
          console.error(err);
          return this.loadURLCascadeSrcList(srcs, index + 1);
        });
    }
  };

  Audio3D.prototype.createRawSound = function (pcmData) {
    if (pcmData.length !== 1 && pcmData.length !== 2) {
      throw new Error("Incorrect number of channels. Expected 1 or 2, got " + pcmData.length);
    }

    var frameCount = pcmData[0].length;
    if (pcmData.length > 1 && pcmData[1].length !== frameCount) {
      throw new Error(
        "Second channel is not the same length as the first channel. Expected " + frameCount + ", but was " + pcmData[1].length);
    }

    var buffer = this.context.createBuffer(pcmData.length, frameCount, this.sampleRate);
    for (var c = 0; c < pcmData.length; ++c) {
      var channel = buffer.getChannelData(c);
      for (var i = 0; i < frameCount; ++i) {
        channel[i] = pcmData[c][i];
      }
    }
    return buffer;
  };

  Audio3D.prototype.createSound = function (loop, buffer) {
    var snd = {
      volume: this.context.createGain(),
      source: this.context.createBufferSource()
    };
    snd.source.buffer = buffer;
    snd.source.loop = loop;
    snd.source.connect(snd.volume);
    return snd;
  };

  Audio3D.prototype.create3DSound = function (x, y, z, snd) {
    snd.panner = this.context.createPanner();
    snd.panner.setPosition(x, y, z);
    snd.panner.connect(this.mainVolume);
    snd.volume.connect(snd.panner);
    return snd;
  };

  Audio3D.prototype.createFixedSound = function (snd) {
    snd.volume.connect(this.mainVolume);
    return snd;
  };

  pliny.method({
    parent: "Primrose.Output.Audio3D",
    name: "loadSound",
    returns: "Promise<MediaElementAudioSourceNode>",
    parameters: [
      { name: "sources", type: "String|Array<String>", description: "A string URI to an audio source, or an array of string URIs to audio sources. Will be used as a collection of HTML5 &lt;source> tags as children of an HTML5 &lt;audio> tag." },
      { name: "loop", type: "Boolean", description: "(Optional) indicate that the sound should be played on loop." }
    ],
    description: "Loads the first element of the `sources` array for which the browser supports the file format as an HTML5 &lt;audio> tag to use as an `AudioSourceNode` attached to the current `AudioContext`. This does not load all of the audio files. It only loads the first one of a list of options that could work, because all browsers do not support the same audio formats.",
    examples: [{
      name: "Load a single audio file.",
      description: "There is no one, good, compressed audio format supported in all browsers, but they do all support uncompressed WAV. You shouldn't use this on the Internet, but it might be okay for a local solution.\n\
\n\
    grammar(\"JavaScript\");\n\
    var audio = new Primrose.Output.Audio3D();\n\
    audio.loadSource(\"mySong.wav\").then(function(node){\n\
      node.connect(audio.context.destination);\n\
    });"
    }, {
        name: "Load a single audio file from a list of options.",
        description: "There is no one, good, compressed audio format supported in all browsers. As a hack around the problem, HTML5 media tags may include one or more &lt;source> tags as children to specify a cascading list of media sources. The browser will select the first one that it can successfully decode.\n\
\n\
    grammar(\"JavaScript\");\n\
    var audio = new Primrose.Output.Audio3D();\n\
    audio.loadSource([\n\
      \"mySong.mp3\",\n\
      \"mySong.aac\",\n\
      \"mySong.ogg\"\n\
    ]).then(function(node){\n\
      node.connect(audio.context.destination);\n\
    });"
      }, {
        name: "Load an ambient audio file that should be looped.",
        description: "The only audio option that is available is whether or not the audio file should be looped. You specify this with the second parameter to the `loadSource()` method, a `Boolean` value to indicate that looping is desired.\n\
\n\
    grammar(\"JavaScript\");\n\
    var audio = new Primrose.Output.Audio3D();\n\
    audio.loadSource([\n\
      \"mySong.mp3\",\n\
      \"mySong.aac\",\n\
      \"mySong.ogg\"\n\
    ], true).then(function(node){\n\
      node.connect(audio.context.destination);\n\
    });"
      }]
  });
  Audio3D.prototype.loadSource = function (sources, loop) {
    return new Promise((resolve, reject) => {
      if (!(sources instanceof Array)) {
        sources = [sources];
      }
      var audio = document.createElement("audio");
      audio.autoplay = true;
      audio.loop = loop;
      sources.map((src) => {
        var source = document.createElement("source");
        source.src = src;
        return source;
      }).forEach(audio.appendChild.bind(audio));
      audio.oncanplay = () => {
        audio.oncanplay = null;
        var snd = {
          volume: this.context.createGain(),
          source: this.context.createMediaElementSource(audio)
        };
        snd.source.connect(snd.volume);
        resolve(snd);
      };
      audio.onerror = reject;
      document.body.appendChild(audio);
    });
  };

  Audio3D.prototype.load3DSound = function (src, loop, x, y, z) {
    return this.loadSource(src, loop).then(this.create3DSound.bind(this, x, y, z));
  };

  Audio3D.prototype.loadFixedSound = function (src, loop) {
    return this.loadSource(src, loop).then(this.createFixedSound.bind(this));
  };

  Audio3D.prototype.playBufferImmediate = function (buffer, volume) {
    var snd = this.createSound(false, buffer);
    snd = this.createFixedSound(snd);
    snd.volume.gain.value = volume;
    snd.source.addEventListener("ended", (evt) => {
      snd.volume.disconnect(this.mainVolume);
    });
    snd.source.start(0);
    return snd;
  };

  return Audio3D;
})();

