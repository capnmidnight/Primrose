/*
pliny.class({
  parent: "Primrose.Input",
    name: "Keyboard",
    baseClass: "Primrose.Input.InputProcessor",
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
*/

import {
  isFirefox,
  isChrome,
  isIE,
  isOpera,
  isSafari,
  isMacOS
} from "../../flags";

import InputProcessor from "./InputProcessor";

import Windows from "../Text/OperatingSystems/Windows";
import macOS from "../Text/OperatingSystems/macOS";
import CodePages from "../Text/CodePages";

export default class Keyboard extends InputProcessor {
  constructor(input, commands) {
    super("Keyboard", commands);

    this._operatingSystem = null;
    this.browser = isChrome ? "CHROMIUM" : (isFirefox ? "FIREFOX" : (isIE ? "IE" : (isOpera ? "OPERA" : (isSafari ? "SAFARI" : "UNKNOWN"))));
    this._codePage = null;
    this.resetDeadKeyState = () => this.codePage.resetDeadKeyState();
  }

  consumeEvent(evt) {
    this.inPhysicalUse = true;
    const isKeyDown = evt.type === "keydown";
    this.setButton(evt.keyCode, isKeyDown);
    if(isKeyDown) {
      evt.cmdName = this.operatingSystem.makeCommandName(evt, this.codePage);
      evt.altCmdName = this.browser + "_" + evt.cmdName;
      evt.cmdText = this.codePage[evt.cmdName];
      evt.altCmdText = this.codePage[evt.altCmdName];
      evt.resetDeadKeyState = this.resetDeadKeyState;
    }
  }

  get operatingSystem() {
    return this._operatingSystem;
  }

  set operatingSystem(os) {
    this._operatingSystem = os || (isMacOS ? macOS : Windows);
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

      for (key in CodePages) {
        cp = CodePages[key];
        if (cp.language === lang) {
          this._codePage = cp;
          break;
        }
      }

      if (!this._codePage) {
        this._codePage = CodePages.EN_US;
      }
    }
  }
}
