"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Controls.VUMeter = function () {
  "use strict";

  var COUNTER = 0;

  pliny.class({
    parent: "Primrose.Controls",
    name: "VUMeter",
    baseClass: "Primrose.Surface",
    description: "A visualization of audio data.",
    parameters: [{ name: "analyzer", type: "MediaStream", description: "The audio stream to analyze." }, { name: "options", type: "Object", description: "Named parameters for creating the Button." }]
  });

  var VUMeter = function (_Primrose$Surface) {
    _inherits(VUMeter, _Primrose$Surface);

    function VUMeter(analyzer, options) {
      _classCallCheck(this, VUMeter);

      ////////////////////////////////////////////////////////////////////////
      // normalize input parameters
      ////////////////////////////////////////////////////////////////////////

      options = options || {};
      if (typeof options === "string") {
        options = { value: options };
      }

      ////////////////////////////////////////////////////////////////////////
      // initialization
      ///////////////////////////////////////////////////////////////////////

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VUMeter).call(this, patch(options, {
        id: "Primrose.Controls.VUMeter[" + COUNTER++ + "]",
        bounds: new Primrose.Text.Rectangle(0, 0, 512, 256),
        backgroundColor: 0x000000,
        foregroundColor: 0xffffff
      })));

      _this.analyzer = analyzer;
      _this.analyzer.fftSize = _this.bounds.width;
      _this.buffer = new Uint8Array(_this.analyzer.frequencyBinCount);
      return _this;
    }

    _createClass(VUMeter, [{
      key: "addToBrowserEnvironment",
      value: function addToBrowserEnvironment(env, scene) {
        var imageMesh = textured(quad(0.5, 0.5 * this.imageHeight / this.imageWidth), this);
        scene.add(imageMesh);
        env.registerPickableObject(imageMesh);
        return imageMesh;
      }
    }, {
      key: "render",
      value: function render() {
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
    }]);

    return VUMeter;
  }(Primrose.Surface);

  return VUMeter;
}();