/* global qp, Primrose, isOSX, isIE, isOpera, isChrome, isFirefox, isSafari, HTMLCanvasElement */
Primrose.Text.Controls.TextBox = ( function ( ) {
  "use strict";

  var SCROLL_SCALE = isFirefox ? 3 : 100;

  function TextBox ( renderToElementOrID, options ) {
    var self = this;
    //////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    //////////////////////////////////////////////////////////////////////////

    options = options || {};
    if ( typeof options === "string" ) {
      options = {file: options};
    }

    Primrose.Text.Control.call( this );

    //////////////////////////////////////////////////////////////////////////
    // private fields
    //////////////////////////////////////////////////////////////////////////
    var Renderer = options.renderer || Primrose.Text.Renderers.Canvas,
        codePage,
        operatingSystem,
        browser,
        CommandSystem,
        keyboardSystem,
        commandPack,
        tokenizer,
        tokens,
        tokenRows,
        tokenHashes,
        lines,
        theme,
        pointer = new Primrose.Text.Point(),
        lastPointer = new Primrose.Text.Point(),
        tabWidth,
        tabString,
        currentTouchID,
        deadKeyState = "",
        keyNames = [ ],
        history = [ ],
        historyFrame = -1,
        gridBounds = new Primrose.Text.Rectangle(),
        topLeftGutter = new Primrose.Text.Size(),
        bottomRightGutter = new Primrose.Text.Size(),
        dragging = false,
        scrolling = false,
        showLineNumbers = true,
        showScrollBars = true,
        wordWrap = false,
        wheelScrollSpeed = 0,
        renderer = new Renderer( renderToElementOrID, options ),
        surrogate = null,
        surrogateContainer = null;

    //////////////////////////////////////////////////////////////////////////
    // public fields
    //////////////////////////////////////////////////////////////////////////

    this.frontCursor = new Primrose.Text.Cursor();
    this.backCursor = new Primrose.Text.Cursor();
    this.scroll = new Primrose.Text.Point();


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
            self.scroll.y > lines.length - gridBounds.height ) {
          --self.scroll.y;
        }
      }
    }

    function setCursorXY ( cursor, x, y ) {
      pointer.set( x, y );
      renderer.pixel2cell( pointer, self.scroll, gridBounds );
      var gx = pointer.x - self.scroll.x;
      var gy = pointer.y - self.scroll.y;
      var onBottom = gy >= gridBounds.height;
      var onLeft = gx < 0;
      var onRight = pointer.x >= gridBounds.width;
      if ( !scrolling && !onBottom && !onLeft && !onRight ) {
        cursor.setXY( pointer.x, pointer.y, lines );
        self.backCursor.copy( cursor );
      }
      else if ( scrolling || onRight && !onBottom ) {
        scrolling = true;
        var scrollHeight = lines.length - gridBounds.height;
        if ( gy >= 0 && scrollHeight >= 0 ) {
          var sy = gy * scrollHeight / gridBounds.height;
          self.scroll.y = Math.floor( sy );
        }
      }
      else if ( onBottom && !onLeft ) {
        var maxWidth = 0;
        for ( var dy = 0; dy < lines.length; ++dy ) {
          maxWidth = Math.max( maxWidth, lines[dy].length );
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
      var moved = self.frontCursor.fixCursor( lines ) ||
          self.backCursor.fixCursor( lines );
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
      self["cursor" + name] = function ( lines, cursor ) {
        cursor[method]( lines );
        self.scrollIntoView( cursor );
      };
    }

    function setGutter () {
      if ( showLineNumbers ) {
        topLeftGutter.width = 1;
      }
      else {
        topLeftGutter.width = 0;
      }

      if ( !showScrollBars ) {
        bottomRightGutter.set( 0, 0 );
      }
      else if ( wordWrap ) {
        bottomRightGutter.set( renderer.VSCROLL_WIDTH, 0 );
      }
      else {
        bottomRightGutter.set( renderer.VSCROLL_WIDTH, 1 );
      }
    }

    function performLayout () {
      var lineCountWidth = 0;
      if ( showLineNumbers ) {
        lineCountWidth = Math.max( 1, Math.ceil( Math.log( self.getLineCount() ) / Math.LN10 ) );
      }

      var x = topLeftGutter.width + lineCountWidth,
          y = 0,
          w = Math.floor( self.getWidth() / renderer.character.width ) - x - bottomRightGutter.width,
          h = Math.floor( self.getHeight() / renderer.character.height ) - y - bottomRightGutter.height;
      gridBounds.set( x + 2, y, w - 2, h - 2 );

      // group the tokens into rows
      tokenRows = [ [ ] ];
      tokenHashes = [ "" ];
      lines = [ "" ];
      var currentRowWidth = 0;
      var tokenQueue = tokens.slice();
      for ( var i = 0; i < tokenQueue.length; ++i ) {
        var t = tokenQueue[i].clone();
        var widthLeft = gridBounds.width - currentRowWidth;
        var wrap = wordWrap && t.type !== "newlines" && t.value.length > widthLeft;
        var breakLine = t.type === "newlines" || wrap;
        if ( wrap ) {
          var split = t.value.length > gridBounds.width ? widthLeft : 0;
          tokenQueue.splice( i + 1, 0, t.splitAt( split ) );
        }

        if ( t.value.length > 0 ) {
          tokenRows[tokenRows.length - 1].push( t );
          tokenHashes[tokenHashes.length - 1] += JSON.stringify( t );
          lines[lines.length - 1] += t.value;
          currentRowWidth += t.value.length;
        }

        if ( breakLine ) {
          tokenRows.push( [ ] );
          tokenHashes.push( "" );
          lines.push("");
          currentRowWidth = 0;
        }
      }
      return lineCountWidth;
    }

    function setFalse ( evt ) {
      evt.returnValue = false;
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

    this.cursorPageUp = function ( lines, cursor ) {
      cursor.incY( -gridBounds.height, lines );
      this.scrollIntoView( cursor );
    };

    this.cursorPageDown = function ( lines, cursor ) {
      cursor.incY( gridBounds.height, lines );
      this.scrollIntoView( cursor );
    };

    this.getDOMElement = function () {
      return renderer.getDOMElement();
    };

    this.getRenderer = function () {
      return renderer;
    };

    this.setWheelScrollSpeed = function ( v ) {
      wheelScrollSpeed = v || 4;
    };

    this.getWheelScrollSpeed = function () {
      return wheelScrollSpeed;
    };

    this.setWordWrap = function ( v ) {
      wordWrap = v || false;
      setGutter();
    };

    this.getWordWrap = function () {
      return wordWrap;
    };

    this.setShowLineNumbers = function ( v ) {
      showLineNumbers = v;
      setGutter();
    };

    this.getShowLineNumbers = function () {
      return showLineNumbers;
    };

    this.setShowScrollBars = function ( v ) {
      showScrollBars = v;
      setGutter();
    };

    this.getShowScrollBars = function () {
      return showScrollBars;
    };

    this.setTheme = function ( t ) {
      theme = t || Primrose.Text.Themes.Default;
      renderer.setTheme( theme );
      renderer.resize();
      this.update();
    };

    this.getTheme = function () {
      return theme;
    };

    this.setDeadKeyState = function ( st ) {
      deadKeyState = st || "";
    };

    this.setOperatingSystem = function ( os ) {
      operatingSystem = os || ( isOSX ? Primrose.Text.OperatingSystems.OSX :
          Primrose.Text.OperatingSystems.Windows );
      refreshCommandPack();
    };

    this.getOperatingSystem = function () {
      return operatingSystem;
    };

    this.setCommandSystem = function ( cmd ) {
      CommandSystem = cmd || Primrose.Text.CommandPacks.TextEditor;
      refreshCommandPack();
    };

    this.setSize = function ( w, h ) {
      renderer.setSize( w, h );
    };

    this.getWidth = function () {
      return renderer.getWidth();
    };

    this.getHeight = function () {
      return renderer.getHeight();
    };

    this.setCodePage = function ( cp ) {
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
      for ( key in Primrose.Text.Keys ) {
        code = Primrose.Text.Keys[key];
        if ( !isNaN( code ) ) {
          keyNames[code] = key;
        }
      }

      keyboardSystem = {};
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
      tokenizer = tk || Primrose.Text.Grammars.JavaScript;
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
        }
      },
      selectionStart: {
        get: function () {
          return this.frontCursor.i;
        },
        set: function ( i ) {
          this.frontCursor.setI( i, lines );
        }
      },
      selectionEnd: {
        get: function () {
          return this.backCursor.i;
        },
        set: function ( i ) {
          this.backCursor.setI( i, lines );
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
    };

    this.redo = function () {
      if ( historyFrame < history.length - 1 ) {
        ++historyFrame;
      }
      refreshTokens();
      fixCursor();
    };

    this.undo = function () {
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
      renderer.resize();
    };

    this.decreaseFontSize = function () {
      if ( theme.fontSize > 1 ) {
        --theme.fontSize;
        renderer.resize();
      }
    };

    this.setFontSize = function ( v ) {
      theme.fontSize = v;
      renderer.resize();
    };

    this.cell2i = function ( x, y ) {
      var i = 0;
      for ( var dy = 0; dy < y; ++dy ) {
        i += line[dy].length + 1;
      }
      i += x;
      return i;
    };

    this.i2cell = function ( i ) {
      for ( var y = 0; y < lines.length; ++y ) {
        var rowWidth = lines[y].length;
        if ( i <= rowWidth ) {
          return {x: i, y: y};
        }
        else {
          i -= rowWidth - 1;
        }
      }
    };

    this.readWheel = function ( evt ) {

      if ( this.focused ) {
        if ( isChrome ) {
          this.scroll.y += Math.floor( evt.deltaY * wheelScrollSpeed / SCROLL_SCALE );
          this.setFontSize( theme.fontSize + evt.deltaX / SCROLL_SCALE );
        }
        else if ( evt.shiftKey ) {
          this.setFontSize( theme.fontSize + evt.deltaY / SCROLL_SCALE );
        }
        else {
          this.scroll.y += Math.floor( evt.deltaY * wheelScrollSpeed / SCROLL_SCALE );
        }
        clampScroll();
        evt.preventDefault();
      }
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
    };

    this.bindEvents = function ( k, p, w, enableClipboard ) {

      if ( p ) {
        if ( !w ) {
          p.addEventListener( "wheel", this.readWheel.bind( this ), false );
        }
        p.addEventListener( "mousedown", mouseButtonDown, false );
        p.addEventListener( "mousemove", mouseMove, false );
        p.addEventListener( "mouseup", mouseButtonUp, false );
        p.addEventListener( "touchstart", touchStart, false );
        p.addEventListener( "touchmove", touchMove, false );
        p.addEventListener( "touchend", touchEnd, false );
      }

      if ( w ) {
        w.addEventListener( "wheel", this.readWheel.bind( this ), false );
      }

      if ( k ) {

        if ( k instanceof HTMLCanvasElement && !k.tabindex ) {
          k.tabindex = 0;
        }

        if ( enableClipboard ) {
          //
          // the `surrogate` textarea makes clipboard events possible
          surrogate = cascadeElement( "primrose-surrogate-textarea-" + renderer.id, "textarea", window.HTMLTextAreaElement );
          surrogateContainer = makeHidingContainer( "primrose-surrogate-textarea-container-" + renderer.id, surrogate );
          surrogateContainer.style.position = "absolute";
          surrogateContainer.style.overflow = "hidden";
          surrogateContainer.style.width = 0;
          surrogateContainer.style.height = 0;
          document.body.insertBefore( surrogateContainer, document.body.children[0] );

          k.addEventListener( "beforepaste", setFalse, false );
          k.addEventListener( "paste", this.readClipboard.bind( this ), false );
          k.addEventListener( "keydown", function ( evt ) {
            if ( self.focused && operatingSystem.isClipboardReadingEvent( evt ) ) {
              surrogate.style.display = "block";
              surrogate.focus();
            }
          }, true );
          surrogate.addEventListener( "beforecopy", setFalse, false );
          surrogate.addEventListener( "copy", this.copySelectedText.bind( this ), false );
          surrogate.addEventListener( "beforecut", setFalse, false );
          surrogate.addEventListener( "cut", this.cutSelectedText.bind( this ), false );
        }

        k.addEventListener( "keydown", this.keyDown.bind( this ), false );
      }
    };

    this.overwriteText = function ( str ) {
      str = str || "";
      str = str.replace( /\r\n/g, "\n" );

      if ( this.frontCursor.i !== this.backCursor.i || str.length > 0 ) {
        var minCursor = Primrose.Text.Cursor.min( this.frontCursor,
            this.backCursor ),
            maxCursor = Primrose.Text.Cursor.max( this.frontCursor,
                this.backCursor ),
            // TODO: don't recalc the string first.
            text = this.value,
            left = text.substring( 0, minCursor.i ),
            right = text.substring( maxCursor.i );
        this.value = left + str + right;
        refreshTokens();
        performLayout();
        minCursor.advanceN( lines, Math.max( 0, str.length ) );
        this.scrollIntoView( maxCursor );
        clampScroll();
        maxCursor.copy( minCursor );
        this.render();
      }
    };

    this.copySelectedText = function ( evt ) {
      if ( this.focused ) {
        evt.returnValue = false;
        if ( this.frontCursor.i !== this.backCursor.i ) {
          var minCursor = Primrose.Text.Cursor.min( this.frontCursor,
              this.backCursor ),
              maxCursor = Primrose.Text.Cursor.max( this.frontCursor,
                  this.backCursor ),
              text = this.value,
              str = text.substring( minCursor.i, maxCursor.i );
          var clipboard = evt.clipboardData || window.clipboardData;
          clipboard.setData( window.clipboardData ? "Text" : "text/plain",
              str );
        }
        evt.preventDefault();
        surrogate.style.display = "none";
        options.keyEventSource.focus();
      }
    };

    this.cutSelectedText = function ( evt ) {
      if ( this.focused ) {
        this.copySelectedText( evt );
        if ( !this.readOnly ) {
          this.overwriteText();
          this.update();
        }
      }
    };

    this.readClipboard = function ( evt ) {
      if ( this.focused && !this.readOnly ) {
        evt.returnValue = false;
        var clipboard = evt.clipboardData || window.clipboardData,
            str = clipboard.getData( window.clipboardData ? "Text" :
                "text/plain" );
        if ( str ) {
          this.overwriteText( str );
        }
      }
    };

    this.keyDown = function ( evt ) {
      if ( this.focused ) {
        evt = evt || event;

        var key = evt.keyCode;
        if ( key !== Primrose.Text.Keys.CTRL &&
            key !== Primrose.Text.Keys.ALT &&
            key !== Primrose.Text.Keys.META_L &&
            key !== Primrose.Text.Keys.META_R &&
            key !== Primrose.Text.Keys.SHIFT &&
            ( !this.readOnly ||
                key === Primrose.Text.Keys.UPARROW ||
                key === Primrose.Text.Keys.DOWNARROW ||
                key === Primrose.Text.Keys.LEFTARROW ||
                key === Primrose.Text.Keys.RIGHTARROW ||
                key === Primrose.Text.Keys.PAGEUP ||
                key === Primrose.Text.Keys.PAGEDOWN ||
                key === Primrose.Text.Keys.END ||
                key === Primrose.Text.Keys.HOME ) ) {
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
            func( self, lines );
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
        renderer.resize();
      }
    };

    var lastText,
        lastCharacterWidth,
        lastCharacterHeight,
        lastWidth,
        lastHeight,
        lineCountWidth;
    this.render = function () {
      if ( tokens ) {

        var textChanged = lastText !== this.value,
            characterWidthChanged = renderer.character.width !== lastCharacterWidth,
            characterHeightChanged = renderer.character.height !== lastCharacterHeight,
            widthChanged = renderer.getWidth() !== lastWidth,
            heightChanged = renderer.getHeight() !== lastHeight,
            layoutChanged = textChanged || characterWidthChanged || characterHeightChanged || widthChanged || heightChanged;
        lastText = this.value;
        lastCharacterWidth = renderer.character.width;
        lastCharacterHeight = renderer.character.height;
        lastWidth = renderer.getWidth();
        lastHeight = renderer.getHeight();

        if ( layoutChanged ) {
          lineCountWidth = performLayout();
        }

        renderer.render(
            tokenRows,
            tokenHashes,
            this.frontCursor, this.backCursor,
            gridBounds,
            this.scroll,
            this.focused, showLineNumbers, showScrollBars, wordWrap,
            lineCountWidth,
            layoutChanged);
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
    browser = isChrome ? "CHROMIUM" : ( isFirefox ? "FIREFOX" : ( isIE ? "IE" : ( isOpera ? "OPERA" : ( isSafari ? "SAFARI" : "UNKNOWN" ) ) ) );

    this.readOnly = !!options.readOnly;

    if ( options.autoBindEvents || renderer.autoBindEvents ) {
      if ( !options.readOnly && options.keyEventSource === undefined ) {
        options.keyEventSource = renderer.getDOMElement();
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
        renderer.id, Primrose.Text.Themes, theme.name, self, "setTheme", "theme" );
    this.commandSystemSelect = makeSelectorFromObj(
        "primrose-command-system-selector-" + renderer.id, Primrose.Text.Commands,
        CommandSystem.name, self, "setCommandSystem",
        "Command system" );
    this.tokenizerSelect = makeSelectorFromObj(
        "primrose-tokenizer-selector-" +
        renderer.id, Primrose.Text.Grammars, tokenizer.name, self, "setTokenizer",
        "Language syntax", Primrose.Text.Grammar );
    this.keyboardSelect = makeSelectorFromObj(
        "primrose-keyboard-selector-" +
        renderer.id, Primrose.Text.CodePages, codePage.name, self, "setCodePage",
        "Localization", Primrose.Text.CodePage );
    this.operatingSystemSelect = makeSelectorFromObj(
        "primrose-operating-system-selector-" + renderer.id,
        Primrose.Text.OperatingSystems, operatingSystem.name, self,
        "setOperatingSystem",
        "Shortcut style", Primrose.Text.OperatingSystem );
  }

  inherit( TextBox, Primrose.Text.Control );

  return TextBox;
} )();
