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
    var output = document.getElementById("output");
    var graphics = output.getContext("2d");
    var CHAR_HEIGHT = 20;
    var pixelRatio = window.devicePixelRatio || 1;
    CHAR_HEIGHT *= pixelRatio;
    output.style.width = output.width + "px";
    output.style.height = output.height + "px";
    output.width = output.width * pixelRatio;
    output.height = output.height * pixelRatio;
    var cursor = {x: 0, y: 0, start: 0, end: 0};
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
                if (cursor.start <= i && i <= cursor.end) {
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
        evt.preventDefault();
        if (key === Keys.LEFTARROW) {
            if (evt.shiftKey) {
                --cursor.end;
            }
            else {
                --cursor.start;
                cursor.end = cursor.start;
                --cursor.x;
                if (cursor.x < 0) {
                    --cursor.y;
                    cursor.x = lines[cursor.y].length;
                }
            }
        }
        else if (key === Keys.RIGHTARROW && cursor.start < text.length) {
            if (evt.shiftKey) {
                ++cursor.end;
            }
            else {
                ++cursor.start;
                cursor.end = cursor.start;
                ++cursor.x;
                if (cursor.x > lines[cursor.y].length) {
                    cursor.x = 0;
                    ++cursor.y;
                }
            }
        }
        else if (key === Keys.UPARROW && cursor.y > 0) {
            if (evt.shiftKey) {
                // this is not right
                cursor.end -= lines[cursor.y - 1].length - cursor.x;
            }
            else {
                --cursor.y;
                cursor.x = Math.min(lines[cursor.y].length, cursor.x);
                cursor.start -= lines[cursor.y].length + 1;
                cursor.end = cursor.start;
            }
        }
        else if (key === Keys.DOWNARROW && cursor.y < lines.length) {
            if (evt.shiftKey) {
                cursor.end += lines[cursor.y].length;
            }
            else {
                cursor.start += lines[cursor.y].length + 1;
                cursor.end = cursor.start;
                ++cursor.y;
                cursor.x = Math.min(lines[cursor.y].length, cursor.x);
            }
        }
        else if (key !== Keys.SHIFT && key !== Keys.CTRL && key !== Keys.ALT) {
            if (cursor.start !== cursor.end) {
                data.delete(
                        Math.min(cursor.start, cursor.end + 1),
                        Math.max(cursor.start, cursor.end + 1));
            }
            if (key === Keys.BACKSPACE && cursor.start === cursor.end) {
                data.delete(cursor.start - 1, cursor.start);
                --cursor.start;
            }
            else if (key === Keys.DELETE && cursor.start === cursor.end) {
                data.delete(cursor.start, cursor.start + 1);
            }
            else if (key === Keys.ENTER) {
                var indent = "";
                while (lines[cursor.y][cursor.x] === " ") {
                    indent += " ";
                }
                data.insert(cursor.start, "\n" + indent);
                cursor.start += indent.length + 1;
                ++cursor.y;
                cursor.x = indent.length;
            }
            else if (Keys.UPPERCASE[key] || Keys.LOWERCASE[key]) {
                data.insert(
                        cursor.start,
                        (evt.shiftKey ? Keys.UPPERCASE : Keys.LOWERCASE)[key]);
                ++cursor.start;
                ++cursor.x;
            }
            else {
                console.log(evt.keyCode);
            }
            cursor.end = cursor.start;
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
        cursor.start = cursor.x;
        for(var i = 0; i < cursor.y; ++i){
            cursor.start += lines[i].length + 1;
        }
        cursor.end = cursor.start;
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
            cursor.end = Math.max(0, Math.min(lines[cursor.y].length, Math.floor(evt.layerX * pixelRatio / CHAR_WIDTH)));
            for(var i = 0; i < y; ++i){
                cursor.end += lines[i].length + 1;
            }
            drawText();
        }
    });
}