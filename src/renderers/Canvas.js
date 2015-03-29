/*
 * Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Renderers.Canvas = (function () {
    "use strict";
    function CanvasRenderer(canvasElementOrID, options) {
        var self = this,
                canvas = cascadeElement(canvasElementOrID, "canvas", HTMLCanvasElement),
                bgCanvas = cascadeElement(canvas.id + "-back", "canvas", HTMLCanvasElement),
                fgCanvas = cascadeElement(canvas.id + "-front", "canvas", HTMLCanvasElement),
                trimCanvas = cascadeElement(canvas.id + "-trim", "canvas", HTMLCanvasElement),
                gfx = canvas.getContext("2d"),
                fgfx = fgCanvas.getContext("2d"),
                bgfx = bgCanvas.getContext("2d"),
                tgfx = trimCanvas.getContext("2d"),
                theme = null,
                texture = null, pickingTexture = null, pickingPixelBuffer = null;
        
        this.VSCROLL_WIDTH = 2;

        this.character = new Size();
        this.id = canvas.id;

        this.setTheme = function (t) {
            theme = t;
        };

        this.pixel2cell = function (point, scroll, gridBounds) {
            var r = this.getPixelRatio();
            point.set(
                    Math.round(point.x * r / this.character.width) + scroll.x - gridBounds.x,
                    Math.floor((point.y * r / this.character.height) - 0.25) + scroll.y);
        };

        this.resize = function () {
            var r = this.getPixelRatio(),
                    oldCharacterWidth = this.character.width,
                    oldCharacterHeight = this.character.height,
                    oldWidth = canvas.width,
                    oldHeight = canvas.height,
                    oldFont = gfx.font;

            this.character.height = theme.fontSize * r;
            bgCanvas.width =
                    fgCanvas.width =
                    trimCanvas.width =
                    canvas.width = canvas.clientWidth * r;
            bgCanvas.height =
                    fgCanvas.height =
                    trimCanvas.height =
                    canvas.height =
                    canvas.clientHeight * r;
            gfx.font = this.character.height + "px " + theme.fontFamily;
            // measure 100 letter M's, then divide by 100, to get the width of an M
            // to two decimal places on systems that return integer values from
            // measureText.
            this.character.width = gfx.measureText("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM").width / 100;
            var changed = oldCharacterWidth !== this.character.width ||
                    oldCharacterHeight !== this.character.height ||
                    oldWidth !== canvas.width ||
                    oldHeight !== canvas.height ||
                    oldFont !== gfx.font;
            return changed;
        };

        this.setSize = function (w, h) {
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

        function fillRect(gfx, fill, x, y, w, h) {
            gfx.fillStyle = fill;
            gfx.fillRect(
                    x * self.character.width,
                    y * self.character.height,
                    w * self.character.width + 1,
                    h * self.character.height + 1);
        }

        function renderCanvasBackground(tokenRows, frontCursor, backCursor, gridBounds, scroll, focused) {
            var minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor),
                    tokenFront = new Cursor(),
                    tokenBack = new Cursor(),
                    clearFunc = theme.regular.backColor ? "fillRect" : "clearRect";

            if (theme.regular.backColor) {
                bgfx.fillStyle = theme.regular.backColor;
            }

            bgfx[clearFunc](0, 0, canvas.width, canvas.height);
            bgfx.save();
            bgfx.translate((gridBounds.x - scroll.x) * self.character.width, -scroll.y * self.character.height);


            // draw the current row highlighter
            if (focused) {
                fillRect(bgfx, theme.regular.currentRowBackColor || Themes.DEFAULT.regular.currentRowBackColor,
                        0, minCursor.y + 0.2,
                        gridBounds.width, maxCursor.y - minCursor.y + 1);
            }

            for (var y = 0; y < tokenRows.length; ++y) {
                // draw the tokens on this row
                var row = tokenRows[y];

                for (var i = 0; i < row.length; ++i) {
                    var t = row[i];
                    tokenBack.x += t.value.length;
                    tokenBack.i += t.value.length;

                    // skip drawing tokens that aren't in view
                    if (scroll.y <= y && y < scroll.y + gridBounds.height &&
                            scroll.x <= tokenBack.x && tokenFront.x < scroll.x + gridBounds.width) {
                        // draw the selection box
                        var inSelection = minCursor.i <= tokenBack.i && tokenFront.i < maxCursor.i;
                        if (inSelection) {
                            var selectionFront = Cursor.max(minCursor, tokenFront);
                            var selectionBack = Cursor.min(maxCursor, tokenBack);
                            var cw = selectionBack.i - selectionFront.i;
                            fillRect(bgfx, theme.regular.selectedBackColor || Themes.DEFAULT.regular.selectedBackColor,
                                    selectionFront.x, selectionFront.y + 0.2,
                                    cw, 1);
                        }
                    }

                    tokenFront.copy(tokenBack);
                }

                tokenFront.x = 0;
                ++tokenFront.y;
                tokenBack.copy(tokenFront);
            }

            // draw the cursor caret
            if (focused) {
                bgfx.beginPath();
                bgfx.strokeStyle = theme.cursorColor || "black";
                bgfx.moveTo(
                        minCursor.x * self.character.width,
                        minCursor.y * self.character.height);
                bgfx.lineTo(
                        minCursor.x * self.character.width,
                        (minCursor.y + 1.25) * self.character.height);
                bgfx.moveTo(
                        maxCursor.x * self.character.width + 1,
                        maxCursor.y * self.character.height);
                bgfx.lineTo(
                        maxCursor.x * self.character.width + 1,
                        (maxCursor.y + 1.25) * self.character.height);
                bgfx.stroke();
            }
            bgfx.restore();
        }

        function renderCanvasForeground(tokenRows, gridBounds, scroll) {
            var tokenFront = new Cursor(),
                    tokenBack = new Cursor(),
                    maxLineWidth = 0;

            fgfx.clearRect(0, 0, canvas.width, canvas.height);
            fgfx.save();
            fgfx.translate((gridBounds.x - scroll.x) * self.character.width, -scroll.y * self.character.height);
            for (var y = 0; y < tokenRows.length; ++y) {
                // draw the tokens on this row
                var row = tokenRows[y];
                for (var i = 0; i < row.length; ++i) {
                    var t = row[i];
                    tokenBack.x += t.value.length;
                    tokenBack.i += t.value.length;

                    // skip drawing tokens that aren't in view
                    if (scroll.y <= y && y < scroll.y + gridBounds.height &&
                            scroll.x <= tokenBack.x && tokenFront.x < scroll.x + gridBounds.width) {

                        // draw the text
                        var style = theme[t.type] || {};
                        var font = (style.fontWeight || theme.regular.fontWeight || "") +
                                " " + (style.fontStyle || theme.regular.fontStyle || "") +
                                " " + self.character.height + "px " + theme.fontFamily;
                        fgfx.font = font.trim();
                        fgfx.fillStyle = style.foreColor || theme.regular.foreColor;
                        fgfx.fillText(
                                t.value,
                                tokenFront.x * self.character.width,
                                (y + 1) * self.character.height);
                    }

                    tokenFront.copy(tokenBack);
                }

                maxLineWidth = Math.max(maxLineWidth, tokenBack.x);
                tokenFront.x = 0;
                ++tokenFront.y;
                tokenBack.copy(tokenFront);
            }
            fgfx.restore();
            return maxLineWidth;
        }

        function renderCanvasTrim(tokenRows, gridBounds, scroll, showLineNumbers, showScrollBars, wordWrap, lineCountWidth, maxLineWidth) {
            tgfx.clearRect(0, 0, canvas.width, canvas.height);
            tgfx.save();
            tgfx.translate(0, -scroll.y * self.character.height);
            if (showLineNumbers) {
                for (var y = scroll.y, lastLine = -1; y < scroll.y + gridBounds.height && y < tokenRows.length; ++y) {
                    // draw the tokens on this row
                    var row = tokenRows[y];
                    // be able to draw brand-new rows that don't have any tokens yet
                    var currentLine = row.length > 0 ? row[0].line : lastLine + 1;
                    // draw the left gutter
                    var lineNumber = currentLine.toString();
                    while (lineNumber.length < lineCountWidth) {
                        lineNumber = " " + lineNumber;
                    }
                    fillRect(tgfx,
                            theme.regular.selectedBackColor || Themes.DEFAULT.regular.selectedBackColor,
                            0, y + 0.2,
                            gridBounds.x, 1);
                    tgfx.font = "bold " + self.character.height + "px " + theme.fontFamily;

                    if (currentLine > lastLine) {
                        tgfx.fillStyle = theme.regular.foreColor;
                        tgfx.fillText(
                                lineNumber,
                                0, (y + 1) * self.character.height);
                    }
                    lastLine = currentLine;
                }
            }

            tgfx.restore();

            // draw the scrollbars
            if (showScrollBars) {
                var drawWidth = gridBounds.width * self.character.width;
                var drawHeight = gridBounds.height * self.character.height;
                var scrollX = (scroll.x * drawWidth) / maxLineWidth + gridBounds.x * self.character.width;
                var scrollY = (scroll.y * drawHeight) / tokenRows.length + gridBounds.y * self.character.height;

                tgfx.fillStyle = theme.regular.selectedBackColor || Themes.DEFAULT.regular.selectedBackColor;
                // horizontal
                if(!wordWrap && maxLineWidth > gridBounds.width){
                    var scrollBarWidth = drawWidth * (gridBounds.width / maxLineWidth);
                    tgfx.fillRect(
                        scrollX,
                        (gridBounds.height + 0.25) * self.character.height,
                        Math.max(self.character.width, scrollBarWidth),
                        self.character.height);
                }

                //vertical
                if(tokenRows.length > gridBounds.height){
                    var scrollBarHeight = drawHeight * (gridBounds.height / tokenRows.length);
                    tgfx.fillRect(
                            canvas.width - self.VSCROLL_WIDTH * self.character.width,
                            scrollY,
                            self.VSCROLL_WIDTH * self.character.width,
                            Math.max(self.character.height, scrollBarHeight));
                }
            }
        }

        this.render = function (tokenRows,
                frontCursor, backCursor,
                gridBounds,
                scroll,
                focused, showLineNumbers, showScrollBars, wordWrap,
                lineCountWidth) {
            var maxLineWidth = 0;

            renderCanvasBackground(tokenRows, frontCursor, backCursor, gridBounds, scroll, focused);
            maxLineWidth = renderCanvasForeground(tokenRows, gridBounds, scroll);
            renderCanvasTrim(tokenRows, gridBounds, scroll, showLineNumbers, showScrollBars, wordWrap, lineCountWidth, maxLineWidth);

            gfx.clearRect(0, 0, canvas.width, canvas.height);
            gfx.drawImage(bgCanvas, 0, 0);
            gfx.drawImage(fgCanvas, 0, 0);
            gfx.drawImage(trimCanvas, 0, 0);

            if (texture) {
                texture.needsUpdate = true;
            }
        };



        this.getCanvas = function () {
            return canvas;
        };

        this.getTexture = function (anisotropy) {
            if (window.THREE && !texture) {
                texture = new THREE.Texture(canvas);
                texture.anisotropy = anisotropy || 8;
                texture.needsUpdate = true;
            }
            return texture;
        };

        this.getPickingTexture = function () {
            if (!pickingTexture) {
                var c = document.createElement("canvas"),
                        w = this.getWidth(),
                        h = this.getHeight();
                c.width = w;
                c.height = h;

                var gfx = c.getContext("2d"),
                        pixels = gfx.createImageData(w, h);

                for (var i = 0, p = 0, l = w * h; i < l; ++i, p += 4) {
                    pixels.data[p] = (0xff0000 & i) >> 16;
                    pixels.data[p + 1] = (0x00ff00 & i) >> 8;
                    pixels.data[p + 2] = (0x0000ff & i) >> 0;
                    pixels.data[p + 3] = 0xff;
                }
                gfx.putImageData(pixels, 0, 0);
                pickingTexture = new THREE.Texture(c, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestMipMapNearestFilter, THREE.RGBAFormat, THREE.UnsignedByteType, 0);
                pickingTexture.needsUpdate = true;
            }
            return pickingTexture;
        };

        this.getPixelRatio = function () {
            return window.devicePixelRatio || 1;
        };

        this.getPixelIndex = function (gl, x, y) {
            if (!pickingPixelBuffer) {
                pickingPixelBuffer = new Uint8Array(4);
            }

            gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pickingPixelBuffer);

            var i = (pickingPixelBuffer[0] << 16) |
                    (pickingPixelBuffer[1] << 8) |
                    (pickingPixelBuffer[2] << 0);
            return {x: i % canvas.width, y: i / canvas.width};
        };


        if (!(canvasElementOrID instanceof HTMLCanvasElement) && options.width && options.height) {
            canvas.style.position = "absolute";
            canvas.style.width = options.width;
            canvas.style.height = options.height;
        }

        if (!canvas.parentElement) {
            document.body.appendChild(makeHidingContainer("primrose-container-" + canvas.id, canvas));
        }
    }

    return CanvasRenderer;
})();