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
                var a = Math.min(cursor.start.i, cursor.end.i);
                var b = Math.max(cursor.start.i, cursor.end.i);
                if (a <= i && i <= b) {
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
            if (evt.shiftKey){
                cursor.end.right(lines);
            }
            else if (!evt.shiftKey) {
                cursor.start.right(lines);
                cursor.end.copy(cursor.start);
            }
            evt.preventDefault();
        }
        else if (key === Keys.UPARROW) {
            if (evt.shiftKey){
                cursor.end.up(lines);
            }
            else if (!evt.shiftKey) {
                cursor.start.up(lines);
                cursor.end.copy(cursor.start);
            }
            evt.preventDefault();
        }
        else if (key === Keys.DOWNARROW) {
            if (evt.shiftKey){
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
                data.delete(
                        Math.min(cursor.start.i, cursor.end.i + 1),
                        Math.max(cursor.start.i, cursor.end.i + 1));
            }
            if (key === Keys.BACKSPACE && cursor.start.i === cursor.end.i) {
                data.delete(cursor.start.i - 1, cursor.start.i);
                --cursor.start.i;
                evt.preventDefault();
            }
            else if (key === Keys.DELETE && cursor.start.i === cursor.end.i) {
                data.delete(cursor.start.i, cursor.start.i + 1);
            }
            else if (key === Keys.ENTER) {
                var indent = "";
                while (lines[cursor.start.y][cursor.start.x] === " ") {
                    indent += " ";
                }
                data.insert(cursor.start.i, "\n" + indent);
                cursor.start.i += indent.length + 1;
                ++cursor.start.y;
                cursor.start.x = indent.length;
                evt.preventDefault();
            }
            else if (!evt.ctrlKey && !evt.altKey && (Keys.UPPERCASE[key] || Keys.LOWERCASE[key])) {
                data.insert(
                        cursor.start.i,
                        (evt.shiftKey ? Keys.UPPERCASE : Keys.LOWERCASE)[key]);
                ++cursor.start.i;
                ++cursor.start.x;
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
    output.addEventListener("mousedown", function (evt) {
        var text = data.toString();
        var lines = text.split("\n");
        cursor.start.y = Math.max(0, Math.min(lines.length - 1, Math.floor((evt.layerY * pixelRatio / CHAR_HEIGHT) - 0.25)));
        cursor.start.x = Math.max(0, Math.min(lines[cursor.start.y].length, Math.floor(evt.layerX * pixelRatio / CHAR_WIDTH)));
        cursor.start.i = cursor.start.x;
        for (var i = 0; i < cursor.start.y; ++i) {
            cursor.start.i += lines[i].length + 1;
        }
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
            var y = Math.max(0, Math.min(lines.length - 1, Math.floor(evt.layerY * pixelRatio / CHAR_HEIGHT)));
            cursor.end.i = Math.max(0, Math.min(lines[cursor.start.y].length, Math.floor(evt.layerX * pixelRatio / CHAR_WIDTH)));
            for (var i = 0; i < y; ++i) {
                cursor.end.i += lines[i].length + 1;
            }
            drawText();
        }
    });
}