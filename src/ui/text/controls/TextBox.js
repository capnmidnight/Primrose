/* global qp, Primrose, isOSX, isIE, isOpera, isChrome, isFirefox, isSafari */
Primrose.UI.Text.Controls.TextBox = ( function ( ) {
  "use strict";

  function TextBox ( renderToElementOrID, options ) {
    var self = this;
    //////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    //////////////////////////////////////////////////////////////////////////

    options = options || { };
    if ( typeof options === "string" ) {
      options = { file: options };
    }

    if(options.readOnly){
      options.disableClipboard = true;
    }

    Primrose.UI.Text.Control.call( this );

    //////////////////////////////////////////////////////////////////////////
    // private fields
    //////////////////////////////////////////////////////////////////////////
    var Renderer = options.renderer || Primrose.UI.Text.Renderers.Canvas,
        codePage,
        operatingSystem,
        browser,
        CommandSystem,
        keyboardSystem,
        commandPack,
        tokenizer,
        tokens,
        tokenRows,
        theme,
        pointer = new Primrose.UI.Text.Point(),
        lastPointer = new Primrose.UI.Text.Point(),
        tabWidth,
        tabString,
        currentTouchID,
        deadKeyState = "",
        keyNames = [ ],
        history = [ ],
        historyFrame = -1,
        gridBounds = new Primrose.UI.Text.Rectangle(),
        topLeftGutter = new Primrose.UI.Text.Size(),
        bottomRightGutter = new Primrose.UI.Text.Size(),
        dragging = false,
        scrolling = false,
        showLineNumbers = true,
        showScrollBars = true,
        wordWrap = false,
        wheelScrollSpeed = 0,
        renderer = new Renderer( renderToElementOrID, options ),
        surrogate = cascadeElement( "primrose-surrogate-textarea-" +
            renderer.id, "textarea", window.HTMLTextAreaElement ),
        surrogateContainer;

    //////////////////////////////////////////////////////////////////////////
    // public fields
    //////////////////////////////////////////////////////////////////////////

    this.frontCursor = new Primrose.UI.Text.Cursor();
    this.backCursor = new Primrose.UI.Text.Cursor();
    this.scroll = new Primrose.UI.Text.Point();


    //////////////////////////////////////////////////////////////////////////
    // private methods
    //////////////////////////////////////////////////////////////////////////

    function refreshTokens () {
      tokens = tokenizer.tokenize( self.value );
      self.update();
    }

    function clampScroll () {
      if ( self.scroll.y < 0 ) {
        self.scroll.y = 0;
      }
      else {
        while ( 0 < self.scroll.y &&
            self.scroll.y > tokenRows.length - gridBounds.height ) {
          --self.scroll.y;
        }
      }
    }

    function setSurrogateSize () {
      if ( theme ) {
        var bounds = renderer.getDOMElement()
            .getBoundingClientRect();
        surrogateContainer.style.left = px( bounds.left );
        surrogateContainer.style.top = px( window.scrollY + bounds.top );
        surrogateContainer.style.width = 0;
        surrogateContainer.style.height = 0;
        surrogate.style.fontFamily = theme.fontFamily;
        var ch = renderer.character.height / renderer.getPixelRatio();
        surrogate.style.fontSize = px( ch * 0.99 );
        surrogate.style.lineHeight = px( ch );
      }
    }

    function setCursorXY ( cursor, x, y ) {
      self.changed = true;
      pointer.set( x, y );
      renderer.pixel2cell( pointer, self.scroll, gridBounds );
      var gx = pointer.x - self.scroll.x;
      var gy = pointer.y - self.scroll.y;
      var onBottom = gy >= gridBounds.height;
      var onLeft = gx < 0;
      var onRight = pointer.x >= gridBounds.width;
      if ( !scrolling && !onBottom && !onLeft && !onRight ) {
        cursor.setXY( pointer.x, pointer.y, tokenRows );
        setSurrogateCursor();
        self.backCursor.copy( cursor );
      }
      else if ( scrolling || onRight && !onBottom ) {
        scrolling = true;
        var scrollHeight = tokenRows.length - gridBounds.height;
        if ( gy >= 0 && scrollHeight >= 0 ) {
          var sy = gy * scrollHeight / gridBounds.height;
          self.scroll.y = Math.floor( sy );
        }
      }
      else if ( onBottom && !onLeft ) {
        var maxWidth = 0;
        for ( var dy = 0; dy < tokenRows.length; ++dy ) {
          var tokenRow = tokenRows[dy];
          var width = 0;
          for ( var dx = 0; dx < tokenRow.length; ++dx ) {
            width += tokenRow[dx].value.length;
          }
          maxWidth = Math.max( maxWidth, width );
        }
        var scrollWidth = maxWidth - gridBounds.width;
        if ( gx >= 0 && scrollWidth >= 0 ) {
          var sx = gx * scrollWidth / gridBounds.width;
          self.scroll.x = Math.floor( sx );
        }
      }
      else if ( onLeft && !onBottom ) {
        // clicked in number-line gutter
      }
      else {
        // clicked in the lower-left corner
      }
      lastPointer.copy( pointer );
    }

    function fixCursor () {
      var moved = self.frontCursor.fixCursor( tokenRows ) ||
          self.backCursor.fixCursor( tokenRows );
      if ( moved ) {
        self.render();
      }
    }

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
      if ( keyboardSystem && operatingSystem && CommandSystem ) {
        commandPack = new CommandSystem( operatingSystem, keyboardSystem,
            self );
      }
    }

    function makeCursorCommand ( name ) {
      var method = name.toLowerCase();
      self["cursor" + name] = function ( tokenRows, cursor ) {
        self.changed = true;
        cursor[method]( tokenRows );
        self.scrollIntoView( cursor );
      };
    }

    function performLayout () {
      var lineCountWidth;
      if ( showLineNumbers ) {
        lineCountWidth = Math.max( 1, Math.ceil( Math.log(
            self.getLineCount() ) / Math.LN10 ) );
        topLeftGutter.width = 1;
      }
      else {
        lineCountWidth = 0;
        topLeftGutter.width = 0;
      }

      if ( showScrollBars ) {
        if ( wordWrap ) {
          bottomRightGutter.set( renderer.VSCROLL_WIDTH, 0 );
        }
        else {
          bottomRightGutter.set( renderer.VSCROLL_WIDTH, 1 );
        }
      }
      else {
        bottomRightGutter.set( 0, 0 );
      }

      var x = topLeftGutter.width + lineCountWidth,
          y = 0,
          w = Math.floor( self.getWidth() /
              renderer.character.width ) -
          x -
          bottomRightGutter.width,
          h = Math.floor( self.getHeight() /
              renderer.character.height ) -
          y -
          bottomRightGutter.height;
      gridBounds.set( x + 2, y, w - 2, h - 2 );
      var cw = renderer.character.width / renderer.getPixelRatio();
      var ch = renderer.character.height / renderer.getPixelRatio();
      surrogate.style.left = px( gridBounds.x * cw );
      surrogate.style.top = px( gridBounds.y * ch );
      surrogate.style.width = px( gridBounds.width * cw );
      surrogate.style.height = px( gridBounds.height * ch );

      // group the tokens into rows
      tokenRows = [ [ ] ];
      var currentRowWidth = 0;
      var tokenQueue = tokens.slice();
      for ( var i = 0; i < tokenQueue.length; ++i ) {
        var t = tokenQueue[i].clone();
        var widthLeft = gridBounds.width - currentRowWidth;
        var wrap = wordWrap && t.type !== "newlines" && t.value.length >
            widthLeft;
        var breakLine = t.type === "newlines" || wrap;
        if ( wrap ) {
          var split = t.value.length > gridBounds.width ? widthLeft : 0;
          tokenQueue.splice( i + 1, 0, t.splitAt( split ) );
        }

        if ( t.value.length > 0 ) {
          tokenRows[tokenRows.length - 1].push( t );
          currentRowWidth += t.value.length;
        }

        if ( breakLine ) {
          tokenRows.push( [ ] );
          currentRowWidth = 0;
        }
      }
      return lineCountWidth;
    }

    function setFalse ( evt ) {
      evt.returnValue = false;
    }

    function setSurrogateCursor () {
      surrogate.selectionStart = Math.min( self.frontCursor.i,
          self.backCursor.i );
      surrogate.selectionEnd = Math.max( self.frontCursor.i,
          self.backCursor.i );
    }

    function minDelta ( v, minV, maxV ) {
      var dvMinV = v - minV,
          dvMaxV = v - maxV + 5,
          dv = 0;
      if ( dvMinV < 0 || dvMaxV >= 0 ) {
        // compare the absolute values, so we get the smallest change
        // regardless of direction.
        dv = Math.abs( dvMinV ) < Math.abs( dvMaxV ) ? dvMinV : dvMaxV;
      }

      return dv;
    }

    function makeToggler ( id, value, lblTxt, funcName ) {
      var span = document.createElement( "span" );

      var check = document.createElement( "input" );
      check.type = "checkbox";
      check.checked = value;
      check.id = id;
      span.appendChild( check );

      var lbl = document.createElement( "label" );
      lbl.innerHTML = lblTxt + " ";
      lbl.for = id;
      span.appendChild( lbl );

      check.addEventListener( "change", function () {
        self[funcName]( check.checked );
      } );
      return span;
    }

    function makeSelectorFromObj ( id, obj, def, target, prop, lbl, filter ) {
      var elem = cascadeElement( id, "select", window.HTMLSelectElement );
      var items = [ ];
      for ( var key in obj ) {
        if ( obj.hasOwnProperty( key ) ) {
          var val = obj[key];
          if ( !filter || val instanceof filter ) {
            val = val.name || key;
            var opt = document.createElement( "option" );
            opt.innerHTML = val;
            items.push( obj[key] );
            if ( val === def ) {
              opt.selected = "selected";
            }
            elem.appendChild( opt );
          }
        }
      }

      if ( typeof target[prop] === "function" ) {
        elem.addEventListener( "change", function () {
          target[prop]( items[elem.selectedIndex] );
        } );
      }
      else {
        elem.addEventListener( "change", function () {
          target[prop] = items[elem.selectedIndex];
        } );
      }

      var container = cascadeElement( "container -" + id, "div",
          window.HTMLDivElement );
      var label = cascadeElement( "label-" + id, "span",
          window.HTMLSpanElement );
      label.innerHTML = lbl + ": ";
      label.for = elem;
      elem.title = lbl;
      elem.alt = lbl;
      container.appendChild( label );
      container.appendChild( elem );
      return container;
    }


    //////////////////////////////////////////////////////////////////////////
    // public methods
    //////////////////////////////////////////////////////////////////////////
    [ "Left", "Right",
      "SkipLeft", "SkipRight",
      "Up", "Down",
      "Home", "End",
      "FullHome", "FullEnd" ].map( makeCursorCommand.bind( this ) );

    this.addEventListener = function ( event, thunk ) {
      if ( event === "keydown" ) {
        options.keyEventSource.addEventListener( event, thunk );
      }
    };

    this.cursorPageUp = function ( tokenRows, cursor ) {
      this.changed = true;
      cursor.incY( -gridBounds.height, tokenRows );
      this.scrollIntoView( cursor );
    };

    this.cursorPageDown = function ( tokenRows, cursor ) {
      this.changed = true;
      cursor.incY( gridBounds.height, tokenRows );
      this.scrollIntoView( cursor );
    };

    this.getDOMElement = function () {
      return renderer.getDOMElement();
    };

    this.focus = function () {
      surrogate.focus();
      Primrose.UI.Text.Control.prototype.focus.call( this );
    };

    this.blur = function () {
      surrogate.blur();
      Primrose.UI.Text.Control.prototype.blur.call( this );
    };

    this.getRenderer = function () {
      return renderer;
    };

    this.setWheelScrollSpeed = function ( v ) {
      wheelScrollSpeed = v || 25;
    };

    this.getWheelScrollSpeed = function () {
      return wheelScrollSpeed;
    };

    this.setWordWrap = function ( v ) {
      wordWrap = v || false;
      this.forceUpdate();
    };

    this.getWordWrap = function () {
      return wordWrap;
    };

    this.setShowLineNumbers = function ( v ) {
      showLineNumbers = v;
      this.forceUpdate();
    };

    this.getShowLineNumbers = function () {
      return showLineNumbers;
    };

    this.setShowScrollBars = function ( v ) {
      showScrollBars = v;
      this.forceUpdate();
    };

    this.getShowScrollBars = function () {
      return showScrollBars;
    };

    this.setTheme = function ( t ) {
      theme = t || Primrose.UI.Text.Themes.Default;
      renderer.setTheme( theme );
      renderer.resize();
      this.changed = true;
      this.update();
    };

    this.getTheme = function () {
      return theme;
    };

    this.setDeadKeyState = function ( st ) {
      this.changed = true;
      deadKeyState = st || "";
    };

    this.setOperatingSystem = function ( os ) {
      this.changed = true;
      operatingSystem = os || ( isOSX ? Primrose.UI.Text.OperatingSystems.OSX :
          Primrose.UI.Text.OperatingSystems.Windows );
      refreshCommandPack();
    };

    this.getOperatingSystem = function () {
      return operatingSystem;
    };

    this.setCommandSystem = function ( cmd ) {
      this.changed = true;
      CommandSystem = cmd || Primrose.UI.Text.CommandPacks.TextEditor;
      refreshCommandPack();
    };

    this.setSize = function ( w, h ) {
      this.changed = renderer.setSize( w, h );
    };

    this.getWidth = function () {
      return renderer.getWidth();
    };

    this.getHeight = function () {
      return renderer.getHeight();
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

        for ( key in Primrose.UI.Text.CodePages ) {
          cp = Primrose.UI.Text.CodePages[key];
          if ( cp.language === lang ) {
            codePage = cp;
            break;
          }
        }

        if ( !codePage ) {
          codePage = Primrose.UI.Text.CodePages.EN_US;
        }
      }

      keyNames = [ ];
      for ( key in Primrose.UI.Text.Keys ) {
        code = Primrose.UI.Text.Keys[key];
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

    this.setTokenizer = function ( tk ) {
      this.changed = true;
      tokenizer = tk || Primrose.UI.Text.Grammars.JavaScript;
      if ( history && history.length > 0 ) {
        refreshTokens();
        this.update();
      }
    };

    this.getTokenizer = function () {
      return tokenizer;
    };

    this.getLines = function () {
      return history[historyFrame].slice();
    };

    this.getLineCount = function () {
      return history[historyFrame].length;
    };


    Object.defineProperties( this, {
      value: {
        get: function () {
          return history[historyFrame].join( "\n" );
        },
        set: function ( txt ) {
          txt = txt || "";
          txt = txt.replace( /\r\n/g, "\n" );
          var lines = txt.split( "\n" );
          this.pushUndo( lines );
          this.update();
          surrogate.value = txt;
          setSurrogateCursor();
        }
      },
      selectionStart: {
        get: function () {
          return this.frontCursor.i;
        },
        set: function ( i ) {
          this.frontCursor.setI( i, tokenRows );
        }
      },
      selectionEnd: {
        get: function () {
          return this.backCursor.i;
        },
        set: function ( i ) {
          this.backCursor.setI( i, tokenRows );
        }
      },
      selectionDirection: {
        get: function () {
          return this.frontCursor.i <= this.backCursor.i ? "forward"
              : "backward";
        }
      }
    } );

    this.pushUndo = function ( lines ) {
      if ( historyFrame < history.length - 1 ) {
        history.splice( historyFrame + 1 );
      }
      history.push( lines );
      historyFrame = history.length - 1;
      refreshTokens();
      this.forceUpdate();
    };

    this.redo = function () {
      this.changed = true;
      if ( historyFrame < history.length - 1 ) {
        ++historyFrame;
      }
      refreshTokens();
      fixCursor();
    };

    this.undo = function () {
      this.changed = true;
      if ( historyFrame > 0 ) {
        --historyFrame;
      }
      refreshTokens();
      fixCursor();
    };

    this.setTabWidth = function ( tw ) {
      tabWidth = tw || 4;
      tabString = "";
      for ( var i = 0; i < tabWidth; ++i ) {
        tabString += " ";
      }
    };

    this.getTabWidth = function () {
      return tabWidth;
    };

    this.getTabString = function () {
      return tabString;
    };

    this.scrollIntoView = function ( currentCursor ) {
      this.scroll.y += minDelta( currentCursor.y, this.scroll.y,
          this.scroll.y + gridBounds.height );
      if ( !wordWrap ) {
        this.scroll.x += minDelta( currentCursor.x, this.scroll.x,
            this.scroll.x + gridBounds.width );
      }
      clampScroll();
    };

    this.increaseFontSize = function () {
      ++theme.fontSize;
      this.changed = renderer.resize();
    };

    this.decreaseFontSize = function () {
      if ( theme.fontSize > 1 ) {
        --theme.fontSize;
        this.changed = renderer.resize();
      }
    };

    this.setFontSize = function ( v ) {
      theme.fontSize = v;
      this.changed = renderer.resize();
    };

    this.cell2i = function ( x, y ) {
      var i = 0;
      for ( var dy = 0; dy < y; ++dy ) {
        var tokenRow = tokenRows[dy];
        for ( var dx = 0; dx < tokenRow.length; ++dx ) {
          i += tokenRow[dx].value.length;
        }
        ++i;
      }
      i += x;
      return i;
    };

    this.i2cell = function ( i ) {
      for ( var y = 0; y < tokenRows.length; ++y ) {
        var tokenRow = tokenRows[y];
        var rowWidth = 0;
        for ( var x = 0; x < tokenRow.length; ++x ) {
          rowWidth += tokenRow[x].value.length;
        }
        if ( i <= rowWidth ) {
          return { x: i, y: y };
        }
        else {
          i -= rowWidth - 1;
        }
      }
    };

    this.readWheel = function ( evt ) {
      this.scroll.y += Math.floor( evt.deltaY / wheelScrollSpeed );
      clampScroll();
      evt.preventDefault();
      this.forceUpdate();
    };

    this.startPicking = function ( gl, x, y ) {
      var p = renderer.getPixelIndex( gl, x, y );
      this.startPointer( p.x, p.y );
    };

    this.movePicking = function ( gl, x, y ) {
      var p = renderer.getPixelIndex( gl, x, y );
      this.movePointer( p.x, p.y );
    };

    this.startPointer = function ( x, y ) {
      setCursorXY( this.frontCursor, x, y );
      dragging = true;
      this.update();
    };

    this.movePointer = function ( x, y ) {
      if ( dragging ) {
        setCursorXY( this.backCursor, x, y );
        this.update();
      }
    };

    this.endPointer = function () {
      dragging = false;
      scrolling = false;
      surrogate.focus();
    };

    this.bindEvents = function ( k, p, w, c ) {
      if ( k ) {
        k.addEventListener( "keydown", this.keyDown.bind( this ) );
      }

      if ( p ) {
        p.addEventListener( "wheel", this.readWheel.bind( this ) );
        p.addEventListener( "mousedown", mouseButtonDown );
        p.addEventListener( "mousemove", mouseMove );
        p.addEventListener( "mouseup", mouseButtonUp );
        p.addEventListener( "touchstart", touchStart );
        p.addEventListener( "touchmove", touchMove );
        p.addEventListener( "touchend", touchEnd );
      }

      if ( w ) {
        w.addEventListener( "wheel", this.readWheel.bind( this ) );
      }

      if ( c ) {
        surrogate.addEventListener( "beforecopy", setFalse );
        surrogate.addEventListener( "copy", this.copySelectedText.bind( this ) );
        surrogate.addEventListener( "beforecut", setFalse );
        surrogate.addEventListener( "cut", this.cutSelectedText.bind( this ) );
        if ( k ) {
          k.addEventListener( "beforepaste", setFalse );
          k.addEventListener( "paste", this.readClipboard.bind( this ) );
        }
      }
    };

    this.overwriteText = function ( str ) {
      str = str || "";
      str = str.replace( /\r\n/g, "\n" );

      if ( this.frontCursor.i !== this.backCursor.i || str.length > 0 ) {
        var minCursor = Primrose.UI.Text.Cursor.min( this.frontCursor,
            this.backCursor ),
            maxCursor = Primrose.UI.Text.Cursor.max( this.frontCursor,
                this.backCursor ),
            // TODO: don't recalc the string first.
            text = this.value,
            left = text.substring( 0, minCursor.i ),
            right = text.substring( maxCursor.i );
        this.value = left + str + right;
        minCursor.advanceN( tokenRows, Math.max( 0, str.length ) );
        this.scrollIntoView( maxCursor );
        clampScroll();
        maxCursor.copy( minCursor );
        this.render();
      }
    };

    this.copySelectedText = function ( evt ) {
      evt.returnValue = false;
      if ( this.frontCursor.i !== this.backCursor.i ) {
        var minCursor = Primrose.UI.Text.Cursor.min( this.frontCursor,
            this.backCursor ),
            maxCursor = Primrose.UI.Text.Cursor.max( this.frontCursor,
                this.backCursor ),
            text = this.value,
            str = text.substring( minCursor.i, maxCursor.i );
        var clipboard = evt.clipboardData || window.clipboardData;
        clipboard.setData( window.clipboardData ? "Text" : "text/plain",
            str );
      }
      evt.preventDefault();
    };

    this.cutSelectedText = function ( evt ) {
      this.copySelectedText( evt );
      this.overwriteText();
      this.update();
    };

    this.readClipboard = function ( evt ) {
      evt.returnValue = false;
      var clipboard = evt.clipboardData || window.clipboardData,
          str = clipboard.getData( window.clipboardData ? "Text" :
              "text/plain" );
      if ( str ) {
        this.overwriteText( str );
      }
    };

    this.keyDown = function ( evt ) {
      if ( this.focused ) {
        evt = evt || event;

        var key = evt.keyCode;
        if ( key !== Primrose.UI.Text.Keys.CTRL && key !== Primrose.UI.Text.Keys.ALT && key !==
            Primrose.UI.Text.Keys.META_L &&
            key !== Primrose.UI.Text.Keys.META_R && key !== Primrose.UI.Text.Keys.SHIFT ) {
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

    this.update = function () {
      if ( renderer.hasResized() ) {
        this.changed = renderer.resize();
        setSurrogateSize();
      }

      Primrose.UI.Text.Control.prototype.update.call( this );
    };

    this.render = function () {
      if ( tokens ) {
        var lineCountWidth = performLayout();

        renderer.render(
            tokenRows,
            this.frontCursor, this.backCursor,
            gridBounds,
            this.scroll,
            this.focused, showLineNumbers, showScrollBars, wordWrap,
            lineCountWidth );

        setSurrogateCursor();

        Primrose.UI.Text.Control.prototype.render.call( this );
      }
    };

    this.appendControls = function ( elem ) {
      elem.appendChild( this.lineNumberToggler );
      elem.appendChild( this.wordWrapToggler );
      elem.appendChild( this.scrollBarToggler );
      elem.appendChild( this.operatingSystemSelect );
      elem.appendChild( this.keyboardSelect );
      elem.appendChild( this.commandSystemSelect );
      elem.appendChild( this.tokenizerSelect );
      elem.appendChild( this.themeSelect );
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

    //
    // the `surrogate` textarea makes the soft-keyboard appear on mobile devices.
    surrogate.style.position = "absolute";
    surrogate.addEventListener( "blur", this.blur.bind( this ) );
    surrogateContainer = makeHidingContainer(
        "primrose-surrogate-textarea-container-" + renderer.id,
        surrogate );

    document.body.insertBefore( surrogateContainer,
        document.body.children[0] );

    this.readOnly = !!options.readOnly;

    if ( options.autoBindEvents || renderer.autoBindEvents ) {
      if ( !options.readOnly && options.keyEventSource === undefined ) {
        options.keyEventSource = surrogate;
      }
      if ( options.pointerEventSource === undefined ) {
        options.pointerEventSource = renderer.getDOMElement();
      }
      if ( options.wheelEventSource === undefined ) {
        options.wheelEventSource = renderer.getDOMElement();
      }
    }

    this.setWheelScrollSpeed( options.wheelScrollSpeed );
    this.setWordWrap( !options.disableWordWrap );
    this.setShowLineNumbers( !options.hideLineNumbers );
    this.setShowScrollBars( !options.hideScrollBars );
    this.setTabWidth( options.tabWidth );
    this.setTheme( options.theme );
    this.setFontSize( options.fontSize || 14 );
    this.setTokenizer( options.tokenizer );
    this.setCodePage( options.codePage );
    this.setOperatingSystem( options.os );
    this.setCommandSystem( options.commands );
    this.value = options.file;

    this.bindEvents(
        options.keyEventSource,
        options.pointerEventSource,
        options.wheelEventSource,
        !options.disableClipboard );

    this.lineNumberToggler = makeToggler( "primrose-line-number-toggler-" +
        renderer.id, !options.hideLineNumbers, "Line numbers",
        "setShowLineNumbers" );
    this.wordWrapToggler = makeToggler( "primrose-word-wrap-toggler-" +
        renderer.id, !options.disableWordWrap, "Line wrap", "setWordWrap" );
    this.scrollBarToggler = makeToggler( "primrose-scrollbar-toggler-" +
        renderer.id, !options.hideScrollBars, "Scroll bars",
        "setShowScrollBars" );
    this.themeSelect = makeSelectorFromObj( "primrose-theme-selector-" +
        renderer.id, Primrose.UI.Text.Themes, theme.name, self, "setTheme", "theme" );
    this.commandSystemSelect = makeSelectorFromObj(
        "primrose-command-system-selector-" + renderer.id, Primrose.UI.Text.Commands,
        CommandSystem.name, self, "setCommandSystem",
        "Command system" );
    this.tokenizerSelect = makeSelectorFromObj(
        "primrose-tokenizer-selector-" +
        renderer.id, Primrose.UI.Text.Grammars, tokenizer.name, self, "setTokenizer",
        "Language syntax", Primrose.UI.Text.Grammar );
    this.keyboardSelect = makeSelectorFromObj(
        "primrose-keyboard-selector-" +
        renderer.id, Primrose.UI.Text.CodePages, codePage.name, self, "setCodePage",
        "Localization", Primrose.UI.Text.CodePage );
    this.operatingSystemSelect = makeSelectorFromObj(
        "primrose-operating-system-selector-" + renderer.id,
        Primrose.UI.Text.OperatingSystems, operatingSystem.name, self,
        "setOperatingSystem",
        "Shortcut style", Primrose.UI.Text.OperatingSystem );
    setSurrogateSize();
  }

  inherit( TextBox, Primrose.UI.Text.Control );

  return TextBox;
} )();
