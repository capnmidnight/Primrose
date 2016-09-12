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
  constructor(input, commands) {
    super("Keyboard", commands);
    this.listeners = {
      clipboard: [],
      keydown: [],
      keyup: []
    };

    this._operatingSystem = null;
    this.browser = isChrome ? "CHROMIUM" : (isFirefox ? "FIREFOX" : (isIE ? "IE" : (isOpera ? "OPERA" : (isSafari ? "SAFARI" : "UNKNOWN"))));
    this._codePage = null;
  }

  dispatchEvent(evt) {
    this.setButton(evt.keyCode, evt.type === "keydown");
  }

  addEventListener(name, thunk){
    if(this.listeners[name]){
      this.listeners[name].push(thunk);
    }
  }

  doTyping(elem, evt) {
    if (elem && elem.execCommand && this.operatingSystem && this.browser && this.codePage) {
      var oldDeadKeyState = this.operatingSystem._deadKeyState,
        cmdName = this.operatingSystem.makeCommandName(evt, this.codePage);

      if (elem.execCommand(this.browser, this.codePage, cmdName)) {
        evt.preventDefault();
      }
      if (this.operatingSystem._deadKeyState === oldDeadKeyState) {
        this.operatingSystem._deadKeyState = "";
      }
    }
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