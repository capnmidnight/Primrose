/*
pliny.class({
  parent: "Primrose.Input",
  name: "Speech",
  baseClass: "Primrose.Input.InputProcessor",
  description: "Connects to a the webkitSpeechRecognition API and manages callbacks based on keyword sets related to the callbacks. Note that the webkitSpeechRecognition API requires a network connection, as the processing is done on an external server.",
  parameters: [{
    name: "commands",
    type: "Array",
    description: "The `commands` parameter specifies a collection of keywords tied to callbacks that will be called when one of the keywords are heard. Each callback can be associated with multiple keywords, to be able to increase the accuracy of matches by combining words and phrases that sound similar.\n\
\n\
Each command entry is a simple object following the pattern:\n\
\n\
    {\n\
      \"keywords\": [\"phrase no. 1\", \"phrase no. 2\", ...],\n\
      \"command\": <callbackFunction>\n\
    }\n\
\n\
The `keywords` property is an array of strings for which SpeechInput will listen. If any of the words or phrases in the array matches matches the heard command, the associated callbackFunction will be executed.\n\
\n\
The `command` property is the callback function that will be executed. It takes no parameters."
    }]
});
*/

import InputProcessor from "./InputProcessor";
export default class Speech extends InputProcessor {
  constructor(commands) {
    super("Speech", commands);
    var running = false,
      recognition = null,
      errorMessage = null;

    function warn() {
      var msg = "Failed to initialize speech engine. Reason: " + errorMessage.message;
      console.error(msg);
      return false;
    }

    function start() {
      if (!available) {
        return warn();
      }
      else if (!running) {
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

    this.check = function () {
      if (this.enabled && !running) {
        start();
      }
      else if (!this.enabled && running) {
        stop();
      }
    };

    this.getErrorMessage = function () {
      return errorMessage;
    };

    try {
      if (window.SpeechRecognition) {
        // just in case this ever gets standardized
        recognition = new SpeechRecognition();
      }
      else {
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
      }.bind(this), true);

      recognition.addEventListener("error", function (evt) {
        restart = true;
        console.log("speech error", evt);
        running = false;
        command = "speech error";
      }.bind(this), true);

      recognition.addEventListener("end", function (evt) {
        console.log("speech ended", evt);
        running = false;
        command = "speech ended";
        if (restart) {
          restart = false;
          this.enable(true);
        }
      }.bind(this), true);

      recognition.addEventListener("result", function (evt) {
        var newCommand = [];
        var result = evt.results[evt.resultIndex];
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
      }.bind(this), true);

      available = true;
    }
    catch (exp) {
      console.error(exp);
      errorMessage = exp;
      available = false;
    }
  }

  static maybeClone(arr) {
    return (arr && arr.slice()) || [];
  }

  cloneCommand(cmd) {
    return {
      name: cmd.name,
      preamble: cmd.preamble,
      keywords: Speech.maybeClone(cmd.keywords),
      commandUp: cmd.commandUp,
      disabled: cmd.disabled
    };
  }

  evalCommand(cmd, cmdState, metaKeysSet, dt) {
    if (metaKeysSet && this.inputState.text) {
      for (var i = 0; i < cmd.keywords.length; ++i) {
        if (this.inputState.text.indexOf(cmd.keywords[i]) === 0 && (cmd.preamble || cmd.keywords[i].length === this.inputState.text.length)) {
          cmdState.pressed = true;
          cmdState.value = this.inputState.text.substring(cmd.keywords[i].length)
            .trim();
          this.inputState.text = null;
        }
      }
    }
  }

  enable(k, v) {
    super.enable(k, v);
    this.check();
  }
};
