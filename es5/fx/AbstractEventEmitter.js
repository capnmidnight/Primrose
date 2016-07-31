"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.AbstractEventEmitter = function () {
  "use strict";

  var AbstractEventEmitter = function () {
    function AbstractEventEmitter() {
      _classCallCheck(this, AbstractEventEmitter);

      this._handlers = {};
    }

    _createClass(AbstractEventEmitter, [{
      key: "addEventListener",
      value: function addEventListener(name, thunk) {
        if (!this._handlers[name]) {
          this._handlers[name] = [];
        }
        this._handlers[name].push(thunk);
      }
    }, {
      key: "removeEventListener",
      value: function removeEventListener(name, thunk) {
        if (this._handlers[name]) {
          var idx = this._handlers[name].indexOf(thunk);
          if (idx > -1) {
            this._handlers[name].splice(idx, 1);
          }
        }
      }
    }, {
      key: "emit",
      value: function emit(name, obj) {
        if (this._handlers[name]) {
          for (var i = 0; i < this._handlers[name].length; ++i) {
            this._handlers[name][i](obj);
          }
        }
      }
    }]);

    return AbstractEventEmitter;
  }();

  return AbstractEventEmitter;
}();