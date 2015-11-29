/* global Primrose */

Primrose.ChatApplication = ( function () {

  function ChatApplication ( name, options ) {
    this.formStateKey = name + " - formState";
    this.formState = getSetting( this.formStateKey );
    this.ctrls = findEverything();
    this.fullscreenElement = document.documentElement;
    this.options = combineDefaults( options, ChatApplication );
    this.users = { };
    this.chatLines = [ ];
    this.userName = ChatApplication.DEFAULT_USER_NAME;
    this.focused = true;
    this.wasFocused = false;
  }

  ChatApplication.DEFAULT_USER_NAME = "CURRENT_USER_OFFLINE";
  ChatApplication.DEFAULTS = {
  };

  return ChatApplication;
} )();
