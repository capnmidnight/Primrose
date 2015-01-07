function load() {
    var history = [drawText.toString().split("\n")];
    var output = document.getElementById("output");
    var graphics = output.getContext("2d");
    var CHAR_HEIGHT = 20;
    var pixelRatio = window.devicePixelRatio || 1;
    CHAR_HEIGHT *= pixelRatio;
    output.style.width = output.width + "px";
    output.style.height = output.height + "px";
    output.width = output.width * pixelRatio;
    output.height = output.height * pixelRatio;
    var start = new Cursor();
    var finish = new Cursor();
    var cursor = {start: start, finish: finish, both: new CombinedCursor(start, finish)};
    var DEFAULT_FONT = "monospace";
    var DEFAULT_COLOR = "black";
    var DEFAULT_STYLE = new Rule("default", null, {color: DEFAULT_COLOR});
    var PAGE_SIZE = 5;
    graphics.font = CHAR_HEIGHT + "px " + DEFAULT_FONT;
    var CHAR_WIDTH = graphics.measureText("M").width;
    var codePage = CodePages.EN_US;
    var dragging = false;
    var TAB_SIZE = 4;
    var TAB = "";
    for (var i = 0; i < TAB_SIZE; ++i) {
        TAB += " ";
    }


    function editText(evt) {
        evt = evt || event;
        var key = evt.keyCode;
        // don't do anything about the actual press of SHIFT, CTRL, or ALT
        if (key !== Keys.SHIFT && key !== Keys.CTRL && key !== Keys.ALT) {
            var type = ((evt.ctrlKey && "CTRL" || "")
                    + (evt.altKey && "ALT" || "")
                    + (evt.shiftKey && "SHIFT" || "")) || "NORMAL";
            var lines = history[history.length - 1];
            var cur = evt.shiftKey ? cursor.finish : cursor.both;
            if (key === Keys.LEFTARROW) {
                if (evt.ctrlKey) {
                    cur.skipLeft(lines);
                }
                else {
                    cur.left(lines);
                }
                evt.preventDefault();
            }
            else if (key === Keys.RIGHTARROW) {
                if (evt.ctrlKey) {
                    cur.skipRight(lines);
                }
                else {
                    cur.right(lines);
                }
                evt.preventDefault();
            }
            else if (key === Keys.UPARROW) {
                cur.up(lines);
                evt.preventDefault();
            }
            else if (key === Keys.DOWNARROW) {
                cur.down(lines);
                evt.preventDefault();
            }
            else if (key === Keys.PAGEUP) {
                cur.incY(-PAGE_SIZE, lines);
                evt.preventDefault();
            }
            else if (key === Keys.PAGEDOWN) {
                cur.incY(PAGE_SIZE, lines);
                evt.preventDefault();
            }
            else if (key === Keys.HOME) {
                if (evt.ctrlKey) {
                    cur.fullHome(lines);
                }
                else {
                    cur.home(lines);
                }
                evt.preventDefault();
            }
            else if (key === Keys.END) {
                if (evt.ctrlKey) {
                    cur.fullEnd(lines);
                }
                else {
                    cur.end(lines);
                }
                evt.preventDefault();
            }
            else if (key === Keys.BACKSPACE) {
                if (cursor.start.i === cursor.finish.i) {
                    cursor.start.left(lines);
                }
                deleteSelection();
                evt.preventDefault();
            }
            else if (key === Keys.DELETE) {
                if (cursor.start.i === cursor.finish.i) {
                    cursor.finish.right(lines);
                }
                deleteSelection();
            }
            else if (key === Keys.ENTER) {
                deleteSelection();
                var indent = "";
                for (var i = 0; i < lines[cursor.start.y].length && lines[cursor.start.y][i] === " "; ++i) {
                    indent += " ";
                }
                lines = lines.slice();
                history.push(lines);
                lines.splice(cursor.start.y + 1, 0, indent + lines[cursor.start.y].substring(cursor.start.x));
                lines[cursor.start.y] = lines[cursor.start.y].substring(0, cursor.start.x);
                for (var i = 0; i <= indent.length; ++i) {
                    cursor.both.right(lines);
                }
            }
            else if (key === Keys.TAB) {
                if (!evt.altKey && !evt.ctrlKey) {
                    if (cursor.start.y !== cursor.finish.y) {
                        var a = cursor.start;
                        var b = cursor.finish;
                        if (a.i > b.i) {
                            a = cursor.finish;
                            b = cursor.start;
                        }
                        a.home(lines);
                        b.end(lines);
                        lines = lines.slice();
                        history.push(lines);
                        if (evt.shiftKey) {
                            for (var y = a.y; y <= b.y; ++y) {
                                if (lines[y].substring(0, TAB_SIZE) === TAB) {
                                    lines[y] = lines[y].substring(TAB_SIZE);
                                }
                            }
                        }
                        else {
                            for (var y = a.y; y <= b.y; ++y) {
                                lines[y] = TAB + lines[y];
                            }
                        }
                        a.setXY(0, a.y, lines);
                        b.setXY(0, b.y, lines);
                        b.end(lines);
                    }
                    else if (!evt.shiftKey) {
                        deleteSelection();
                        var left = lines[cursor.start.y].substring(0, cursor.start.x);
                        var right = lines[cursor.start.y].substring(cursor.start.x);
                        lines = lines.slice();
                        history.push(lines);
                        lines[cursor.start.y] = left + TAB + right;
                        for (var i = 0; i < TAB_SIZE; ++i) {
                            cursor.both.right(lines);
                        }
                    }
                    evt.preventDefault();
                }
            }
            else if (evt.ctrlKey && codePage.NORMAL[key] === "a") {
                cursor.start.fullHome(lines);
                cursor.finish.fullEnd(lines);
                evt.preventDefault();
            }
            else if (evt.ctrlKey && codePage.NORMAL[key] === "z") {
                if(history.length > 1){
                    history.pop();
                }
            }
            else if (codePage[type]) {
                var char = codePage[type][key];
                if (char) {
                    deleteSelection();
                    // do these edits concurrently so we don't have to rebuild
                    // the string and resplit it.
                    var left = lines[cursor.start.y].substring(0, cursor.start.x);
                    var right = lines[cursor.start.y].substring(cursor.start.x);
                    lines = lines.slice();
                    history.push(lines);
                    lines[cursor.start.y] = left + char + right;
                    cursor.both.right(lines);
                    if (key === Keys.SPACEBAR) {
                        evt.preventDefault();
                    }
                }
            }
            else {
                // what just happened?
                console.log(type, key);
            }
        }
    }

    function deleteSelection() {
        if (cursor.start.i !== cursor.finish.i) {
            var a = cursor.start;
            var b = cursor.finish;
            if (a.i > b.i) {
                a = cursor.finish;
                b = cursor.start;
            }
            var lines = history[history.length - 1];
            var text = lines.join("\n");
            var left = text.substring(0, a.i);
            var right = text.substring(b.i);
            text = left + right;
            lines = text.split("\n");
            history.push(lines);
            b.copy(a);
        }
    }

    window.addEventListener("keydown", function (evt) {
        editText(evt);
        drawText();
    });

    function copySelectedText(evt) {
        if (cursor.start.i !== cursor.finish.i) {
            var a = cursor.start;
            var b = cursor.finish;
            if (a.i > b.i) {
                a = cursor.finish;
                b = cursor.start;
            }
            var lines = history[history.length - 1];
            var text = lines.join("\n");
            var str = text.substring(a.i, b.i);
            evt.clipboardData.setData("text/plain", str);
        }
        evt.preventDefault();
    }

    window.addEventListener("copy", copySelectedText);

    window.addEventListener("cut", function (evt) {
        copySelectedText(evt)
        deleteSelection();
        drawText();
    });

    window.addEventListener("paste", function (evt) {
        var i = evt.clipboardData.types.indexOf("text/plain");
        if (i < 0) {
            for (i = 0; i < evt.clipboardData.types.length; ++i) {
                if (/^text/.test(evt.clipboardData.types[i])) {
                    break;
                }
            }
        }
        if (i >= 0) {
            var a = cursor.start;
            var b = cursor.finish;
            if (a.i > b.i) {
                a = cursor.finish;
                b = cursor.start;
            }
            var type = evt.clipboardData.types[i];
            var str = evt.clipboardData.getData(type);
            console.log("paste", str);
            deleteSelection();
            var lines = history[history.length - 1];
            var text = lines.join("\n");
            var left = text.substring(0, a.i);
            var right = text.substring(a.i);
            text = left + str + right;
            lines = text.split("\n");
            history.push(lines);
            for (var i = 0; i < str.length; ++i) {
                cursor.start.right(lines);
            }
            cursor.finish.copy(cursor.start);
            evt.preventDefault();
            drawText();
        }
    });

    function pixel2cell(x, y) {
        x = Math.floor(x * pixelRatio / CHAR_WIDTH);
        y = Math.floor((y * pixelRatio / CHAR_HEIGHT) - 0.25);
        return {x: x, y: y};
    }

    output.addEventListener("mousedown", function (evt) {
        var lines = history[history.length - 1];
        var cell = pixel2cell(evt.layerX, evt.layerY);
        cursor.both.setXY(cell.x, cell.y, lines);
        drawText();
        dragging = true;
    });

    output.addEventListener("mouseup", function (evt) {
        dragging = false;
    });

    output.addEventListener("mousemove", function (evt) {
        if (dragging) {
            var lines = history[history.length - 1];
            var cell = pixel2cell(evt.layerX, evt.layerY);
            cursor.finish.setXY(cell.x, cell.y, lines);
            drawText();
        }
    });

    function drawText() {
        var lines = history[history.length - 1];
        var text = lines.join("\n");
        var tokens = Grammar.JavaScript.tokenize(text, DEFAULT_STYLE);
        graphics.clearRect(0, 0, graphics.canvas.width, graphics.canvas.height);
        var c = new Cursor(), d = new Cursor();
        for (var i = 0; i < tokens.length; ++i) {
            var t = tokens[i];
            var parts = t.value.split("\n");
            for (var j = 0; j < parts.length; ++j) {
                var part = parts[j];
                if (part.length > 0) {
                    var a = cursor.start;
                    var b = cursor.finish;
                    d.copy(c);
                    d.x += part.length;
                    d.i += part.length;
                    if (cursor.finish.i < cursor.start.i) {
                        a = cursor.finish;
                        b = cursor.start;
                    }
                    if (a.i <= d.i && c.i < b.i) {
                        var e = a, f = b;
                        if (c.i > a.i) {
                            e = c;
                        }
                        if (d.i < b.i) {
                            f = d;
                        }
                        var cw = f.i - e.i;
                        graphics.fillStyle = "#c0c0c0";
                        graphics.fillRect(
                                e.x * CHAR_WIDTH, (e.y + 0.25) * CHAR_HEIGHT,
                                cw * CHAR_WIDTH, CHAR_HEIGHT
                                );
                    }

                    var font = (t.rule.style.fontWeight || "") + " " + (t.rule.style.fontStyle || "") + " " + CHAR_HEIGHT + "px " + DEFAULT_FONT;
                    graphics.font = font.trim();
                    graphics.fillStyle = t.rule.style.color || DEFAULT_COLOR;
                    graphics.fillText(part, c.x * CHAR_WIDTH, (c.y + 1) * CHAR_HEIGHT);
                    c.x += part.length;
                    c.i += part.length;
                }
                if (j < parts.length - 1) {
                    ++c.y;
                    ++c.i;
                    c.x = 0;
                }
            }
        }

        graphics.beginPath();
        graphics.strokeStyle = "black";
        graphics.moveTo(cursor.start.x * CHAR_WIDTH, cursor.start.y * CHAR_HEIGHT);
        graphics.lineTo(cursor.start.x * CHAR_WIDTH, (cursor.start.y + 1.25) * CHAR_HEIGHT);
        graphics.moveTo(cursor.start.x * CHAR_WIDTH + 1, cursor.start.y * CHAR_HEIGHT);
        graphics.lineTo(cursor.start.x * CHAR_WIDTH + 1, (cursor.start.y + 1.25) * CHAR_HEIGHT);
        graphics.stroke();
    }

    drawText();
}