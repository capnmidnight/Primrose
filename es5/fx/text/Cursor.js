"use strict";

Primrose.Text.Cursor = function () {
  "use strict";

  // unicode-aware string reverse

  var reverse = function () {
    var combiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g,
        surrogatePair = /(<%= highSurrogates %>)(<%= lowSurrogates %>)/g;

    function reverse(str) {
      str = str.replace(combiningMarks, function (match, capture1, capture2) {
        return reverse(capture2) + capture1;
      }).replace(surrogatePair, "$2$1");
      var res = "";
      for (var i = str.length - 1; i >= 0; --i) {
        res += str[i];
      }
      return res;
    }
    return reverse;
  }();

  pliny.class({
    parent: "Primrose.Text",
    name: "Cursor",
    description: "| [under construction]"
  });
  function Cursor(i, x, y) {
    this.i = i || 0;
    this.x = x || 0;
    this.y = y || 0;
    this.moved = true;
  }

  Cursor.min = function (a, b) {
    if (a.i <= b.i) {
      return a;
    }
    return b;
  };

  Cursor.max = function (a, b) {
    if (a.i > b.i) {
      return a;
    }
    return b;
  };

  Cursor.prototype.clone = function () {
    return new Cursor(this.i, this.x, this.y);
  };

  Cursor.prototype.toString = function () {
    return "[i:" + this.i + " x:" + this.x + " y:" + this.y + "]";
  };

  Cursor.prototype.copy = function (cursor) {
    this.i = cursor.i;
    this.x = cursor.x;
    this.y = cursor.y;
    this.moved = false;
  };

  Cursor.prototype.fullhome = function () {
    this.i = 0;
    this.x = 0;
    this.y = 0;
    this.moved = true;
  };

  Cursor.prototype.fullend = function (lines) {
    this.i = 0;
    var lastLength = 0;
    for (var y = 0; y < lines.length; ++y) {
      var line = lines[y];
      lastLength = line.length;
      this.i += lastLength;
    }
    this.y = lines.length - 1;
    this.x = lastLength;
    this.moved = true;
  };

  Cursor.prototype.skipleft = function (lines) {
    if (this.x === 0) {
      this.left(lines);
    } else {
      var x = this.x - 1;
      var line = lines[this.y];
      var word = reverse(line.substring(0, x));
      var m = word.match(/(\s|\W)+/);
      var dx = m ? m.index + m[0].length + 1 : word.length;
      this.i -= dx;
      this.x -= dx;
    }
    this.moved = true;
  };

  Cursor.prototype.left = function (lines) {
    if (this.i > 0) {
      --this.i;
      --this.x;
      if (this.x < 0) {
        --this.y;
        var line = lines[this.y];
        this.x = line.length;
      }
      if (this.reverseFromNewline(lines)) {
        ++this.i;
      }
    }
    this.moved = true;
  };

  Cursor.prototype.skipright = function (lines) {
    var line = lines[this.y];
    if (this.x === line.length || line[this.x] === '\n') {
      this.right(lines);
    } else {
      var x = this.x + 1;
      line = line.substring(x);
      var m = line.match(/(\s|\W)+/);
      var dx = m ? m.index + m[0].length + 1 : line.length - this.x;
      this.i += dx;
      this.x += dx;
      this.reverseFromNewline(lines);
    }
    this.moved = true;
  };

  Cursor.prototype.fixCursor = function (lines) {
    this.x = this.i;
    this.y = 0;
    var total = 0;
    var line = lines[this.y];
    while (this.x > line.length) {
      this.x -= line.length;
      total += line.length;
      if (this.y >= lines.length - 1) {
        this.i = total;
        this.x = line.length;
        this.moved = true;
        break;
      }
      ++this.y;
      line = lines[this.y];
    }
    return this.moved;
  };

  Cursor.prototype.right = function (lines) {
    this.advanceN(lines, 1);
  };

  Cursor.prototype.advanceN = function (lines, n) {
    var line = lines[this.y];
    if (this.y < lines.length - 1 || this.x < line.length) {
      this.i += n;
      this.fixCursor(lines);
      line = lines[this.y];
      if (this.x > 0 && line[this.x - 1] === '\n') {
        ++this.y;
        this.x = 0;
      }
    }
    this.moved = true;
  };

  Cursor.prototype.home = function () {
    this.i -= this.x;
    this.x = 0;
    this.moved = true;
  };

  Cursor.prototype.end = function (lines) {
    var line = lines[this.y];
    var dx = line.length - this.x;
    this.i += dx;
    this.x += dx;
    this.reverseFromNewline(lines);
    this.moved = true;
  };

  Cursor.prototype.up = function (lines) {
    if (this.y > 0) {
      --this.y;
      var line = lines[this.y];
      var dx = Math.min(0, line.length - this.x);
      this.x += dx;
      this.i -= line.length - dx;
      this.reverseFromNewline(lines);
    }
    this.moved = true;
  };

  Cursor.prototype.down = function (lines) {
    if (this.y < lines.length - 1) {
      ++this.y;
      var line = lines[this.y];
      var pLine = lines[this.y - 1];
      var dx = Math.min(0, line.length - this.x);
      this.x += dx;
      this.i += pLine.length + dx;
      this.reverseFromNewline(lines);
    }
    this.moved = true;
  };

  Cursor.prototype.incY = function (dy, lines) {
    this.y = Math.max(0, Math.min(lines.length - 1, this.y + dy));
    var line = lines[this.y];
    this.x = Math.max(0, Math.min(line.length, this.x));
    this.i = this.x;
    for (var i = 0; i < this.y; ++i) {
      this.i += lines[i].length;
    }
    this.reverseFromNewline(lines);
    this.moved = true;
  };

  Cursor.prototype.setXY = function (x, y, lines) {
    this.y = Math.max(0, Math.min(lines.length - 1, y));
    var line = lines[this.y];
    this.x = Math.max(0, Math.min(line.length, x));
    this.i = this.x;
    for (var i = 0; i < this.y; ++i) {
      this.i += lines[i].length;
    }
    this.reverseFromNewline(lines);
    this.moved = true;
  };

  Cursor.prototype.setI = function (i, lines) {
    this.i = i;
    this.fixCursor(lines);
    this.moved = true;
  };

  Cursor.prototype.reverseFromNewline = function (lines) {
    var line = lines[this.y];
    if (this.x > 0 && line[this.x - 1] === '\n') {
      --this.x;
      --this.i;
      return true;
    }
    return false;
  };

  return Cursor;
}();