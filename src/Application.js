/* global Primrose */

Primrose.Application = ( function () {

  function Application ( name, options ) {
    this.formStateKey = name + " - formState";
    this.formState = getSetting( this.formStateKey );
    this.ctrls = findEverything();
    this.fullscreenElement = document.documentElement;
    this.options = combineDefaults( options, Application );
    this.users = { };
    this.chatLines = [ ];
    this.userName = Application.DEFAULT_USER_NAME;
    this.focused = true;
    this.wasFocused = false;
  }

  Application.DEFAULT_USER_NAME = "CURRENT_USER_OFFLINE";
  Application.DEFAULTS = {
  };

  return Application;
} )();
