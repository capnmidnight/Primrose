function load() {
    var data = new Rope("function Hello (){\n"
            + "    // a comment\n"
            + "    function MyFunc ( ) {\n"
            + "        var x = \"Whatever\";\n"
            + "        console.log(x + \" World\");\n"
            + "        /*\n"
            + "          a longer comment\n"
            + "        */\n"
            + "    }\n"
            + "}");
    var clipboard = document.getElementById("clipboard");
    var output = document.getElementById("output");
    var graphics = output.getContext("2d");
    var CHAR_HEIGHT = 20;
    var pixelRatio = window.devicePixelRatio || 1;
    CHAR_HEIGHT *= pixelRatio;
    output.style.width = output.width + "px";
    output.style.height = output.height + "px";
    output.width = output.width * pixelRatio;
    output.height = output.height * pixelRatio;
    var cursor = {start: new Cursor(), end: new Cursor()};
    var DEFAULT_FONT = "monospace";
    var DEFAULT_COLOR = "black";
    var DEFAULT_STYLE = new Rule("default", null, {color: DEFAULT_COLOR});
    graphics.font = CHAR_HEIGHT + "px " + DEFAULT_FONT;
    var CHAR_WIDTH = graphics.measureText("M").width;

    function drawText() {
        var text = data.toString();
        var tokens = Grammar.JavaScript.tokenize(text, DEFAULT_STYLE);
        graphics.clearRect(0, 0, graphics.canvas.width, graphics.canvas.height);
        var x = 0, y = 0, c = 0;
        for (var i = 0; i < tokens.length; ++i) {
            var t = tokens[i];
            var parts = t.value.split("\n");
            for (var j = 0; j < parts.length; ++j) {
                var part = parts[j];
                if (part.length > 0) {
                    var a = Math.min(cursor.start.i, cursor.end.i);
                    var b = Math.max(cursor.start.i, cursor.end.i);
                    if (a <= c && c <= b) {
                        graphics.fillStyle = "#c0c0c0";
                        graphics.fillRect(
                                x * CHAR_WIDTH, (y + 0.25) * CHAR_HEIGHT,
                                Math.min(b - c, part.length) * CHAR_WIDTH, CHAR_HEIGHT
                                );
                    }

                    var font = (t.rule.style.fontWeight || "") + " " + (t.rule.style.fontStyle || "") + " " + CHAR_HEIGHT + "px " + DEFAULT_FONT;
                    graphics.font = font.trim();
                    graphics.fillStyle = t.rule.style.color;
                    graphics.fillText(part, x * CHAR_WIDTH, (y + 1) * CHAR_HEIGHT);
                    x += part.length;
                    c += part.length;
                }
                if (j < parts.length - 1) {
                    ++y;
                    x = 0;
                    ++c;
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

    function editText(evt) {
        evt = evt || event;
        var key = evt.keyCode || evt.which;
        if (key !== Keys.SHIFT && key !== Keys.CTRL && key !== Keys.ALT) {
            var text = data.toString();
            var lines = text.split(/\n/g);
            var cur = evt.shiftKey ? cursor.end : cursor.start;
            if (key === Keys.LEFTARROW) {
                cur.left(lines);
                evt.preventDefault();
            }
            else if (key === Keys.RIGHTARROW) {
                cur.right(lines);
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
            else if(key === Keys.HOME){
                cur.home(lines);
                evt.preventDefault();
            }
            else {
                if (cursor.start.i !== cursor.end.i) {
                    var a = Math.min(cursor.start.i, cursor.end.i + 1);
                    var b = Math.min(text.length, Math.max(cursor.start.i, cursor.end.i + 1));
                    var delta = b - a;
                    data.delete(a, b);
                    if (cursor.start.i > text.length - delta) {
                        cursor.start.copy(cursor.end);
                    }
                }
                if (key === Keys.BACKSPACE) {
                    evt.preventDefault();
                    if (cursor.start.i === cursor.end.i && cursor.start.i > 0) {
                        data.delete(cursor.start.i - 1, cursor.start.i);
                        cursor.start.left(lines);
                    }
                }
                else if (key === Keys.DELETE) {
                    if (cursor.start.i === cursor.end.i && cursor.start.i < text.length) {
                        data.delete(cursor.start.i, cursor.start.i + 1);
                    }
                }
                else if (key === Keys.ENTER) {
                    var indent = "";
                    for (var i = 0; i < lines[cursor.start.y].length && lines[cursor.start.y][i] === " "; ++i) {
                        indent += " ";
                    }
                    // do these edits concurrently so we don't have to rebuild
                    // the string and resplit it.
                    lines.splice(cursor.start.y + 1, 0, indent + lines[cursor.start.y].substring(cursor.start.x));
                    lines[cursor.start.y] = lines[cursor.start.y].substring(0, cursor.start.x);
                    data.insert(cursor.start.i, "\n" + indent);
                    for (var i = 0; i <= indent.length; ++i) {
                        cursor.start.right(lines);
                    }
                    evt.preventDefault();
                }
                else if (!evt.ctrlKey && !evt.altKey && (Keys.UPPERCASE[key] || Keys.LOWERCASE[key])) {
                    var char = (evt.shiftKey ? Keys.UPPERCASE : Keys.LOWERCASE)[key];
                    data.insert(
                            cursor.start.i,
                            char);
                    // do these edits concurrently so we don't have to rebuild
                    // the string and resplit it.
                    var left = lines[cursor.start.y].substring(0, cursor.start.x);
                    var right = lines[cursor.start.y].substring(cursor.start.x);
                    lines[cursor.start.y] = left + char + right;
                    cursor.start.right(lines);
                    evt.preventDefault();
                }
                else {
                    console.log(evt.keyCode);
                }
            }
            
            if(!evt.shiftKey || Keys.LOWERCASE[key]){
                cursor.end.copy(cursor.start);
            }
        }
    }

    window.addEventListener("keydown", function (evt) {
        editText(evt);
        drawText();
    });

    drawText();

    var dragging = false;

    function getCell(x, y) {
        x = Math.floor(x * pixelRatio / CHAR_WIDTH);
        y = Math.floor((y * pixelRatio / CHAR_HEIGHT) - 0.25);
        return {x: x, y: y};
    }

    output.addEventListener("mousedown", function (evt) {
        var text = data.toString();
        var lines = text.split("\n");
        var cell = getCell(evt.layerX, evt.layerY);
        cursor.start.setXY(cell.x, cell.y, lines);
        cursor.end.copy(cursor.start);
        drawText();
        dragging = true;
    });
    
    output.addEventListener("mouseup", function (evt) {
        dragging = false;
    });

    output.addEventListener("mousemove", function (evt) {
        if (dragging) {
            var text = data.toString();
            var lines = text.split("\n");
            var cell = getCell(evt.layerX, evt.layerY);
            cursor.end.setXY(cell.x, cell.y, lines);
            drawText();
        }
    });
}