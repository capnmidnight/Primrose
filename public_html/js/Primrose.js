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
    graphics.font = CHAR_HEIGHT + "px " + DEFAULT_FONT;
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
                var a = Math.min(cursor.start.i, cursor.end.i);
                var b = Math.max(cursor.start.i, cursor.end.i);
                if (a <= i && i <= b) {
                    graphics.fillStyle = "#c0c0c0";
                    graphics.fillRect(
                            x * CHAR_WIDTH, (y + 0.25) * CHAR_HEIGHT,
                            CHAR_WIDTH, CHAR_HEIGHT
                            );
                }
                
                var font = CHAR_HEIGHT + "px " + DEFAULT_FONT;
                graphics.font = font;
                graphics.fillStyle = DEFAULT_COLOR;
                graphics.fillText(char, x * CHAR_WIDTH, (y + 1) * CHAR_HEIGHT);
                ++x;
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
        var text = data.toString();
        var lines = text.split(/\n/g);
        if (key === Keys.LEFTARROW) {
            if (evt.shiftKey) {
                cursor.end.left(lines);
            }
            else {
                cursor.start.left(lines);
                cursor.end.copy(cursor.start);
            }
            evt.preventDefault();
        }
        else if (key === Keys.RIGHTARROW) {
            if (evt.shiftKey) {
                cursor.end.right(lines);
                console.log(cursor.end.toString());
            }
            else if (!evt.shiftKey) {
                cursor.start.right(lines);
                console.log(cursor.start.toString());
                cursor.end.copy(cursor.start);
            }
            evt.preventDefault();
        }
        else if (key === Keys.UPARROW) {
            if (evt.shiftKey) {
                cursor.end.up(lines);
            }
            else if (!evt.shiftKey) {
                cursor.start.up(lines);
                cursor.end.copy(cursor.start);
            }
            evt.preventDefault();
        }
        else if (key === Keys.DOWNARROW) {
            if (evt.shiftKey) {
                cursor.end.down(lines);
            }
            else if (!evt.shiftKey) {
                cursor.start.down(lines);
                cursor.end.copy(cursor.start);
            }
            evt.preventDefault();
        }
        else if (key !== Keys.SHIFT && key !== Keys.CTRL && key !== Keys.ALT) {
            if (cursor.start.i !== cursor.end.i) {
                var a = Math.min(cursor.start.i, cursor.end.i + 1);
                var b = Math.min(text.length, Math.max(cursor.start.i, cursor.end.i + 1));
                var delta = b - a;
                data.delete(a, b);
                if(cursor.start.i > text.length - delta){
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
                for(var i = 0; i < lines[cursor.start.y].length && lines[cursor.start.y][i] === " "; ++i) {
                    indent += " ";
                }
                // do these edits concurrently so we don't have to rebuild
                // the string and resplit it.
                lines.splice(cursor.start.y + 1, 0, indent + lines[cursor.start.y].substring(cursor.start.x));
                lines[cursor.start.y] = lines[cursor.start.y].substring(0, cursor.start.x);
                data.insert(cursor.start.i, "\n" + indent);
                for(var i = 0; i <= indent.length; ++i){
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
            cursor.end.copy(cursor.start);
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