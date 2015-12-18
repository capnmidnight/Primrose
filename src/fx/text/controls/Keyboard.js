/* global Primrose */
Primrose.Text.Controls.Keyboard = ( function () {
  "use strict";

  function Keyboard ( id, options ) {
    var self = this;
    //////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    //////////////////////////////////////////////////////////////////////////

    options = options || { };
    if ( typeof options === "string" ) {
      options = { file: options };
    }

    Primrose.Text.Control.call( this );

    //////////////////////////////////////////////////////////////////////////
    // private fields
    //////////////////////////////////////////////////////////////////////////
    var codePage,
        operatingSystem,
        browser,
        keyboardSystem,
        commandPack,
        currentTouchID,
        events = { keydown: [ ] },
        deadKeyState = "",
        keyNames = [ ],
        dragging = false,
        DOMElement = null;

    //////////////////////////////////////////////////////////////////////////
    // private methods
    //////////////////////////////////////////////////////////////////////////

    function pointerStart ( x, y ) {
      if ( options.pointerEventSource ) {
        self.focus();
        var bounds =
            options.pointerEventSource.getBoundingClientRect();
        self.startPointer( x - bounds.left, y - bounds.top );
      }
    }

    function pointerMove ( x, y ) {
      if ( options.pointerEventSource ) {
        var bounds =
            options.pointerEventSource.getBoundingClientRect();
        self.movePointer( x - bounds.left, y - bounds.top );
      }
    }

    function mouseButtonDown ( evt ) {
      if ( evt.button === 0 ) {
        pointerStart( evt.clientX, evt.clientY );
        evt.preventDefault();
      }
    }

    function mouseMove ( evt ) {
      if ( self.focused ) {
        pointerMove( evt.clientX, evt.clientY );
      }
    }

    function mouseButtonUp ( evt ) {
      if ( self.focused && evt.button === 0 ) {
        self.endPointer();
      }
    }

    function touchStart ( evt ) {
      if ( self.focused && evt.touches.length > 0 && !dragging ) {
        var t = evt.touches[0];
        pointerStart( t.clientX, t.clientY );
        currentTouchID = t.identifier;
      }
    }

    function touchMove ( evt ) {
      for ( var i = 0; i < evt.changedTouches.length && dragging; ++i ) {
        var t = evt.changedTouches[i];
        if ( t.identifier === currentTouchID ) {
          pointerMove( t.clientX, t.clientY );
          break;
        }
      }
    }

    function touchEnd ( evt ) {
      for ( var i = 0; i < evt.changedTouches.length && dragging; ++i ) {
        var t = evt.changedTouches[i];
        if ( t.identifier === currentTouchID ) {
          self.endPointer();
        }
      }
    }

    function refreshCommandPack () {
      if ( keyboardSystem && operatingSystem ) {
        commandPack = { };
        var commands = {
          NORMAL_SPACE: " ",
          SHIFT_SPACE: " ",
          NORMAL_TAB: "\t"
        };

        var allCommands = { };

        copyObject( allCommands, codePage );
        copyObject( allCommands, operatingSystem );
        copyObject( allCommands, commands );
      }
    }

    //////////////////////////////////////////////////////////////////////////
    // public methods
    //////////////////////////////////////////////////////////////////////////

    this.addEventListener = function ( event, thunk ) {
      if ( events.hasOwnProperty( event ) ) {
        events[event].push( thunk );
      }
    };

    this.getDOMElement = function () {
      return DOMElement;
    };

    this.setDeadKeyState = function ( st ) {
      this.changed = true;
      deadKeyState = st || "";
    };

    this.setOperatingSystem = function ( os ) {
      this.changed = true;
      operatingSystem = os || ( isOSX ? Primrose.Text.OperatingSystems.OSX :
          Primrose.Text.OperatingSystems.Windows );
      refreshCommandPack();
    };

    this.getOperatingSystem = function () {
      return operatingSystem;
    };

    this.setSize = function ( w, h ) {

    };

    this.getWidth = function () {
      return null;
    };

    this.getHeight = function () {
      return null;
    };

    this.setCodePage = function ( cp ) {
      this.changed = true;
      var key,
          code,
          char,
          name;
      codePage = cp;
      if ( !codePage ) {
        var lang = ( navigator.languages && navigator.languages[0] ) ||
            navigator.language ||
            navigator.userLanguage ||
            navigator.browserLanguage;

        if ( !lang || lang === "en" ) {
          lang = "en-US";
        }

        for ( key in Primrose.Text.CodePages ) {
          cp = Primrose.Text.CodePages[key];
          if ( cp.language === lang ) {
            codePage = cp;
            break;
          }
        }

        if ( !codePage ) {
          codePage = Primrose.Text.CodePages.EN_US;
        }
      }

      keyNames = [ ];
      for ( key in Primrose.Keys ) {
        code = Primrose.Keys[key];
        if ( !isNaN( code ) ) {
          keyNames[code] = key;
        }
      }

      keyboardSystem = { };
      for ( var type in codePage ) {
        var codes = codePage[type];
        if ( typeof ( codes ) === "object" ) {
          for ( code in codes ) {
            if ( code.indexOf( "_" ) > -1 ) {
              var parts = code.split( ' ' ),
                  browser = parts[0];
              code = parts[1];
              char = codePage.NORMAL[code];
              name = browser + "_" + type + " " + char;
            }
            else {
              char = codePage.NORMAL[code];
              name = type + "_" + char;
            }
            keyNames[code] = char;
            keyboardSystem[name] = codes[code];
          }
        }
      }

      refreshCommandPack();
    };

    this.getCodePage = function () {
      return codePage;
    };

    this.startPicking = function ( gl, x, y ) {
    };

    this.movePicking = function ( gl, x, y ) {
    };

    this.startPointer = function ( x, y ) {
    };

    this.movePointer = function ( x, y ) {
    };

    this.endPointer = function () {
      dragging = false;
    };

    this.bindEvents = function ( k, p ) {
      if ( k ) {
        k.addEventListener( "keydown", this.keyDown.bind( this ) );
      }

      if ( p ) {
        p.addEventListener( "mousedown", mouseButtonDown );
        p.addEventListener( "mousemove", mouseMove );
        p.addEventListener( "mouseup", mouseButtonUp );
        p.addEventListener( "touchstart", touchStart );
        p.addEventListener( "touchmove", touchMove );
        p.addEventListener( "touchend", touchEnd );
      }
    };

    this.keyDown = function ( evt ) {
      if ( this.focused ) {
        evt = evt || event;

        var key = evt.keyCode;
        if ( key !== Primrose.Keys.CTRL && key !== Primrose.Keys.ALT && key !==
            Primrose.Keys.META_L &&
            key !== Primrose.Keys.META_R && key !== Primrose.Keys.SHIFT ) {
          var oldDeadKeyState = deadKeyState;

          var commandName = deadKeyState;

          if ( evt.ctrlKey ) {
            commandName += "CTRL";
          }
          if ( evt.altKey ) {
            commandName += "ALT";
          }
          if ( evt.metaKey ) {
            commandName += "META";
          }
          if ( evt.shiftKey ) {
            commandName += "SHIFT";
          }
          if ( commandName === deadKeyState ) {
            commandName += "NORMAL";
          }

          commandName += "_" + keyNames[key];

          var func = commandPack[browser + "_" + commandName] ||
              commandPack[commandName];
          if ( func ) {
            this.frontCursor.moved = false;
            this.backCursor.moved = false;
            func( self, tokenRows );
            if ( this.frontCursor.moved && !this.backCursor.moved ) {
              this.backCursor.copy( this.frontCursor );
            }
            clampScroll();
            evt.preventDefault();
          }

          if ( deadKeyState === oldDeadKeyState ) {
            deadKeyState = "";
          }
        }
        this.update();
      }
    };

    this.render = function () {
      Primrose.Text.Control.prototype.render.call( this );
    };

    //////////////////////////////////////////////////////////////////////////
    // initialization
    /////////////////////////////////////////////////////////////////////////

    //
    // different browsers have different sets of keycodes for less-frequently
    // used keys like.
    browser = isChrome ? "CHROMIUM" : ( isFirefox ? "FIREFOX" :
        ( isIE ?
            "IE" :
            ( isOpera ? "OPERA" : ( isSafari ? "SAFARI" :
                "UNKNOWN" ) ) ) );

    DOMElement = cascadeElement( id, "canvas", HTMLCanvasElement );

    if ( options.autoBindEvents ) {
      if ( options.keyEventSource === undefined ) {
        options.keyEventSource = DOMElement;
      }
      if ( options.pointerEventSource === undefined ) {
        options.pointerEventSource = DOMElement;
      }
    }

    this.setCodePage( options.codePage );
    this.setOperatingSystem( options.os );

    this.bindEvents(
        options.keyEventSource,
        options.pointerEventSource );

    this.keyboardSelect = makeSelectorFromObj(
        "primrose-keyboard-selector-" +
        DOMElement.id, Primrose.Text.CodePages, codePage.name, self, "setCodePage",
        "Localization", Primrose.Text.CodePage );
    this.operatingSystemSelect = makeSelectorFromObj(
        "primrose-operating-system-selector-" + DOMElement.id,
        Primrose.Text.OperatingSystems, operatingSystem.name, self,
        "setOperatingSystem",
        "Shortcut style", Primrose.Text.OperatingSystem );
  }

  inherit( Keyboard, Primrose.Text.Control );

  return Keyboard;
} )();
