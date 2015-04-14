/* global qp */
window.Primrose = window.Primrose || { };
window.Primrose.Cursor = ( function ( ) {
  "use strict";
  
  function Cursor ( i, x, y ) {
    this.i = i || 0;
    this.x = x || 0;
    this.y = y || 0;
    this.moved = true;
  }

  Cursor.min = function ( a, b ) {
    if ( a.i <= b.i ) {
      return a;
    }
    return b;
  };

  Cursor.max = function ( a, b ) {
    if ( a.i > b.i ) {
      return a;
    }
    return b;
  };

  Cursor.prototype.toString = function () {
    return fmt( "[i:$1 x:$2 y:$3]", this.i, this.x, this.y );
  };

  Cursor.prototype.copy = function ( cursor ) {
    this.i = cursor.i;
    this.x = cursor.x;
    this.y = cursor.y;
    this.moved = false;
  };

  Cursor.prototype.fullhome = function ( tokenRows ) {
    this.i = 0;
    this.x = 0;
    this.y = 0;
    this.moved = true;
  };

  function rebuildLine ( tokenRows, y ) {
    var tokenRow = tokenRows[y];
    var line = "";
    for ( var i = 0; i < tokenRow.length; ++i ) {
      line += tokenRow[i].value;
    }
    return line;
  }

  Cursor.prototype.fullend = function ( tokenRows ) {
    this.i = 0;
    var lastLength = 0;
    for ( var y = 0; y < tokenRows.length; ++y ) {
      var line = rebuildLine( tokenRows, y );
      lastLength = line.length;
      this.i += lastLength;
    }
    this.y = tokenRows.length - 1;
    this.x = lastLength;
    this.moved = true;
  };

  Cursor.prototype.skipleft = function ( tokenRows ) {
    if ( this.x === 0 ) {
      this.left( tokenRows );
    }
    else {
      var x = this.x - 1;
      var line = rebuildLine( tokenRows, this.y );
      var word = qp.reverse( line.substring( 0, x ) );
      var m = word.match( /(\s|\W)+/ );
      var dx = m ? ( m.index + m[0].length + 1 ) : word.length;
      this.i -= dx;
      this.x -= dx;
    }
    this.moved = true;
  };

  Cursor.prototype.left = function ( tokenRows ) {
    if ( this.i > 0 ) {
      --this.i;
      --this.x;
      if ( this.x < 0 ) {
        --this.y;
        var line = rebuildLine( tokenRows, this.y );
        this.x = line.length;
      }
      if ( this.reverseFromNewline( tokenRows ) ) {
        ++this.i;
      }
    }
    this.moved = true;
  };

  Cursor.prototype.skipright = function ( tokenRows ) {
    var line = rebuildLine( tokenRows, this.y );
    if ( this.x === line.length || line[line.length - 1] === '\n' ) {
      this.right( tokenRows );
    }
    else {
      var x = this.x + 1;
      line = line.substring( x );
      var m = line.match( /(\s|\W)+/ );
      var dx = m ? ( m.index + m[0].length + 1 ) : ( line.length - this.x );
      this.i += dx;
      this.x += dx;
      this.reverseFromNewline( tokenRows );
    }
    this.moved = true;
  };

  Cursor.prototype.right = function ( tokenRows ) {
    this.advanceN( tokenRows, 1 );
  };

  Cursor.prototype.advanceN = function ( tokenRows, n ) {
    if ( this.y < tokenRows.length - 1 ) {
      var line = rebuildLine( tokenRows, this.y );
      if ( this.x < line.length ) {
        this.i += n;
        this.x += n;
        while ( this.x > line.length ) {
          this.x -= line.length;
          ++this.y;
        }
        if ( this.x > 0 && line[this.x - 1] === '\n' ) {
          ++this.y;
          this.x = 0;
        }
      }
    }
    this.moved = true;
  };

  Cursor.prototype.home = function ( tokenRows ) {
    this.i -= this.x;
    this.x = 0;
    this.moved = true;
  };

  Cursor.prototype.end = function ( tokenRows ) {
    var line = rebuildLine( tokenRows, this.y );
    var dx = line.length - this.x;
    this.i += dx;
    this.x += dx;
    this.reverseFromNewline( tokenRows );
    this.moved = true;
  };

  Cursor.prototype.up = function ( tokenRows ) {
    if ( this.y > 0 ) {
      --this.y;
      var line = rebuildLine( tokenRows, this.y );
      var dx = Math.min( 0, line.length - this.x );
      this.x += dx;
      this.i -= line.length - dx;
      this.reverseFromNewline( tokenRows );
    }
    this.moved = true;
  };

  Cursor.prototype.down = function ( tokenRows ) {
    if ( this.y < tokenRows.length - 1 ) {
      ++this.y;
      var line = rebuildLine( tokenRows, this.y );
      var pLine = rebuildLine( tokenRows, this.y - 1 );
      var dx = Math.min( 0, line.length - this.x );
      this.x += dx;
      this.i += pLine.length + dx;
      this.reverseFromNewline( tokenRows );
    }
    this.moved = true;
  };

  Cursor.prototype.incY = function ( dy, tokenRows ) {
    this.y = Math.max( 0, Math.min( tokenRows.length - 1, this.y + dy ) );
    var line = rebuildLine( tokenRows, this.y );
    this.x = Math.max( 0, Math.min( line.length, this.x ) );
    this.i = this.x;
    for ( var i = 0; i < this.y; ++i ) {
      this.i += rebuildLine( tokenRows, i ).length;
    }
    this.reverseFromNewline( tokenRows );
    this.moved = true;
  };

  Cursor.prototype.setXY = function ( x, y, tokenRows ) {
    this.y = Math.max( 0, Math.min( tokenRows.length - 1, y ) );
    var line = rebuildLine( tokenRows, this.y );
    this.x = Math.max( 0, Math.min( line.length, x ) );
    this.i = this.x;
    for ( var i = 0; i < this.y; ++i ) {
      this.i += rebuildLine( tokenRows, i ).length;
    }
    this.reverseFromNewline( tokenRows );
    this.moved = true;
  };

  Cursor.prototype.reverseFromNewline = function ( tokenRows ) {
    var line = rebuildLine( tokenRows, this.y );
    if ( this.x > 0 && line[this.x - 1] === '\n' ) {
      --this.x;
      --this.i;
      return true;
    }
    return false;
  };

  return Cursor;
} )();