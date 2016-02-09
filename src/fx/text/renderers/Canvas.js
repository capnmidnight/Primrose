/*global THREE, qp, Primrose,  devicePixelRatio, HTMLCanvasElement, pliny */

Primrose.Text.Renderers.Canvas = ( function ( ) {
  "use strict";

  function Canvas ( canvasElementOrID, options ) {
    var self = this,
        canvas = Primrose.DOM.cascadeElement( canvasElementOrID, "canvas", HTMLCanvasElement ),
        bgCanvas = Primrose.DOM.cascadeElement( canvas.id + "-back", "canvas", HTMLCanvasElement ),
        fgCanvas = Primrose.DOM.cascadeElement( canvas.id + "-front", "canvas", HTMLCanvasElement ),
        trimCanvas = Primrose.DOM.cascadeElement( canvas.id + "-trim", "canvas", HTMLCanvasElement ),
        gfx = canvas.getContext( "2d" ),
        fgfx = fgCanvas.getContext( "2d" ),
        bgfx = bgCanvas.getContext( "2d" ),
        tgfx = trimCanvas.getContext( "2d" ),
        theme = null,
        txt = null,
        strictSize = options.size,
        rowCache = {},
        lastFocused = false,
        lastFrontCursorI = -1,
        lastBackCursorI = -1,
        lastWidth = -1,
        lastHeight = -1,
        lastScrollX = -1,
        lastScrollY = -1,
        lastFont = null;

    canvas.style.imageRendering =
        bgCanvas.style.imageRendering =
        fgCanvas.style.imageRendering =
        trimCanvas.style.imageRendering = isChrome ? "pixelated" : "optimizespeed";

    gfx.imageSmoothingEnabled =
        tgfx.imageSmoothingEnabled =
        bgfx.imageSmoothingEnabled =
        tgfx.imageSmoothingEnabled = false;

    this.VSCROLL_WIDTH = 2;

    this.character = new Primrose.Text.Size();
    this.id = canvas.id;
    this.autoBindEvents = true;

    this.pixel2cell = function ( point, scroll, gridBounds ) {
      var x = point.x * canvas.width / canvas.clientWidth;
      var y = point.y * canvas.height / canvas.clientHeight;
      point.set(
          Math.round( x / this.character.width ) + scroll.x - gridBounds.x,
          Math.floor( ( y / this.character.height ) - 0.25 ) + scroll.y );
    };

    this.resize = function () {
      if ( theme ) {
        this.character.height = theme.fontSize;
        gfx.font = this.character.height + "px " + theme.fontFamily;
        // measure 100 letter M's, then divide by 100, to get the width of an M
        // to two decimal places on systems that return integer values from
        // measureText.
        this.character.width = gfx.measureText(
            "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM" ).width /
            100;

        if ( ( lastWidth !== this.elementWidth || lastHeight !== this.elementHeight ) && this.elementWidth > 0 && this.elementHeight > 0 ) {
          lastWidth =
              bgCanvas.width =
              fgCanvas.width =
              trimCanvas.width =
              canvas.width = this.elementWidth;
          lastHeight =
              bgCanvas.height =
              fgCanvas.height =
              trimCanvas.height =
              canvas.height = this.elementHeight;
        }
      }
    };

    this.setSize = function ( w, h ) {
      canvas.style.width = Math.round(w) + "px";
      canvas.style.height = Math.round(h) + "px";
      return this.resize();
    };

    Object.defineProperties( this, {
      elementWidth: {
        get: function () {
          return ( strictSize && strictSize.width ) || ( canvas.clientWidth * devicePixelRatio );
        }
      },
      elementHeight: {
        get: function () {
          return ( strictSize && strictSize.height ) || ( canvas.clientHeight * devicePixelRatio );
        }
      },
      width: {
        get: function () {
          return canvas.width;
        }
      },
      height: {
        get: function () {
          return canvas.height;
        }
      },
      resized: {
        get: function () {
          return this.width !== this.elementWidth || this.height !== this.elementHeight;
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
          return canvas;
        }
      },
      texture: {
        get: function (  ) {
          if ( typeof window.THREE !== "undefined" && !txt ) {
            txt = new THREE.Texture( canvas );
            txt.needsUpdate = true;
          }
          return txt;
        }
      }
    } );

    this.mapUV = function ( point ) {
      if ( point ) {
        return {
          x: Math.floor( canvas.width * point[0] ),
          y: Math.floor( canvas.height * ( 1 - point[1] ) )
        };
      }
    };

    function fillRect ( gfx, fill, x, y, w, h ) {
      gfx.fillStyle = fill;
      gfx.fillRect(
          x * self.character.width,
          y * self.character.height,
          w * self.character.width + 1,
          h * self.character.height + 1 );
    }

    function strokeRect ( gfx, stroke, x, y, w, h ) {
      gfx.strokeStyle = stroke;
      gfx.strokeRect(
          x * self.character.width,
          y * self.character.height,
          w * self.character.width + 1,
          h * self.character.height + 1 );
    }

    function renderCanvasBackground ( tokenRows, gridBounds, padding, scroll, frontCursor, backCursor, focused ) {
      var minCursor = Primrose.Text.Cursor.min( frontCursor, backCursor ),
          maxCursor = Primrose.Text.Cursor.max( frontCursor, backCursor ),
          tokenFront = new Primrose.Text.Cursor(),
          tokenBack = new Primrose.Text.Cursor(),
          clearFunc = theme.regular.backColor ? "fillRect" : "clearRect";

      if ( theme.regular.backColor ) {
        bgfx.fillStyle = theme.regular.backColor;
      }

      bgfx[clearFunc]( 0, 0, canvas.width, canvas.height );
      bgfx.save();
      bgfx.translate(
          ( gridBounds.x - scroll.x ) * self.character.width + padding,
          -scroll.y * self.character.height + padding );


      // draw the current row highlighter
      if ( focused ) {
        fillRect( bgfx, theme.regular.currentRowBackColor ||
            Primrose.Text.Themes.Default.regular.currentRowBackColor,
            0, minCursor.y,
            gridBounds.width,
            maxCursor.y - minCursor.y + 1 );
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
              var selectionFront = Primrose.Text.Cursor.max( minCursor,
                  tokenFront );
              var selectionBack = Primrose.Text.Cursor.min( maxCursor, tokenBack );
              var cw = selectionBack.i - selectionFront.i;
              fillRect( bgfx, theme.regular.selectedBackColor ||
                  Primrose.Text.Themes.Default.regular.selectedBackColor,
                  selectionFront.x, selectionFront.y,
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

    function renderCanvasForeground ( tokenRows, gridBounds, padding, scroll, lines ) {
      var tokenFront = new Primrose.Text.Cursor(),
          tokenBack = new Primrose.Text.Cursor(),
          lineOffsetY = Math.ceil( self.character.height * 0.2 ),
          i;

      fgfx.clearRect( 0, 0, canvas.width, canvas.height );
      fgfx.save();
      fgfx.translate(
          ( gridBounds.x - scroll.x ) * self.character.width + padding,
          padding );
      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var line = lines[y] + padding,
            row = tokenRows[y],
            drawn = false,
            textY = ( y + 0.8 - scroll.y ) * self.character.height,
            imageY = ( y - scroll.y - 0.2 ) * self.character.height + lineOffsetY;

        for ( i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if ( scroll.y <= y && y < scroll.y + gridBounds.height &&
              scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
              gridBounds.width ) {

            // draw the text
            if ( rowCache[line] !== undefined ) {
              if ( i === 0 ) {
                fgfx.putImageData( rowCache[line], padding, imageY + padding );
              }
            }
            else {
              var style = theme[t.type] || {};
              var font = ( style.fontWeight || theme.regular.fontWeight || "" ) +
                  " " + ( style.fontStyle || theme.regular.fontStyle || "" ) +
                  " " + self.character.height + "px " + theme.fontFamily;
              fgfx.font = font.trim();
              fgfx.fillStyle = style.foreColor || theme.regular.foreColor;
              fgfx.fillText(
                  t.value,
                  tokenFront.x * self.character.width,
                  textY );
              drawn = true;
            }
          }

          tokenFront.copy( tokenBack );
        }

        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );
        if ( drawn && rowCache[line] === undefined ) {
          rowCache[line] = fgfx.getImageData(
              padding,
              imageY + padding,
              fgCanvas.width - 2 * padding,
              self.character.height );
        }
      }
      fgfx.restore();
    }

    function renderCanvasTrim ( tokenRows, gridBounds, padding, scroll, showLineNumbers, showScrollBars, wordWrap, lineCountWidth, focused ) {

      var tokenFront = new Primrose.Text.Cursor(),
          tokenBack = new Primrose.Text.Cursor(),
          maxLineWidth = 0,
          i;

      tgfx.clearRect( 0, 0, canvas.width, canvas.height );
      tgfx.save();
      tgfx.translate( padding, padding );
      tgfx.save();
      tgfx.lineWidth = 2;
      tgfx.translate( 0, -scroll.y * self.character.height );
      for ( var y = 0, lastLine = -1; y < tokenRows.length; ++y ) {
        var row = tokenRows[y];

        for ( i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;
          tokenFront.copy( tokenBack );
        }

        maxLineWidth = Math.max( maxLineWidth, tokenBack.x );
        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );

        if ( showLineNumbers && scroll.y <= y && y < scroll.y + gridBounds.height ) {
          // draw the tokens on this row
          // be able to draw brand-new rows that don't have any tokens yet
          var currentLine = row.length > 0 ? row[0].line : lastLine + 1;
          // draw the left gutter
          var lineNumber = currentLine.toString();
          while ( lineNumber.length < lineCountWidth ) {
            lineNumber = " " + lineNumber;
          }
          fillRect( tgfx,
              theme.regular.selectedBackColor ||
              Primrose.Text.Themes.Default.regular.selectedBackColor,
              0, y,
              gridBounds.x, 1 );
          tgfx.font = "bold " + self.character.height + "px " +
              theme.fontFamily;

          if ( currentLine > lastLine ) {
            tgfx.fillStyle = theme.regular.foreColor;
            tgfx.fillText(
                lineNumber,
                0, ( y + 0.8 ) * self.character.height );
          }
          lastLine = currentLine;
        }
      }

      tgfx.restore();

      if ( showLineNumbers ) {
        strokeRect( tgfx,
            theme.regular.foreColor ||
            Primrose.Text.Themes.Default.regular.foreColor,
            0, 0,
            gridBounds.x, gridBounds.height );
      }

      // draw the scrollbars
      if ( showScrollBars ) {
        var drawWidth = gridBounds.width * self.character.width - padding,
            drawHeight = gridBounds.height * self.character.height,
            scrollX = ( scroll.x * drawWidth ) / maxLineWidth + gridBounds.x * self.character.width,
            scrollY = ( scroll.y * drawHeight ) / tokenRows.length;

        tgfx.fillStyle = theme.regular.selectedBackColor ||
            Primrose.Text.Themes.Default.regular.selectedBackColor;
        // horizontal
        var bw;
        if ( !wordWrap && maxLineWidth > gridBounds.width ) {
          var scrollBarWidth = drawWidth * ( gridBounds.width / maxLineWidth ),
              by = gridBounds.height * self.character.height;
          bw = Math.max( self.character.width, scrollBarWidth );
          tgfx.fillRect( scrollX, by, bw, self.character.height );
          tgfx.strokeRect( scrollX, by, bw, self.character.height );
        }

        //vertical
        if ( tokenRows.length > gridBounds.height ) {
          var scrollBarHeight = drawHeight * ( gridBounds.height / tokenRows.length ),
              bx = canvas.width - self.VSCROLL_WIDTH * self.character.width - 2 * padding,
              bh = Math.max( self.character.height, scrollBarHeight );
          bw = self.VSCROLL_WIDTH * self.character.width;
          tgfx.fillRect( bx, scrollY, bw, bh );
          tgfx.strokeRect( bx, scrollY, bw, bh );
        }
      }

      strokeRect( tgfx,
          theme.regular.foreColor ||
          Primrose.Text.Themes.Default.regular.foreColor,
          gridBounds.x,
          0,
          gridBounds.width,
          gridBounds.height );
      tgfx.strokeRect( 0, 0, canvas.width - 2 * padding, canvas.height - 2 * padding );
      tgfx.restore();
      if ( !focused ) {
        tgfx.fillStyle = theme.regular.unfocused || Primrose.Text.Themes.Default.regular.unfocused;
        tgfx.fillRect( 0, 0, canvas.width, canvas.height );
      }
    }

    this.render = function ( tokenRows, lines,
        frontCursor, backCursor,
        gridBounds,
        scroll,
        focused, showLineNumbers, showScrollBars, wordWrap,
        lineCountWidth,
        padding,
        layoutChanged ) {
      if ( theme ) {
        var cursorChanged = frontCursor.i !== lastFrontCursorI || lastBackCursorI !== backCursor.i,
            scrollChanged = scroll.x !== lastScrollX || scroll.y !== lastScrollY,
            fontChanged = gfx.font !== lastFont,
            focusChanged = focused !== lastFocused;

        lastFrontCursorI = frontCursor.i;
        lastBackCursorI = backCursor.i;
        lastFocused = focused;
        lastFont = gfx.font;
        lastScrollX = scroll.x;
        lastScrollY = scroll.y;

        if ( layoutChanged ) {
          rowCache = {};
          if ( this.resized ) {
            this.resize();
          }
        }

        var foregroundChanged = layoutChanged || fontChanged || scrollChanged,
            backgroundChanged = foregroundChanged || focusChanged || cursorChanged;

        if ( foregroundChanged || backgroundChanged ) {
          renderCanvasBackground( tokenRows, gridBounds, padding, scroll, frontCursor, backCursor, focused );

          if ( foregroundChanged || focusChanged ) {
            if ( foregroundChanged ) {
              renderCanvasForeground( tokenRows, gridBounds, padding, scroll, lines );
            }
            renderCanvasTrim( tokenRows, gridBounds, padding, scroll, showLineNumbers, showScrollBars, wordWrap, lineCountWidth, focused );
          }

          gfx.clearRect( 0, 0, canvas.width, canvas.height );
          gfx.drawImage( bgCanvas, 0, 0 );
          gfx.drawImage( fgCanvas, 0, 0 );
          gfx.drawImage( trimCanvas, 0, 0 );

          if ( txt ) {
            txt.needsUpdate = true;
          }
        }
      }
    };

    if ( !( canvasElementOrID instanceof window.HTMLCanvasElement ) && strictSize ) {
      canvas.style.position = "absolute";
      canvas.style.width = strictSize.width;
      canvas.style.height = strictSize.height;
    }

    if ( !canvas.parentElement ) {
      this.autoBindEvents = false;
      document.body.appendChild( Primrose.DOM.makeHidingContainer(
          "primrose-container-" +
          canvas.id, canvas ) );
    }
  }

  return Canvas;
} )();

pliny.issue( "Primrose.Text.Renderers.Canvas", {
  name: "document Canvas",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Renderers.Canvas](#Primrose_Text_Renderers_Canvas) class in the renderers/ directory"
} );
