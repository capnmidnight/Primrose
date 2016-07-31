"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Keyboard = function () {
  "use strict";

  pliny.class({
    parent: "Primrose.Input",
    name: "Keyboard",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]",
    parameters: [{
      name: "",
      type: "",
      description: ""
    }, {
      name: "",
      type: "",
      description: ""
    }, {
      name: "",
      type: "",
      description: ""
    }, {
      name: "",
      type: "",
      description: ""
    }]
  });

  var Keyboard = function (_Primrose$InputProces) {
    _inherits(Keyboard, _Primrose$InputProces);

    function Keyboard(parent, commands, socket) {
      _classCallCheck(this, Keyboard);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Keyboard).call(this, "Keyboard", parent, commands, socket));

      _this.listeners.clipboard = [];

      _this._operatingSystem = null;
      _this.browser = isChrome ? "CHROMIUM" : isFirefox ? "FIREFOX" : isIE ? "IE" : isOpera ? "OPERA" : isSafari ? "SAFARI" : "UNKNOWN";
      _this._codePage = null;

      function execute(stateChange, evt) {
        if (!this.lockMovement) {
          this.setButton(evt.keyCode, stateChange);
        } else if (evt.type === "keyup") {
          if (this.currentControl && this.currentControl.keyUp) {
            this.currentControl.keyUp(evt);
          }
        } else if (evt.type === "keydown") {
          var elem = this.currentControl.focusedElement;
          if (elem) {
            if (elem.execCommand && this.operatingSystem && this.browser && this.codePage) {
              var oldDeadKeyState = this.operatingSystem._deadKeyState,
                  cmdName = this.operatingSystem.makeCommandName(evt, this.codePage);

              if (elem.execCommand(this.browser, this.codePage, cmdName)) {
                evt.preventDefault();
              }
              if (this.operatingSystem._deadKeyState === oldDeadKeyState) {
                this.operatingSystem._deadKeyState = "";
              }
            } else {
              elem.keyDown(evt);
            }
          }
        }
      }

      function focusClipboard(evt) {
        if (this.lockMovement) {
          var cmdName = this.operatingSystem.makeCommandName(evt, this.codePage);
          if (cmdName === "CUT" || cmdName === "COPY") {
            surrogate.style.display = "block";
            surrogate.focus();
          }
        }
      }

      function clipboardOperation(evt) {
        if (this.currentControl) {
          this.currentControl[evt.type + "SelectedText"](evt);
          if (!evt.returnValue) {
            evt.preventDefault();
          }
          surrogate.style.display = "none";
          this.currentControl.focus();
        }
      };

      // the `surrogate` textarea makes clipboard events possible
      var surrogate = Primrose.DOM.cascadeElement("primrose-surrogate-textarea", "textarea", HTMLTextAreaElement),
          surrogateContainer = Primrose.DOM.makeHidingContainer("primrose-surrogate-textarea-container", surrogate);

      surrogateContainer.style.position = "absolute";
      surrogateContainer.style.overflow = "hidden";
      surrogateContainer.style.width = 0;
      surrogateContainer.style.height = 0;
      surrogate.addEventListener("beforecopy", setFalse, false);
      surrogate.addEventListener("copy", clipboardOperation.bind(_this), false);
      surrogate.addEventListener("beforecut", setFalse, false);
      surrogate.addEventListener("cut", clipboardOperation.bind(_this), false);
      document.body.insertBefore(surrogateContainer, document.body.children[0]);

      window.addEventListener("beforepaste", setFalse, false);
      window.addEventListener("keydown", focusClipboard.bind(_this), true);
      window.addEventListener("keydown", execute.bind(_this, true), false);
      window.addEventListener("keyup", execute.bind(_this, false), false);
      return _this;
    }

    _createClass(Keyboard, [{
      key: "withCurrentControl",
      value: function withCurrentControl(name) {
        var _this2 = this;

        return function (evt) {
          if (_this2.currentControl) {
            if (_this2.currentControl[name]) {
              _this2.currentControl[name](evt);
            } else {
              console.warn("Couldn't find %s on %o", name, _this2.currentControl);
            }
          }
        };
      }
    }, {
      key: "operatingSystem",
      get: function get() {
        return this._operatingSystem;
      },
      set: function set(os) {
        this._operatingSystem = os || (isOSX ? Primrose.Text.OperatingSystems.OSX : Primrose.Text.OperatingSystems.Windows);
      }
    }, {
      key: "codePage",
      get: function get() {
        return this._codePage;
      },
      set: function set(cp) {
        var key, code, char, name;
        this._codePage = cp;
        if (!this._codePage) {
          var lang = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage || navigator.browserLanguage;

          if (!lang || lang === "en") {
            lang = "en-US";
          }

          for (key in Primrose.Text.CodePages) {
            cp = Primrose.Text.CodePages[key];
            if (cp.language === lang) {
              this._codePage = cp;
              break;
            }
          }

          if (!this._codePage) {
            this._codePage = Primrose.Text.CodePages.EN_US;
          }
        }
      }
    }]);

    return Keyboard;
  }(Primrose.InputProcessor);

  return Keyboard;
}();