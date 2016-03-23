"use strict";

/* global Primrose, requestAnimationFrame, Leap, LeapMotionInput, pliny */

Primrose.Input.LeapMotion = function () {
  function processFingerParts(i) {
    return LeapMotionInput.FINGER_PARTS.map(function (p) {
      return "FINGER" + i + p.toUpperCase();
    });
  }

  pliny.issue("Primrose.Input.LeapMotion", {
    name: "document LeapMotion",
    type: "open",
    description: "Finish writing the documentation for the [Primrose.Input.LeapMotion](#Primrose_Input_LeapMotion) class in the input/ directory"
  });

  pliny.class("Primrose.Input", {
    name: "LeapMotionInput",
    description: "| [under construction]"
  });
  function LeapMotionInput(name, commands, socket) {

    pliny.issue("Primrose.Input.LeapMotion", {
      name: "document LeapMotion.isStreaming",
      type: "open",
      description: ""
    });
    this.isStreaming = false;

    Primrose.Input.ButtonAndAxis.call(this, name, commands, socket, LeapMotionInput.AXES);

    pliny.issue("Primrose.Input.LeapMotion", {
      name: "document LeapMotion.controller",
      type: "open",
      description: ""
    });
    this.controller = new Leap.Controller({ enableGestures: true });
  }

  pliny.issue("Primrose.Input.LeapMotion", {
    name: "document LeapMotion.COMPONENTS",
    type: "open",
    description: ""
  });
  LeapMotionInput.COMPONENTS = ["X", "Y", "Z"];

  pliny.issue("Primrose.Input.LeapMotion", {
    name: "document LeapMotion.NUM_HANDS",
    type: "open",
    description: ""
  });
  LeapMotionInput.NUM_HANDS = 2;

  pliny.issue("Primrose.Input.LeapMotion", {
    name: "document LeapMotion.NUM_FINGERS",
    type: "open",
    description: ""
  });
  LeapMotionInput.NUM_FINGERS = 10;

  pliny.issue("Primrose.Input.LeapMotion", {
    name: "document LeapMotion.FINGER_PARTS",
    type: "open",
    description: ""
  });
  LeapMotionInput.FINGER_PARTS = ["tip", "dip", "pip", "mcp", "carp"];

  pliny.issue("Primrose.Input.LeapMotion", {
    name: "document LeapMotion.AXES",
    type: "open",
    description: ""
  });
  LeapMotionInput.AXES = ["X0", "Y0", "Z0", "X1", "Y1", "Z1", "FINGER0TIPX", "FINGER0TIPY", "FINGER0DIPX", "FINGER0DIPY", "FINGER0PIPX", "FINGER0PIPY", "FINGER0MCPX", "FINGER0MCPY", "FINGER0CARPX", "FINGER0CARPY", "FINGER1TIPX", "FINGER1TIPY", "FINGER1DIPX", "FINGER1DIPY", "FINGER1PIPX", "FINGER1PIPY", "FINGER1MCPX", "FINGER1MCPY", "FINGER1CARPX", "FINGER1CARPY", "FINGER2TIPX", "FINGER2TIPY", "FINGER2DIPX", "FINGER2DIPY", "FINGER2PIPX", "FINGER2PIPY", "FINGER2MCPX", "FINGER2MCPY", "FINGER2CARPX", "FINGER2CARPY", "FINGER3TIPX", "FINGER3TIPY", "FINGER3DIPX", "FINGER3DIPY", "FINGER3PIPX", "FINGER3PIPY", "FINGER3MCPX", "FINGER3MCPY", "FINGER3CARPX", "FINGER3CARPY", "FINGER4TIPX", "FINGER4TIPY", "FINGER4DIPX", "FINGER4DIPY", "FINGER4PIPX", "FINGER4PIPY", "FINGER4MCPX", "FINGER4MCPY", "FINGER4CARPX", "FINGER4CARPY", "FINGER5TIPX", "FINGER5TIPY", "FINGER5DIPX", "FINGER5DIPY", "FINGER5PIPX", "FINGER5PIPY", "FINGER5MCPX", "FINGER5MCPY", "FINGER5CARPX", "FINGER5CARPY", "FINGER6TIPX", "FINGER6TIPY", "FINGER6DIPX", "FINGER6DIPY", "FINGER6PIPX", "FINGER6PIPY", "FINGER6MCPX", "FINGER6MCPY", "FINGER6CARPX", "FINGER6CARPY", "FINGER7TIPX", "FINGER7TIPY", "FINGER7DIPX", "FINGER7DIPY", "FINGER7PIPX", "FINGER7PIPY", "FINGER7MCPX", "FINGER7MCPY", "FINGER7CARPX", "FINGER7CARPY", "FINGER8TIPX", "FINGER8TIPY", "FINGER8DIPX", "FINGER8DIPY", "FINGER8PIPX", "FINGER8PIPY", "FINGER8MCPX", "FINGER8MCPY", "FINGER8CARPX", "FINGER8CARPY", "FINGER9TIPX", "FINGER9TIPY", "FINGER9DIPX", "FINGER9DIPY", "FINGER9PIPX", "FINGER9PIPY", "FINGER9MCPX", "FINGER9MCPY", "FINGER9CARPX", "FINGER9CARPY"];

  Primrose.Input.ButtonAndAxis.inherit(LeapMotionInput);

  pliny.issue("Primrose.Input.LeapMotion", {
    name: "document LeapMotion.CONNECTION_TIMEOUT",
    type: "open",
    description: ""
  });
  LeapMotionInput.CONNECTION_TIMEOUT = 5000;

  pliny.issue("Primrose.Input.LeapMotion", {
    name: "document LeapMotion.E",
    type: "open",
    description: ""
  });
  LeapMotionInput.prototype.E = function (e, f) {
    if (f) {
      this.controller.on(e, f);
    } else {
      this.controller.on(e, console.log.bind(console, "Leap Motion Event: " + e));
    }
  };

  pliny.issue("Primrose.Input.LeapMotion", {
    name: "document LeapMotion.start",
    type: "open",
    description: ""
  });
  LeapMotionInput.prototype.start = function (gameUpdateLoop) {
    if (this.isEnabled()) {
      var canceller = null,
          startAlternate = null;
      if (gameUpdateLoop) {
        var alternateLooper = function alternateLooper(t) {
          requestAnimationFrame(alternateLooper);
          gameUpdateLoop(t);
        };
        startAlternate = requestAnimationFrame.bind(window, alternateLooper);
        var timeout = setTimeout(startAlternate, LeapMotionInput.CONNECTION_TIMEOUT);
        canceller = function () {
          clearTimeout(timeout);
          this.isStreaming = true;
        }.bind(this);
        this.E("deviceStreaming", canceller);
        this.E("streamingStarted", canceller);
        this.E("streamingStopped", startAlternate);
      }
      this.E("connect");
      //this.E("protocol");
      this.E("deviceStopped");
      this.E("disconnect");
      this.E("frame", this.setState.bind(this, gameUpdateLoop));
      this.controller.connect();
    }
  };

  pliny.issue("Primrose.Input.LeapMotion", {
    name: "document LeapMotion.setState",
    type: "open",
    description: ""
  });
  LeapMotionInput.prototype.setState = function (gameUpdateLoop, frame) {
    var prevFrame = this.controller.history.get(1),
        i,
        j;
    if (!prevFrame || frame.hands.length !== prevFrame.hands.length) {
      for (i = 0; i < this.commands.length; ++i) {
        this.enable(this.commands[i].name, frame.hands.length > 0);
      }
    }

    for (i = 0; i < frame.hands.length; ++i) {
      var hand = frame.hands[i].palmPosition;
      var handName = "HAND" + i;
      for (j = 0; j < LeapMotionInput.COMPONENTS.length; ++j) {
        this.setAxis(handName + LeapMotionInput.COMPONENTS[j], hand[j]);
      }
    }

    for (i = 0; i < frame.fingers.length; ++i) {
      var finger = frame.fingers[i];
      var fingerName = "FINGER" + i;
      for (j = 0; j < LeapMotionInput.FINGER_PARTS.length; ++j) {
        var joint = finger[LeapMotionInput.FINGER_PARTS[j] + "Position"];
        var jointName = fingerName + LeapMotionInput.FINGER_PARTS[j].toUpperCase();
        for (var k = 0; k < LeapMotionInput.COMPONENTS.length; ++k) {
          this.setAxis(jointName + LeapMotionInput.COMPONENTS[k], joint[k]);
        }
      }
    }

    if (gameUpdateLoop) {
      gameUpdateLoop(frame.timestamp * 0.001);
    }
  };
  return LeapMotionInput;
}();
