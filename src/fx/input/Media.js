Primrose.Input.Media = (function () {
  
  pliny.class({
    parent: "Primrose.Input",
    name: "Media",
    description: "Get access to audio and video sources connected to the computer."
  });
  class Media {
    constructor(options) {
      this.options = patch(options, Media.DEFAULTS);
      this.name = "Media";
      this.devices = null;

      console.info("Checking for media sources...");
      this.ready = navigator.mediaDevices.enumerateDevices().then((devices) => {
        console.log("Media devices found:", devices.length);
        this.devices = devices;
        return this.devices;
      });

      var getUserMediaFallthrough = (vidOpt) => new Promise((resolve, reject) => {
        navigator.getUserMedia({ video: vidOpt }, resolve, reject);
      });

      var tryModesFirstThen = (source, err, i) => {
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
          getUserMediaFallthrough(opt)
            .then(console.log.bind(console, fmt("Connected to camera at mode $1.", mode)))
            .catch((err) => {
              console.error(fmt("Failed to connect at mode $1. Reason: $2", mode, err));
              tryModesFirstThen(source, err, i + 1);
            });
        }
        else {
          err("no video modes specified.");
        }
      };

      this.connect = function (source) {
        tryModesFirstThen(source, function (err) {
          console.error(fmt(
            "Couldn't connect at requested resolutions. Reason: $1", err));
          getUserMediaFallthrough(true,
            console.log.bind(console,
              "Connected to camera at default resolution"),
            console.error.bind(console, "Final connect attempt"));
        });
      }.bind(this);
    }
  }

  Media.DEFAULTS = {
    videoModes: [
      { w: 320, h: 240 },
      { w: 640, h: 480 },
      "default"
    ]
  };

  return Media;
})();
