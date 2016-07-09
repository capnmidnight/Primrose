Primrose.Input.Keyboard = (function () {
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
  class Keyboard extends Primrose.InputProcessor {
    constructor(parent, commands, socket) {
      super("Keyboard", parent, commands, socket);
      this.listeners.clipboard = [];

      this._operatingSystem = null;
      this.browser = isChrome ? "CHROMIUM" : (isFirefox ? "FIREFOX" : (isIE ? "IE" : (isOpera ? "OPERA" : (isSafari ? "SAFARI" : "UNKNOWN"))));
      this._codePage = null;

      function execute(stateChange, evt) {
        if (!this.lockedToEditor) {
          this.setButton(evt.keyCode, stateChange);
        }
        else if (evt.type === "keyup") {
          if (this.currentControl && this.currentControl.keyUp) {
            this.currentControl.keyUp(evt);
          }
        }
        else if (evt.type === "keydown") {
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
            }
            else {
              elem.keyDown(evt);
            }
          }
        }
      }

      function focusClipboard(evt) {
        if (this.lockedToEditor) {
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
      surrogate.addEventListener("copy", clipboardOperation.bind(this), false);
      surrogate.addEventListener("beforecut", setFalse, false);
      surrogate.addEventListener("cut", clipboardOperation.bind(this), false);
      document.body.insertBefore(surrogateContainer, document.body.children[0]);

      window.addEventListener("beforepaste", setFalse, false);
      window.addEventListener("keydown", focusClipboard.bind(this), true);
      window.addEventListener("keydown", execute.bind(this, true), false);
      window.addEventListener("keyup", execute.bind(this, false), false);
    }

    withCurrentControl(name) {
      return (evt) => {
        if (this.currentControl) {
          if (this.currentControl[name]) {
            this.currentControl[name](evt);
          }
          else {
            console.warn("Couldn't find %s on %o", name, this.currentControl);
          }
        }
      };
    }

    get operatingSystem() {
      return this._operatingSystem;
    }

    set operatingSystem(os) {
      this._operatingSystem = os || (isOSX ? Primrose.Text.OperatingSystems.OSX : Primrose.Text.OperatingSystems.Windows);
    }

    get codePage() {
      return this._codePage;
    }

    set codePage(cp) {
      var key,
        code,
        char,
        name;
      this._codePage = cp;
      if (!this._codePage) {
        var lang = (navigator.languages && navigator.languages[0]) ||
          navigator.language ||
          navigator.userLanguage ||
          navigator.browserLanguage;

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
  }

  return Keyboard;
})();