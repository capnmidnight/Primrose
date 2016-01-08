/*global THREE, qp, Primrose */

Primrose.Text.Renderers.DOM = ( function ( ) {
  "use strict";

  var Size = Primrose.Text.Size,
      Cursor = Primrose.Text.Cursor,
      defaultTheme = Primrose.Text.Themes.Default;

  function FakeContext ( target ) {
    var self = this;
    this.font = null;
    this.fillStyle = null;
    var translate = [ new Point() ];

    function setFont ( elem ) {
      elem.style.font = self.font;
      elem.style.lineHeight = px( parseInt( self.font, 10 ) );
      elem.style.padding = "0";
      elem.style.margin = "0";
    }

    this.measureText = function ( txt ) {
      var tester = document.createElement( "div" );
      setFont( tester );
      tester.style.position = "absolute";
      tester.style.visibility = "hidden";
      tester.innerHTML = txt;
      document.body.appendChild( tester );
      var size = new Size( tester.clientWidth, tester.clientHeight );
      document.body.removeChild( tester );
      return size;
    };

    this.clearRect = function () {
      target.innerHTML = "";
    };

    this.drawImage = function ( img, x, y ) {
      var top = translate[translate.length - 1];
      img.style.position = "absolute";
      img.style.left = px( x + top.x );
      img.style.top = px( y + top.y );
      target.appendChild( img );
    };

    this.fillRect = function ( x, y, w, h ) {
      var top = translate[translate.length - 1];
      var box = document.createElement( "div" );
      box.style.position = "absolute";
      box.style.left = px( x + top.x );
      box.style.top = px( y + top.y );
      box.style.width = px( w );
      box.style.height = px( h );
      box.style.backgroundColor = this.fillStyle;
      target.appendChild( box );
    };

    this.fillText = function ( str, x, y ) {
      var top = translate[translate.length - 1];
      var box = document.createElement( "span" );
      box.style.position = "absolute";
      box.style.left = px( x + top.x );
      box.style.top = px( y + top.y );
      box.style.whiteSpace = "pre";
      setFont( box );
      box.style.color = this.fillStyle;
      box.appendChild( document.createTextNode( str ) );
      target.appendChild( box );
    };

    this.save = function () {
      var top = translate[translate.length - 1];
      translate.push( top.clone() );
    };

    this.restore = function () {
      translate.pop();
    };

    this.translate = function ( x, y ) {
      var top = translate[translate.length - 1];
      top.x += x;
      top.y += y;
    };
  }

  window.HTMLDivElement.prototype.getContext = function ( type ) {
    if ( type !== "2d" ) {
      throw new Exception( "type parameter needs to be '2d'." );
    }
    this.style.width = pct( 100 );
    this.style.height = pct( 100 );
    return new FakeContext( this );
  };

  return function ( domElementOrID, options ) {
    var self = this,
        div = cascadeElement( domElementOrID, "div",
            window.HTMLDivElement ),
        bgDiv = cascadeElement( div.id + "-back", "div",
            window.HTMLDivElement ),
        fgDiv = cascadeElement( div.id + "-front", "div",
            window.HTMLDivElement ),
        trimDiv = cascadeElement( div.id + "-trim", "div",
            window.HTMLDivElement ),
        gfx = div.getContext( "2d" ),
        fgfx = fgDiv.getContext( "2d" ),
        bgfx = bgDiv.getContext( "2d" ),
        tgfx = trimDiv.getContext( "2d" ),
        theme = null,
        oldWidth = null,
        oldHeight = null;

    this.VSCROLL_WIDTH = 2;

    this.character = new Size();
    this.id = div.id;
    this.autoBindEvents = true;

    this.pixel2cell = function ( point, scroll, gridBounds ) {
      point.set(
          Math.round( point.x / this.character.width ) + scroll.x -
          gridBounds.x,
          Math.floor( ( point.y / this.character.height ) - 0.25 ) +
          scroll.y );
    };

    this.resize = function () {
      var changed = false;
      if ( theme ) {
        var oldCharacterWidth = this.character.width,
            oldCharacterHeight = this.character.height,
            newWidth = div.clientWidth,
            newHeight = div.clientHeight,
            oldFont = gfx.font;
        this.character.height = theme.fontSize;
        gfx.font = px( this.character.height ) + " " + theme.fontFamily;

        // measure 100 letter M's, then divide by 100, to get the width of an M
        // to two decimal places on systems that return integer values from
        // measureText.
        this.character.width = gfx.measureText(
            "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM" ).width /
            100;
        changed = oldCharacterWidth !== this.character.width ||
            oldCharacterHeight !== this.character.height ||
            oldFont !== gfx.font;

        if ( newWidth > 0 && newHeight > 0 ) {
          bgDiv.width =
              fgDiv.width =
              trimDiv.width = newWidth;
          bgDiv.height =
              fgDiv.height =
              trimDiv.height = newHeight;

          changed = changed ||
              oldWidth !== newWidth ||
              oldHeight !== newWidth;

          oldWidth = newWidth;
          oldHeight = newHeight;
        }
      }
      return changed;
    };

    this.setSize = function ( w, h ) {
      div.style.width = px( w );
      div.style.height = px( h );
      return this.resize();
    };

    Object.defineProperties( {
      width: {
        get: function () {
          return oldWidth;
        }
      },
      height: {
        get: function () {
          return oldHeight;
        }
      },
      resized: {
        get: function () {
          var newWidth = div.clientWidth,
              newHeight = div.clientHeight;
          return oldWidth !== newWidth || oldHeight !== newHeight;
        }
      },
      theme: {
        set: function ( t ) {
          theme = t;
          this.resize();
        }
      },
      DOMElement: {
        get: function () {
          return div;
        }
      }
    } );

    function fillRect ( gfx, fill, x, y, w, h ) {
      gfx.fillStyle = fill;
      gfx.fillRect(
          x * self.character.width,
          y * self.character.height,
          w * self.character.width + 1,
          h * self.character.height + 1 );
    }

    function renderCanvasBackground ( tokenRows, frontCursor, backCursor,
        gridBounds, scroll, focused ) {
      var minCursor = Cursor.min( frontCursor, backCursor ),
          maxCursor = Cursor.max( frontCursor, backCursor ),
          tokenFront = new Cursor(),
          tokenBack = new Cursor();

      if ( theme.regular.backColor ) {
        bgfx.fillStyle = theme.regular.backColor;
        bgDiv.style.backgroundColor = theme.regular.backColor;
      }

      bgfx.clearRect( 0, 0, oldWidth, oldHeight );
      bgfx.save();
      bgfx.translate( ( gridBounds.x - scroll.x ) * self.character.width,
          -scroll.y * self.character.height );


      // draw the current row highlighter
      if ( focused ) {
        fillRect( bgfx, theme.regular.currentRowBackColor ||
            defaultTheme.regular.currentRowBackColor,
            0, minCursor.y + 0.2,
            gridBounds.width, maxCursor.y - minCursor.y + 1 );
      }

      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var row = tokenRows[y];

        for ( var i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if ( scroll.y <= y && y < scroll.y + gridBounds.height &&
              scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
              gridBounds.width ) {
            // draw the selection box
            var inSelection = minCursor.i <= tokenBack.i && tokenFront.i <
                maxCursor.i;
            if ( inSelection ) {
              var selectionFront = Cursor.max( minCursor, tokenFront );
              var selectionBack = Cursor.min( maxCursor, tokenBack );
              var cw = selectionBack.i - selectionFront.i;
              fillRect( bgfx, theme.regular.selectedBackColor ||
                  defaultTheme.regular.selectedBackColor,
                  selectionFront.x, selectionFront.y + 0.2,
                  cw, 1 );
            }
          }

          tokenFront.copy( tokenBack );
        }

        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );
      }

      // draw the cursor caret
      if ( focused ) {
        var cc = theme.cursorColor || "black";
        var w = 1 / self.character.width;
        fillRect( bgfx, cc, minCursor.x, minCursor.y, w, 1 );
        fillRect( bgfx, cc, maxCursor.x, maxCursor.y, w, 1 );
      }
      bgfx.restore();
    }

    function renderCanvasForeground ( tokenRows, gridBounds, scroll ) {
      var tokenFront = new Cursor(),
          tokenBack = new Cursor(),
          maxLineWidth = 0;

      fgfx.clearRect( 0, 0, oldWidth, oldHeight );
      fgfx.save();
      fgfx.translate( ( gridBounds.x - scroll.x ) * self.character.width,
          -scroll.y * self.character.height );
      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var row = tokenRows[y];
        for ( var i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if ( scroll.y <= y && y < scroll.y + gridBounds.height &&
              scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
              gridBounds.width ) {

            // draw the text
            var style = theme[t.type] || {};
            var font = ( style.fontWeight || theme.regular.fontWeight || "" ) +
                " " + ( style.fontStyle || theme.regular.fontStyle || "" ) +
                " " + self.character.height + "px " + theme.fontFamily;
            fgfx.font = font.trim();
            fgfx.fillStyle = style.foreColor || theme.regular.foreColor;
            fgfx.fillText(
                t.value,
                tokenFront.x * self.character.width,
                y * self.character.height );
          }

          tokenFront.copy( tokenBack );
        }

        maxLineWidth = Math.max( maxLineWidth, tokenBack.x );
        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );
      }
      fgfx.restore();
      return maxLineWidth;
    }

    function renderCanvasTrim ( tokenRows, gridBounds, scroll, showLineNumbers,
        showScrollBars, wordWrap, lineCountWidth, maxLineWidth ) {
      tgfx.clearRect( 0, 0, oldWidth, oldHeight );
      tgfx.save();
      tgfx.translate( 0, -scroll.y * self.character.height );
      if ( showLineNumbers ) {
        for ( var y = scroll.y,
            lastLine = -1; y < scroll.y + gridBounds.height && y <
            tokenRows.length; ++y ) {
          // draw the tokens on this row
          var row = tokenRows[y];
          // be able to draw brand-new rows that don't have any tokens yet
          var currentLine = row.length > 0 ? row[0].line : lastLine + 1;
          // draw the left gutter
          var lineNumber = currentLine.toString();
          while ( lineNumber.length < lineCountWidth ) {
            lineNumber = " " + lineNumber;
          }
          fillRect( tgfx,
              theme.regular.selectedBackColor ||
              defaultTheme.regular.selectedBackColor,
              0, y + 0.2,
              gridBounds.x, 1 );
          tgfx.font = "bold " + self.character.height + "px " +
              theme.fontFamily;

          if ( currentLine > lastLine ) {
            tgfx.fillStyle = theme.regular.foreColor;
            tgfx.fillText(
                lineNumber,
                0, y * self.character.height );
          }
          lastLine = currentLine;
        }
      }

      tgfx.restore();

      // draw the scrollbars
      if ( showScrollBars ) {
        var drawWidth = gridBounds.width * self.character.width;
        var drawHeight = gridBounds.height * self.character.height;
        var scrollX = ( scroll.x * drawWidth ) / maxLineWidth + gridBounds.x *
            self.character.width;
        var scrollY = ( scroll.y * drawHeight ) / tokenRows.length +
            gridBounds.y * self.character.height;

        tgfx.fillStyle = theme.regular.selectedBackColor ||
            defaultTheme.regular.selectedBackColor;
        // horizontal
        if ( !wordWrap && maxLineWidth > gridBounds.width ) {
          var scrollBarWidth = drawWidth * ( gridBounds.width / maxLineWidth );
          tgfx.fillRect(
              scrollX,
              ( gridBounds.height + 0.25 ) * self.character.height,
              Math.max( self.character.width, scrollBarWidth ),
              self.character.height );
        }

        //vertical
        if ( tokenRows.length > gridBounds.height ) {
          var scrollBarHeight = drawHeight * ( gridBounds.height /
              tokenRows.length );
          tgfx.fillRect(
              oldWidth - self.VSCROLL_WIDTH * self.character.width,
              scrollY,
              self.VSCROLL_WIDTH * self.character.width,
              Math.max( self.character.height, scrollBarHeight ) );
        }
      }
    }

    this.render = function ( tokenRows, lines,
        frontCursor, backCursor,
        gridBounds,
        scroll,
        focused, showLineNumbers, showScrollBars, wordWrap,
        lineCountWidth ) {
      var maxLineWidth = 0;

      renderCanvasBackground( tokenRows, frontCursor, backCursor, gridBounds,
          scroll, focused );
      maxLineWidth = renderCanvasForeground( tokenRows, gridBounds, scroll );
      renderCanvasTrim( tokenRows, gridBounds, scroll, showLineNumbers,
          showScrollBars, wordWrap, lineCountWidth, maxLineWidth );

      gfx.clearRect( 0, 0, oldWidth, oldHeight );
      gfx.drawImage( bgDiv, 0, 0 );
      gfx.drawImage( fgDiv, 0, 0 );
      gfx.drawImage( trimDiv, 0, 0 );
    };

    if ( !( domElementOrID instanceof window.HTMLDivElement ) &&
        options.width && options.height ) {
      div.style.position = "absolute";
      div.style.width = options.width;
      div.style.height = options.height;
    }

    if ( !div.parentElement ) {
      this.autoBindEvents = false;
      document.body.appendChild( makeHidingContainer(
          "primrose-container-" +
          div.id, div ) );
    }
  };
} );
