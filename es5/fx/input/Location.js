"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Location = function () {

  pliny.class({
    parent: "Primrose.Input",
    name: "Location",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });

  var Location = function (_Primrose$InputProces) {
    _inherits(Location, _Primrose$InputProces);

    function Location(commands, socket, options) {
      _classCallCheck(this, Location);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Location).call(this, "Location", commands, socket));

      _this.options = patch(options, Location.DEFAULTS);

      _this.available = !!navigator.geolocation;
      if (_this.available) {
        navigator.geolocation.watchPosition(_this.setState.bind(_this), function () {
          this.available = false;
        }.bind(_this), _this.options);
      }
      return _this;
    }

    _createClass(Location, [{
      key: "setState",
      value: function setState(location) {
        for (var p in location.coords) {
          var k = p.toUpperCase();
          if (Location.AXES.indexOf(k) > -1) {
            this.setAxis(k, location.coords[p]);
          }
        }
        this.update();
      }
    }]);

    return Location;
  }(Primrose.InputProcessor);

  Primrose.InputProcessor.defineAxisProperties(Location, ["LONGITUDE", "LATITUDE", "ALTITUDE", "HEADING", "SPEED"]);

  Location.DEFAULTS = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 25000
  };

  return Location;
}();