Primrose.Controls.VUMeter = (function () {
  "use strict";

  var COUNTER = 0;

  pliny.class({
    parent: "Primrose.Controls",
      name: "VUMeter",
      baseClass: "Primrose.Surface",
      description: "A visualization of audio data.",
      parameters: [{
        name: "analyzer",
        type: "MediaStream",
        description: "The audio stream to analyze."
      }, {
        name: "options",
        type: "Object",
        description: "Named parameters for creating the Button."
      }]
  });
  class VUMeter extends Primrose.Surface {

    constructor(analyzer, options) {
      ////////////////////////////////////////////////////////////////////////
      // normalize input parameters
      ////////////////////////////////////////////////////////////////////////

      options = options || {};
      if (typeof options === "string") {
        options = {
          value: options
        };
      }

      super(patch(options, {
        id: "Primrose.Controls.VUMeter[" + (COUNTER++) + "]",
        bounds: new Primrose.Text.Rectangle(0, 0, 512, 256),
        backgroundColor: 0x000000,
        foregroundColor: 0xffffff
      }));

      ////////////////////////////////////////////////////////////////////////
      // initialization
      ///////////////////////////////////////////////////////////////////////

      this.analyzer = analyzer;
      this.analyzer.fftSize = this.bounds.width;
      this.buffer = new Uint8Array(this.analyzer.frequencyBinCount);
    }

    addToBrowserEnvironment(env, scene) {
      var imageMesh = textured(quad(0.5, 0.5 * this.imageHeight / this.imageWidth), this);
      scene.add(imageMesh);
      env.registerPickableObject(imageMesh);
      return imageMesh;
    }

    render() {
      if (this.resized) {
        this.resize();
      }

      this.analyzer.getByteTimeDomainData(this.buffer);
      this.context.fillStyle = this.options.backgroundColor;
      this.context.fillRect(0, 0, this.bounds.width, this.bounds.height);
      this.context.lineWidth = 2;
      this.context.strokeStyle = this.options.foregroundColor;
      this.context.beginPath();
      for (var i = 0; i < this.buffer.length; ++i) {
        var x = i * this.bounds.width / this.buffer.length,
          y = this.buffer[i] * this.bounds.height / 256,
          func = i > 0 ? "lineTo" : "moveTo";
        this.context[func](x, y);
      }
      this.context.stroke();
      this.invalidate();
    }
  }


  return VUMeter;
})();