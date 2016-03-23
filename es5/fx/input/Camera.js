"use strict";

/* global Primrose, MediaStreamTrack, THREE, Navigator, pliny */

Primrose.Input.Camera = function () {

  /* polyfill */
  Navigator.prototype.getUserMedia = Navigator.prototype.getUserMedia || Navigator.prototype.webkitGetUserMedia || Navigator.prototype.mozGetUserMedia || Navigator.prototype.msGetUserMedia || Navigator.prototype.oGetUserMedia || function () {};

  pliny.issue("Primrose.Input.Camera", {
    name: "document Camera",
    type: "open",
    description: "Finish writing the documentation for the [Primrose.Input.Camera](#Primrose_Input_Camera) class in the input/ directory"
  });

  pliny.class("Primrose.Input", {
    name: "Camera",
    description: "| [under construction]"
  });
  function CameraInput(elem, id, size, x, y, z, options) {
    MediaStreamTrack.getSources(function (infos) {
      var option = document.createElement("option");
      option.value = "";
      option.innerHTML = "-- select camera --";
      elem.appendChild(option);
      for (var i = 0; i < infos.length; ++i) {
        if (infos[i].kind === "video") {
          option = document.createElement("option");
          option.value = infos[i].id;
          option.innerHTML = fmt("[Facing: $1] [ID: $2...]", infos[i].facing || "N/A", infos[i].id.substring(0, 8));
          option.selected = infos[i].id === id;
          elem.appendChild(option);
        }
      }
    });

    pliny.issue("Primrose.Input.Camera", {
      name: "document Camera.options",
      type: "open",
      description: ""
    });
    this.options = combineDefaults(options, CameraInput);

    pliny.issue("Primrose.Input.Camera", {
      name: "document Camera.videoElement",
      type: "open",
      description: ""
    });
    this.videoElement = document.createElement("video");

    pliny.issue("Primrose.Input.Camera", {
      name: "document Camera.buffer",
      type: "open",
      description: ""
    });
    this.buffer = document.createElement("canvas");

    pliny.issue("Primrose.Input.Camera", {
      name: "document Camera.gfx",
      type: "open",
      description: ""
    });
    this.gfx = this.buffer.getContext("2d");

    pliny.issue("Primrose.Input.Camera", {
      name: "document Camera.texture",
      type: "open",
      description: ""
    });
    this.texture = new THREE.Texture(this.buffer);
    var material = new THREE.MeshBasicMaterial({
      map: this.texture,
      useScreenCoordinates: false,
      color: 0xffffff,
      shading: THREE.FlatShading
    });

    this.gfx.width = 500;
    this.gfx.height = 500;
    this.gfx.fillStyle = "white";
    this.gfx.fillRect(0, 0, 500, 500);

    var geometry = new THREE.PlaneGeometry(size, size);
    geometry.computeBoundingBox();
    geometry.computeVertexNormals();

    pliny.issue("Primrose.Input.Camera", {
      name: "document Camera.mesh",
      type: "open",
      description: ""
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(x, y, z);

    pliny.issue("Primrose.Input.Camera", {
      name: "document Camera.streaming",
      type: "open",
      description: ""
    });
    this.streaming = false;
    this.videoElement.autoplay = 1;
    var getUserMediaFallthrough = function (vidOpt, success, err) {
      navigator.getUserMedia({ video: vidOpt }, function (stream) {
        streamURL = window.URL.createObjectURL(stream);
        this.videoElement.src = streamURL;
        success();
      }.bind(this), err);
    }.bind(this);

    var tryModesFirstThen = function (source, err, i) {
      i = i || 0;
      if (this.options.videoModes && i < this.options.videoModes.length) {
        var mode = this.options.videoModes[i];
        var opt = { optional: [{ sourceId: source }] };
        if (mode !== "default") {
          opt.mandatory = {
            minWidth: mode.w,
            minHeight: mode.h
          };
          mode = fmt("[w:$1, h:$2]", mode.w, mode.h);
        }
        getUserMediaFallthrough(opt, function () {
          console.log(fmt("Connected to camera at mode $1.", mode));
        }, function (err) {
          console.error(fmt("Failed to connect at mode $1. Reason: $2", mode, err));
          tryModesFirstThen(source, err, i + 1);
        });
      } else {
        err("no video modes specified.");
      }
    }.bind(this);

    this.videoElement.addEventListener("canplay", function () {
      if (!this.streaming) {
        this.streaming = true;
      }
    }.bind(this), false);

    this.videoElement.addEventListener("playing", function () {
      this.videoElement.height = this.buffer.height = this.videoElement.videoHeight;
      this.videoElement.width = this.buffer.width = this.videoElement.videoWidth;
      var aspectRatio = this.videoElement.videoWidth / this.videoElement.videoHeight;
      this.mesh.scale.set(aspectRatio, 1, 1);
    }.bind(this), false);

    pliny.issue("Primrose.Input.Camera", {
      name: "document Camera.connect",
      type: "open",
      description: ""
    });
    this.connect = function (source) {
      if (this.streaming) {
        try {
          if (window.stream) {
            window.stream.stop();
          }
          this.videoElement.src = null;
          this.streaming = false;
        } catch (err) {
          console.error("While stopping", err);
        }
      }

      tryModesFirstThen(source, function (err) {
        console.error(fmt("Couldn't connect at requested resolutions. Reason: $1", err));
        getUserMediaFallthrough(true, console.log.bind(console, "Connected to camera at default resolution"), console.error.bind(console, "Final connect attempt"));
      });
    }.bind(this);

    if (id) {
      this.connect(id);
    }
  }

  pliny.issue("Primrose.Input.Camera", {
    name: "document Camera.DEFAULTS",
    type: "open",
    description: ""
  });
  CameraInput.DEFAULTS = {
    videoModes: [{ w: 320, h: 240 }, { w: 640, h: 480 }, "default"]
  };

  pliny.issue("Primrose.Input.Camera", {
    name: "document Camera.update",
    type: "open",
    description: ""
  });
  CameraInput.prototype.update = function () {
    this.gfx.drawImage(this.videoElement, 0, 0);
    this.texture.needsUpdate = true;
  };
  return CameraInput;
}();
