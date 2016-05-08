"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Speech = function () {

  ////
  //   Class: SpeechInput
  //
  //   Connects to a the webkitSpeechRecognition API and manages callbacks based on
  //   keyword sets related to the callbacks. Note that the webkitSpeechRecognition
  //   API requires a network connection, as the processing is done on an external
  //   server.
  //
  //   Constructor: new SpeechInput(name, commands, socket);
  //
  //   The `name` parameter is used when transmitting the commands through the command
  //   proxy server.
  //
  //   The `commands` parameter specifies a collection of keywords tied to callbacks
  //   that will be called when one of the keywords are heard. Each callback can
  //   be associated with multiple keywords, to be able to increase the accuracy
  //   of matches by combining words and phrases that sound similar.
  //
  //   Each command entry is a simple object following the pattern:
  //
  //   {
  //   "keywords": ["phrase no. 1", "phrase no. 2", ...],
  //   "command": <callbackFunction>
  //   }
  //
  //   The `keywords` property is an array of strings for which SpeechInput will
  //   listen. If any of the words or phrases in the array matches matches the heard
  //   command, the associated callbackFunction will be executed.
  //
  //  The `command` property is the callback function that will be executed. It takes no
  //  parameters.
  //
  //  The `socket` (optional) parameter is a WebSocket connecting back to the command
  //  proxy server.
  //
  //  Methods:
  //  `start()`: starts the command unrecognition, unless it's not available, in which
  //  case it prints a message to the console error log. Returns true if the running
  //  state changed. Returns false otherwise.
  //
  //  `stop()`: uhm... it's like start, but it's called stop.
  //
  //  `isAvailable()`: returns true if the setup process was successful.
  //
  //  `getErrorMessage()`: returns the Error object that occured when setup failed, or
  //  null if setup was successful.
  ///

  pliny.class({
    parent: "Primrose.Input",
    name: "Speech",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });

  var Speech = function (_Primrose$InputProces) {
    _inherits(Speech, _Primrose$InputProces);

    function Speech(commands, socket) {
      _classCallCheck(this, Speech);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Speech).call(this, "Speech", commands, socket));

      var running = false,
          recognition = null,
          errorMessage = null;

      function warn() {
        var msg = fmt("Failed to initialize speech engine. Reason: $1", errorMessage.message);
        console.error(msg);
        return false;
      }

      function start() {
        if (!available) {
          return warn();
        } else if (!running) {
          running = true;
          recognition.start();
          return true;
        }
        return false;
      }

      function stop() {
        if (!available) {
          return warn();
        }
        if (running) {
          recognition.stop();
          return true;
        }
        return false;
      }

      _this.check = function () {
        if (this.enabled && !running) {
          start();
        } else if (!this.enabled && running) {
          stop();
        }
      };

      _this.getErrorMessage = function () {
        return errorMessage;
      };

      try {
        if (window.SpeechRecognition) {
          // just in case this ever gets standardized
          recognition = new SpeechRecognition();
        } else {
          // purposefully don't check the existance so it errors out and setup fails.
          recognition = new webkitSpeechRecognition();
        }
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        var restart = false;
        recognition.addEventListener("start", function () {
          console.log("speech started");
          command = "";
        }.bind(_this), true);

        recognition.addEventListener("error", function (event) {
          restart = true;
          console.log("speech error", event);
          running = false;
          command = "speech error";
        }.bind(_this), true);

        recognition.addEventListener("end", function () {
          console.log("speech ended", arguments);
          running = false;
          command = "speech ended";
          if (restart) {
            restart = false;
            this.enable(true);
          }
        }.bind(_this), true);

        recognition.addEventListener("result", function (event) {
          var newCommand = [];
          var result = event.results[event.resultIndex];
          var max = 0;
          var maxI = -1;
          if (result && result.isFinal) {
            for (var i = 0; i < result.length; ++i) {
              var alt = result[i];
              if (alt.confidence > max) {
                max = alt.confidence;
                maxI = i;
              }
            }
          }

          if (max > 0.85) {
            newCommand.push(result[maxI].transcript.trim());
          }

          newCommand = newCommand.join(" ");

          if (newCommand !== this.inputState) {
            this.inputState.text = newCommand;
          }
          this.update();
        }.bind(_this), true);

        available = true;
      } catch (exp) {
        console.error(exp);
        errorMessage = exp;
        available = false;
      }
      return _this;
    }

    _createClass(Speech, [{
      key: "cloneCommand",
      value: function cloneCommand(cmd) {
        return {
          name: cmd.name,
          preamble: cmd.preamble,
          keywords: Speech.maybeClone(cmd.keywords),
          commandUp: cmd.commandUp,
          disabled: cmd.disabled
        };
      }
    }, {
      key: "evalCommand",
      value: function evalCommand(cmd, cmdState, metaKeysSet, dt) {
        if (metaKeysSet && this.inputState.text) {
          for (var i = 0; i < cmd.keywords.length; ++i) {
            if (this.inputState.text.indexOf(cmd.keywords[i]) === 0 && (cmd.preamble || cmd.keywords[i].length === this.inputState.text.length)) {
              cmdState.pressed = true;
              cmdState.value = this.inputState.text.substring(cmd.keywords[i].length).trim();
              this.inputState.text = null;
            }
          }
        }
      }
    }, {
      key: "enable",
      value: function enable(k, v) {
        _get(Object.getPrototypeOf(Speech.prototype), "enable", this).call(this, k, v);
        this.check();
      }
    }, {
      key: "transmit",
      value: function transmit(v) {
        _get(Object.getPrototypeOf(Speech.prototype), "transmit", this).call(this, v);
        this.check();
      }
    }], [{
      key: "maybeClone",
      value: function maybeClone(arr) {
        return arr && arr.slice() || [];
      }
    }]);

    return Speech;
  }(Primrose.InputProcessor);

  return Speech;
}();