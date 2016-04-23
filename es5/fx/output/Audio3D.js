"use strict";

/* global Primrose, Window, pliny */

Primrose.Output.Audio3D = function () {

  // polyfill
  Window.prototype.AudioContext = Window.prototype.AudioContext || Window.prototype.webkitAudioContext || function () {};

  pliny.class({
    parent: "Primrose.Output",
    name: "Audio3D",
    description: "| [under construction]"
  });
  function Audio3D() {
    var _this = this;

    try {
      this.context = new AudioContext();
      this.sampleRate = this.context.sampleRate;
      this.mainVolume = this.context.createGain();
      this.mainVolume.connect(this.context.destination);

      var vec = new THREE.Vector3(),
          up = new THREE.Vector3(),
          left = new THREE.Matrix4().identity(),
          right = new THREE.Matrix4().identity(),
          swap = null;

      this.setVelocity = this.context.listener.setVelocity.bind(this.context.listener);
      this.setPlayer = function (obj) {
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

        _this.context.listener.setPosition(mx, my, mz);
        vec.set(0, 0, 1);
        vec.applyProjection(right);
        vec.normalize();
        up.set(0, -1, 0);
        up.applyProjection(right);
        up.normalize();
        _this.context.listener.setOrientation(vec.x, vec.y, vec.z, up.x, up.y, up.z);
        right.elements[12] = mx;
        right.elements[13] = my;
        right.elements[14] = mz;
      };
      this.isAvailable = true;
    } catch (exp) {
      this.isAvailable = false;
      this.setPosition = function () {};
      this.setVelocity = function () {};
      this.setOrientation = function () {};
      this.error = exp;
      console.error("AudioContext not available. Reason: ", exp.message);
    }
  }

  Audio3D.prototype.loadBuffer = function (src) {
    var _this2 = this;

    return Primrose.HTTP.getBuffer(src).then(function (data) {
      return new Promise(function (resolve, reject) {
        return _this2.context.decodeAudioData(data, resolve, reject);
      });
    });
  };

  Audio3D.prototype.loadBufferCascadeSrcList = function (srcs, index) {
    var _this3 = this;

    index = index || 0;
    if (index >= srcs.length) {
      return Promise.reject("Failed to load a file from " + srcs.length + " files.");
    } else {
      return this.loadBuffer(srcs[index]).catch(function () {
        return setTimeout(_this3.loadBufferCascadeSrcList(_this3, srcs, index + 1), 0);
      });
    }
  };

  Audio3D.prototype.createRawSound = function (pcmData) {
    if (pcmData.length !== 1 && pcmData.length !== 2) {
      throw new Error("Incorrect number of channels. Expected 1 or 2, got " + pcmData.length);
    }

    var frameCount = pcmData[0].length;
    if (pcmData.length > 1 && pcmData[1].length !== frameCount) {
      throw new Error("Second channel is not the same length as the first channel. Expected " + frameCount + ", but was " + pcmData[1].length);
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

  Audio3D.prototype.loadSound = function (src, loop) {
    return this.loadBuffer(src).then(this.createSound.bind(this, loop));
  };

  Audio3D.prototype.loadSoundCascadeSrcList = function (srcs, loop) {
    return this.loadBufferCascadeSrcList(srcs).then(this.createSound.bind(this, loop));
  };

  Audio3D.prototype.load3DSound = function (src, loop, x, y, z) {
    return this.loadSound(src, loop).then(this.create3DSound.bind(this, x, y, z));
  };

  Audio3D.prototype.load3DSoundCascadeSrcList = function (srcs, loop, x, y, z) {
    return this.loadSoundCascadeSrcList(srcs, loop).then(this.create3DSound.bind(this, x, y, z));
  };

  Audio3D.prototype.loadFixedSound = function (src, loop) {
    return this.loadSound(src, loop).then(this.createFixedSound.bind(this));
  };

  Audio3D.prototype.loadFixedSoundCascadeSrcList = function (srcs, loop) {
    return this.loadSoundCascadeSrcList(srcs, loop).then(this.createFixedSound.bind(this));
  };

  Audio3D.prototype.playBufferImmediate = function (buffer, volume) {
    var _this4 = this;

    var snd = this.createSound(false, buffer);
    snd = this.createFixedSound(snd);
    snd.volume.gain.value = volume;
    snd.source.addEventListener("ended", function (evt) {
      snd.volume.disconnect(_this4.mainVolume);
    });
    snd.source.start(0);
    return snd;
  };

  return Audio3D;
}();
