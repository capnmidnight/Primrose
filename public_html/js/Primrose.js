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
    var cursor = {x: 0, y: 0, i: 0, x2: 0, y2: 0, i2: 0};
    graphics.font = CHAR_HEIGHT + "px monospace";
    var CHAR_WIDTH = graphics.measureText("M").width;
    var testStyleSheet = null;
    for (var i = 0; i < document.styleSheets.length; ++i) {
        var s = document.styleSheets[i];
        if (s.ownerNode.id === "testStyle") {
            testStyleSheet = s;
            break;
        }
    }

    function drawText() {
        var text = data.toString();
        graphics.clearRect(0, 0, graphics.canvas.width, graphics.canvas.height);
        var x = 0, y = 0;
        for (var i = 0; i < text.length; ++i) {
            var char = text[i];
            if (char === "\n") {
                ++y;
                x = 0;
            }
            else {
                if (cursor.i <= i && i <= cursor.i2) {
                    graphics.fillStyle = "#c0c0c0";
                    graphics.fillRect(
                            x * CHAR_WIDTH, (y + 0.25) * CHAR_HEIGHT,
                            CHAR_WIDTH, CHAR_HEIGHT
                            );
                }

                /*
                 var font = ((cur.totalStyle["font-weight"] || "")
                 + " "
                 + (cur.totalStyle["font-style"] || "")
                 + " "
                 + CHAR_HEIGHT
                 + "px monospace").trim();
                 */
                var font = CHAR_HEIGHT + "px monospace";
                graphics.font = font;
                //graphics.fillStyle = cur.totalStyle.color;
                graphics.fillStyle = "black";
                graphics.fillText(char, x * CHAR_WIDTH, (y + 1) * CHAR_HEIGHT);
                ++x;
            }
        }

        graphics.beginPath();
        graphics.strokeStyle = "black";
        graphics.moveTo(cursor.x * CHAR_WIDTH, cursor.y * CHAR_HEIGHT);
        graphics.lineTo(cursor.x * CHAR_WIDTH, (cursor.y + 1.25) * CHAR_HEIGHT);
        graphics.moveTo(cursor.x * CHAR_WIDTH + 1, cursor.y * CHAR_HEIGHT);
        graphics.lineTo(cursor.x * CHAR_WIDTH + 1, (cursor.y + 1.25) * CHAR_HEIGHT);
        graphics.stroke();
    }

    function editText(evt) {
        evt = evt || event;
        var key = evt.keyCode || evt.which;
        var text = data.toString();
        var lines = text.split(/\n/g);
        if (key === Keys.LEFTARROW) {
            if (evt.shiftKey) {
                --cursor.i2;
                --cursor.x2;
                if (cursor.x2 < 0) {
                    --cursor.y2;
                    cursor.x2 = lines[cursor.y2].length;
                }
            }
            else if (cursor.i > 0) {
                --cursor.i;
                --cursor.x;
                if (cursor.x < 0) {
                    --cursor.y;
                    cursor.x = lines[cursor.y].length;
                }
                cursor.i2 = cursor.i;
                cursor.x2 = cursor.x;
                cursor.y2 = cursor.y;
            }
            evt.preventDefault();
        }
        else if (key === Keys.RIGHTARROW) {
            if (evt.shiftKey) {
                ++cursor.i2;
                ++cursor.x2;
                if (cursor.x2 > lines[cursor.y2].length) {
                    cursor.x2 = 0;
                    ++cursor.y2;
                }
            }
            else if (cursor.i < text.length) {
                ++cursor.i;
                ++cursor.x;
                if (cursor.x > lines[cursor.y].length) {
                    cursor.x = 0;
                    ++cursor.y;
                }
                cursor.i2 = cursor.i;
                cursor.x2 = cursor.x;
                cursor.y2 = cursor.y;
            }
            evt.preventDefault();
        }
        else if (key === Keys.UPARROW) {
            if (evt.shiftKey) {
                --cursor.y2;
                var dx = Math.min(0, lines[cursor.y2].length - cursor.x2);
                cursor.x2 += dx;
                cursor.i2 -= lines[cursor.y2].length + 1 - dx;
            }
            else if (cursor.y > 0) {
                --cursor.y;
                var dx = Math.min(0, lines[cursor.y].length - cursor.x);
                cursor.x += dx;
                cursor.i -= lines[cursor.y].length + 1 - dx;
                cursor.i2 = cursor.i;
                cursor.x2 = cursor.x;
                cursor.y2 = cursor.y;
            }
            evt.preventDefault();
        }
        else if (key === Keys.DOWNARROW) {
            if (evt.shiftKey) {
                ++cursor.y2;
                var dx = Math.min(0, lines[cursor.y2].length - cursor.x2);
                cursor.x2 += dx;
                cursor.i2 += lines[cursor.y2 - 1].length + 1 + dx;
            }
            else if (cursor.y < lines.length - 1) {
                ++cursor.y;
                var dx = Math.min(0, lines[cursor.y].length - cursor.x);
                cursor.x += dx;
                cursor.i += lines[cursor.y - 1].length + 1 + dx;
                cursor.i2 = cursor.i;
                cursor.x2 = cursor.x;
                cursor.y2 = cursor.y;
            }
            evt.preventDefault();
        }
        else if (key !== Keys.SHIFT && key !== Keys.CTRL && key !== Keys.ALT) {
            if (cursor.i !== cursor.i2) {
                data.delete(
                        Math.min(cursor.i, cursor.i2 + 1),
                        Math.max(cursor.i, cursor.i2 + 1));
            }
            if (key === Keys.BACKSPACE && cursor.i === cursor.i2) {
                data.delete(cursor.i - 1, cursor.i);
                --cursor.i;
                evt.preventDefault();
            }
            else if (key === Keys.DELETE && cursor.i === cursor.i2) {
                data.delete(cursor.i, cursor.i + 1);
            }
            else if (key === Keys.ENTER) {
                var indent = "";
                while (lines[cursor.y][cursor.x] === " ") {
                    indent += " ";
                }
                data.insert(cursor.i, "\n" + indent);
                cursor.i += indent.length + 1;
                ++cursor.y;
                cursor.x = indent.length;
                evt.preventDefault();
            }
            else if (!evt.ctrlKey && !evt.altKey && (Keys.UPPERCASE[key] || Keys.LOWERCASE[key])) {
                data.insert(
                        cursor.i,
                        (evt.shiftKey ? Keys.UPPERCASE : Keys.LOWERCASE)[key]);
                ++cursor.i;
                ++cursor.x;
                evt.preventDefault();
            }
            else {
                console.log(evt.keyCode);
            }
            cursor.i2 = cursor.i;
            cursor.x2 = cursor.x;
            cursor.y2 = cursor.y;
        }
    }

    window.addEventListener("keydown", function (evt) {
        editText(evt);
        drawText();
    });

    drawText();

    var dragging = false;
    output.addEventListener("mousedown", function (evt) {
        var text = data.toString();
        var lines = text.split("\n");
        cursor.y = Math.max(0, Math.min(lines.length - 1, Math.floor((evt.layerY * pixelRatio / CHAR_HEIGHT) - 0.25)));
        cursor.x = Math.max(0, Math.min(lines[cursor.y].length, Math.floor(evt.layerX * pixelRatio / CHAR_WIDTH)));
        cursor.i = cursor.x;
        for (var i = 0; i < cursor.y; ++i) {
            cursor.i += lines[i].length + 1;
        }
        cursor.i2 = cursor.i;
        cursor.x2 = cursor.x;
        cursor.y2 = cursor.y;
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
            var y = Math.max(0, Math.min(lines.length - 1, Math.floor(evt.layerY * pixelRatio / CHAR_HEIGHT)));
            cursor.i2 = Math.max(0, Math.min(lines[cursor.y].length, Math.floor(evt.layerX * pixelRatio / CHAR_WIDTH)));
            for (var i = 0; i < y; ++i) {
                cursor.i2 += lines[i].length + 1;
            }
            drawText();
        }
    });
}