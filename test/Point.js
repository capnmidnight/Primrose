Primrose.Text.Point.tests = {
  zero: function () {
    var p = new Primrose.Text.Point();
    Assert.areEqual( 0, p.x, "x" );
    Assert.areEqual( 0, p.y, "y" );
  },
  new1: function () {
    var p = new Primrose.Text.Point( 3, 5 );
    Assert.areEqual( 3, p.x, "x" );
    Assert.areEqual( 5, p.y, "y" );
  },
  set1: function () {
    var p = new Primrose.Text.Point( 3, 5 );
    p.set( 7, 11 );
    Assert.areEqual( 7, p.x, "x" );
    Assert.areEqual( 11, p.y, "y" );
  },
  copy1: function () {
    var p = new Primrose.Text.Point( 3, 5 );
    var q = new Primrose.Text.Point( 7, 11 );
    p.copy( q );
    Assert.areEqual( 7, p.x, "x" );
    Assert.areEqual( 11, p.y, "y" );
  },
  clone1: function () {
    var p = new Primrose.Text.Point( 13, 17 );
    var q = p.clone();
    Assert.areEqual( p.x, q.x, "x" );
    Assert.areEqual( p.y, q.y, "y" );
    Assert.areNotEqual( p, q );
  },
  toString1: function () {
    var p = new Primrose.Text.Point( 13, 17 );
    Assert.areEqual( "(x:13, y:17)", p.toString() );
  }
};