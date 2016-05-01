"use strict";

Primrose.Text.Size.tests = {
  zero: function () {
    var p = new Primrose.Text.Size();
    Assert.areEqual(0, p.width, "width");
    Assert.areEqual(0, p.height, "height");
  },
  new1: function () {
    var p = new Primrose.Text.Size(3, 5);
    Assert.areEqual(3, p.width, "width");
    Assert.areEqual(5, p.height, "height");
  },
  set1: function () {
    var p = new Primrose.Text.Size(3, 5);
    p.set(7, 11);
    Assert.areEqual(7, p.width, "width");
    Assert.areEqual(11, p.height, "height");
  },
  copy1: function () {
    var p = new Primrose.Text.Size(3, 5);
    var q = new Primrose.Text.Size(7, 11);
    p.copy(q);
    Assert.areEqual(7, p.width, "width");
    Assert.areEqual(11, p.height, "height");
  },
  clone1: function () {
    var p = new Primrose.Text.Size(13, 17);
    var q = p.clone();
    Assert.areEqual(p.width, q.width, "width");
    Assert.areEqual(p.height, q.height, "height");
    Assert.areNotEqual(p, q);
  },
  toString1: function () {
    var p = new Primrose.Text.Size(13, 17);
    Assert.areEqual("<w:13, h:17>", p.toString());
  }
};