/*global THREE, qp, Primrose */
Primrose.Text.Renderers.Canvas = ( function ( ) {
  "use strict";

  return function ( canvasElementOrID, options ) {
    var self = this,
        canvas = cascadeElement( canvasElementOrID, "canvas",
            window.HTMLCanvasElement ),
        bgCanvas = cascadeElement( canvas.id + "-back", "canvas",
            window.HTMLCanvasElement ),
        fgCanvas = cascadeElement( canvas.id + "-front", "canvas",
            window.HTMLCanvasElement ),
        trimCanvas = cascadeElement( canvas.id + "-trim", "canvas",
            window.HTMLCanvasElement ),
        gfx = canvas.getContext( "2d" ),
        fgfx = fgCanvas.getContext( "2d" ),
        bgfx = bgCanvas.getContext( "2d" ),
        tgfx = trimCanvas.getContext( "2d" ),
        theme = null,
        texture = null,
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

    this.VSCROLL_WIDTH = 2;

    this.character = new Primrose.Text.Size();
    this.id = canvas.id;
    this.autoBindEvents = true;

    this.setTheme = function ( t ) {
      theme = t;
    };

    this.pixel2cell = function ( point, scroll, gridBounds ) {
      var x = point.x * canvas.width / canvas.clientWidth;
      var y = point.y * canvas.height / canvas.clientHeight;
      point.set(
          Math.round( x / this.character.width ) + scroll.x - gridBounds.x,
          Math.floor( ( y / this.character.height ) - 0.25 ) + scroll.y );
    };

    this.hasResized = function () {
      var oldWidth = canvas.width,
          oldHeight = canvas.height,
          newWidth = canvas.clientWidth,
          newHeight = canvas.clientHeight;
      return oldWidth !== newWidth || oldHeight !== newHeight;
    };

    this.resize = function () {
      if ( theme ) {
        var newWidth = ( strictSize && strictSize.width ) || canvas.clientWidth,
            newHeight = ( strictSize && strictSize.height ) || canvas.clientHeight;
        this.character.height = theme.fontSize;
        gfx.font = this.character.height + "px " + theme.fontFamily;
        // measure 100 letter M's, then divide by 100, to get the width of an M
        // to two decimal places on systems that return integer values from
        // measureText.
        this.character.width = gfx.measureText(
            "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM" ).width /
            100;

        if ( ( lastWidth !== newWidth || lastHeight !== newHeight ) && newWidth > 0 && newHeight > 0 ) {
          lastWidth =
              bgCanvas.width =
              fgCanvas.width =
              trimCanvas.width =
              canvas.width = newWidth;
          lastHeight =
              bgCanvas.height =
              fgCanvas.height =
              trimCanvas.height =
              canvas.height = newHeight;
        }
      }
    };

    this.setSize = function ( w, h ) {
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      return this.resize();
    };

    this.getWidth = function () {
      return canvas.width;
    };

    this.getHeight = function () {
      return canvas.height;
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

    function renderCanvasBackground ( tokenRows, gridBounds, scroll, frontCursor, backCursor, focused ) {
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
      bgfx.translate( ( gridBounds.x - scroll.x ) * self.character.width,
          -scroll.y * self.character.height );


      // draw the current row highlighter
      if ( focused ) {
        fillRect( bgfx, theme.regular.currentRowBackColor ||
            Primrose.Text.Themes.Default.regular.currentRowBackColor,
            0, minCursor.y,
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

    function renderCanvasForeground ( tokenRows, gridBounds, scroll, lines ) {
      var tokenFront = new Primrose.Text.Cursor(),
          tokenBack = new Primrose.Text.Cursor(),
          lineOffsetY = Math.ceil( self.character.height * 0.2 ),
          i;

      fgfx.clearRect( 0, 0, canvas.width, canvas.height );
      fgfx.save();
      fgfx.translate( ( gridBounds.x - scroll.x ) * self.character.width, 0 );
      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var line = lines[y],
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
                fgfx.putImageData( rowCache[line], 0, imageY );
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
              0,
              imageY,
              fgCanvas.width,
              self.character.height );
        }
      }
      fgfx.restore();
    }

    function renderCanvasTrim ( tokenRows, gridBounds, scroll, showLineNumbers,
        showScrollBars, wordWrap, lineCountWidth, focused ) {

      var tokenFront = new Primrose.Text.Cursor(),
          tokenBack = new Primrose.Text.Cursor(),
          maxLineWidth = 0,
          i;

      tgfx.clearRect( 0, 0, canvas.width, canvas.height );
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
        var drawWidth = gridBounds.width * self.character.width,
            drawHeight = gridBounds.height * self.character.height,
            scrollX = ( scroll.x * drawWidth ) / maxLineWidth + gridBounds.x *
            self.character.width,
            scrollY = ( scroll.y * drawHeight ) / tokenRows.length +
            gridBounds.y * self.character.height;

        tgfx.fillStyle = theme.regular.selectedBackColor ||
            Primrose.Text.Themes.Default.regular.selectedBackColor;
        // horizontal
        var bw;
        if ( !wordWrap && maxLineWidth > gridBounds.width ) {
          var scrollBarWidth = drawWidth * ( gridBounds.width / maxLineWidth ),
              by = ( gridBounds.height + 0.25 ) * self.character.height;
          bw = Math.max( self.character.width, scrollBarWidth );
          tgfx.fillRect( scrollX, by, bw, self.character.height );
          tgfx.strokeRect( scrollX, by, bw, self.character.height );
        }

        //vertical
        if ( tokenRows.length > gridBounds.height ) {
          var scrollBarHeight = drawHeight * ( gridBounds.height /
              tokenRows.length ),
              bx = canvas.width - self.VSCROLL_WIDTH * self.character.width,
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
      tgfx.strokeRect( 0, 0, canvas.width, canvas.height );

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
        }

        var foregroundChanged = layoutChanged || fontChanged || scrollChanged,
            backgroundChanged = foregroundChanged || focusChanged || cursorChanged;

        if ( foregroundChanged || backgroundChanged ) {
          renderCanvasBackground( tokenRows, gridBounds, scroll, frontCursor, backCursor, focused );

          if ( foregroundChanged || focusChanged ) {
            if ( foregroundChanged ) {
              renderCanvasForeground( tokenRows, gridBounds, scroll, lines );
            }
            renderCanvasTrim( tokenRows, gridBounds, scroll, showLineNumbers, showScrollBars, wordWrap, lineCountWidth, focused );
          }

          gfx.clearRect( 0, 0, canvas.width, canvas.height );
          gfx.drawImage( bgCanvas, 0, 0 );
          gfx.drawImage( fgCanvas, 0, 0 );
          gfx.drawImage( trimCanvas, 0, 0 );

          if ( texture ) {
            texture.needsUpdate = true;
          }
        }
      }
    };

    this.getDOMElement = function () {
      return canvas;
    };

    this.getTexture = function (  ) {
      if ( typeof window.THREE !== "undefined" && !texture ) {
        texture = new THREE.Texture( canvas );
        texture.needsUpdate = true;
      }
      return texture;
    };

    if ( !( canvasElementOrID instanceof window.HTMLCanvasElement ) &&
        strictSize ) {
      canvas.style.position = "absolute";
      canvas.style.width = strictSize.width;
      canvas.style.height = strictSize.height;
    }

    if ( !canvas.parentElement ) {
      this.autoBindEvents = false;
      document.body.appendChild( makeHidingContainer(
          "primrose-container-" +
          canvas.id, canvas ) );
    }
  };
} )();
