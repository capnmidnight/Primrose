/* 
 * Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

consoleTest(Cursor);


Rope.tests = {
    leaf: function () {
        var str = "hello, world";
        var rp = new Rope(str);
        Assert.areEqual(str.length, rp.weight, "length doesn't match weight");
        Assert.areEqual(str, rp.value, "values don't match");
        Assert.areEqual(str.length, rp.length, "lengths don't match");
        Assert.areEqual(str, rp.toString(), "values don't match");
    },
    root: function () {
        var l = "hello,";
        var r = " world";
        var str = l + r;
        var rp = new Rope(l, r);
        Assert.areEqual(l.length, rp.weight, "left length doesn't match weight");
        Assert.areEqual(l, rp.left.value, "left doesn't match");
        Assert.areEqual(r, rp.right.value, "right doesn't match");
        Assert.areEqual(str.length, rp.length, "lengths don't match");
        Assert.areEqual(str, rp.toString(), "values don't match");
    },
    basicLength: function () {
        var str = "hello, my friend";
        var rp = new Rope(str);
        Assert.areEqual(str.length, rp.getLength());
    },
    twoLeafLength: function () {
        var l = "hello, ";
        var r = "my friend";
        var rp = new Rope(l, r);
        Assert.areEqual(l.length + r.length, rp.getLength());
    },
    threeLeafLength: function () {
        var a = "hello, ";
        var b = "my friend";
        var c = " it's been a long time";
        var rp = new Rope(new Rope(a, b), c);
        Assert.areEqual(a.length + b.length + c.length, rp.getLength());
    },
    fourLeafLength: function () {
        var a = "hello, ";
        var b = "my friend.";
        var c = " it's been a long time.";
        var d = " did you receive my package?";
        var rp = new Rope(new Rope(a, b), new Rope(c, d));
        Assert.areEqual(a.length
                + b.length
                + c.length
                + d.length, rp.getLength());
    },
    fourLeafWeight: function () {
        var a = "hello, ";
        var b = "my friend.";
        var c = " it's been a long time.";
        var d = " did you receive my package?";
        var rp = new Rope(new Rope(a, b), new Rope(c, d));
        Assert.areEqual(a.length + b.length, rp.weight, "unexpected weight");
    },
    leftLoadedLength: function () {
        var a = "hello, ";
        var b = "my friend.";
        var c = " it's been a long time.";
        var d = " did you receive my package?";
        var e = " i sent it last week.";
        var rp = new Rope(new Rope(new Rope(new Rope(a, b), c), d), e);
        Assert.areEqual(a.length
                + b.length
                + c.length
                + d.length
                + e.length, rp.getLength());
    },
    rightLoadedLength: function () {
        var a = "hello, ";
        var b = "my friend.";
        var c = " it's been a long time.";
        var d = " did you receive my package?";
        var e = " i sent it last week.";
        var rp = new Rope(a, new Rope(b, new Rope(c, new Rope(d, e))));
        Assert.areEqual(a.length
                + b.length
                + c.length
                + d.length
                + e.length, rp.getLength());
    },
    basicCharAt: function () {
        var str = "test string 1234";
        var rp = new Rope(str);
        var idx = Math.floor(str.length / 2);
        Assert.areEqual(str[idx], rp.charAt(idx), "characters don't match");
    },
    twoLeafCharAt1: function () {
        var a = "test string 1234";
        var b = "qwerty asplode";
        var rp = new Rope(a, b);
        var idx = Math.floor(a.length / 2);
        Assert.areEqual(a[idx], rp.charAt(idx), "characters don't match");
    },
    twoLeafCharAt2: function () {
        var a = "test string 1234";
        var b = "qwerty asplode";
        var rp = new Rope(a, b);
        var idx = Math.floor(b.length / 2);
        Assert.areEqual(b[idx], rp.charAt(a.length + idx), "characters don't match");
    },
    fourLeafCharAt1: function () {
        var a = "test string 1234";
        var b = "qwerty asplode";
        var c = "not really";
        var d = "okay, whatever";
        var rp = new Rope(new Rope(a, b), new Rope(c, d));
        var idx = Math.floor(a.length / 2);
        Assert.areEqual(a[idx], rp.charAt(idx), "characters don't match");
    },
    fourLeafCharAt2: function () {
        var a = "test string 1234";
        var b = "qwerty asplode";
        var c = "not really";
        var d = "okay, whatever";
        var rp = new Rope(new Rope(a, b), new Rope(c, d));
        var idx = Math.floor(b.length / 2);
        Assert.areEqual(b[idx], rp.charAt(a.length + idx), "characters don't match");
    },
    fourLeafCharAt3: function () {
        var a = "test string 1234";
        var b = "qwerty asplode";
        var c = "not really";
        var d = "okay, whatever";
        var rp = new Rope(new Rope(a, b), new Rope(c, d));
        var idx = Math.floor(c.length / 2);
        Assert.areEqual(c[idx], rp.charAt(a.length + b.length + idx), "characters don't match");
    },
    fourLeafCharAt4: function () {
        var a = "test string 1234";
        var b = "qwerty asplode";
        var c = "not really";
        var d = "okay, whatever";
        var rp = new Rope(new Rope(a, b), new Rope(c, d));
        var idx = Math.floor(d.length / 2);
        Assert.areEqual(d[idx], rp.charAt(a.length + b.length + c.length + idx), "characters don't match");
    },
    basicStringAppendLength: function () {
        var a = "asdf";
        var b = "qwer";
        var rp = new Rope(a);
        rp.concat(b);
        Assert.areEqual(a.length + b.length, rp.getLength(), "lengths doesn't match");
    },
    basicStringAppend: function () {
        var a = "asdf";
        var b = "qwer";
        var rp = new Rope(a);
        rp.concat(b);
        Assert.areEqual(a + b, rp.toString());
    },
    basicSplit1Length: function () {
        var str = "0123456789";
        var a = str.substring(0, 5);
        var b = str.substring(5);
        var rp1 = new Rope(str);
        var rp2 = rp1.split(5);
        Assert.areEqual(a.length, rp1.getLength());
    },
    basicSplit1Value: function () {
        var str = "0123456789";
        var a = str.substring(0, 5);
        var b = str.substring(5);
        var rp1 = new Rope(str);
        var rp2 = rp1.split(5);
        Assert.areEqual(a, rp1.substring(0, 5));
    },
    basicSplit2Length: function () {
        var str = "0123456789";
        var a = str.substring(0, 5);
        var b = str.substring(5);
        var rp1 = new Rope(str);
        var rp2 = rp1.split(5);
        Assert.areEqual(b.length, rp2.getLength());
    },
    complexSplit1: function () {
        var a = "asdfqer";
        var b = "1234";
        var c = "what the heck";
        var d = "ok, I think I get it";
        var e = "no time for teletubbies";
        var l = a.length + b.length + c.length + d.length + e.length;
        var rp1 = new Rope(new Rope(a, new Rope(b, c)), new Rope(d, e));
        var rp2 = rp1.split(5);
        Assert.areEqual(l - 5, rp2.getLength());
    },
    complexSplit2: function () {
        var a = "asdfqer";
        var b = "1234";
        var c = "what the heck";
        var d = "ok, I think I get it";
        var e = "no time for teletubbies";
        var l1 = a.length + b.length + c.length + d.length + e.length;
        var rp1 = new Rope(new Rope(a, new Rope(b, c)), new Rope(d, e));
        var rp2 = rp1.split(Math.floor(l1 / 2));
        Assert.areEqual(l1, rp1.getLength() + rp2.getLength());
    },
    basicDelete: function () {
        var str = "0123456789";
        var rp = new Rope(str);
        rp.delete(3, 5);
        Assert.areEqual(str.length - 2, rp.getLength());
    },
    basicDelete2: function () {
        var str = "0123456789";
        var rp = new Rope(str);
        rp.delete(3, 5);
        Assert.areEqual("01256789", rp.toString());
    },
    basicRebalance: function () {
        var str = "0123456789";
        var rp = new Rope(str);
        rp.rebalance(null, 1);
        Assert.areEqual(str.length, rp.getLength());
    },
    rebalanceZero: function () {
        var rp = new Rope("");
        rp.rebalance();
        Assert.areEqual(0, rp.getLength());
    }
};
consoleTest(Rope);


Grammar.tests = {
    captureOnlyAGroup: function () {
        var src = "function(){ a.b.c = \"asdf\"; }";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function (t) {
            return t.value;
        }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual("c", tokens[2].value, "token isn't right value");
        Assert.areEqual("members", tokens[2].type, "token types do not match");
    },
    aSimpleString: function () {
        var src = "\"a\"";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function (t) {
            return t.value;
        }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual("strings", tokens[0].type, "token types do not match");
    },
    twoStrings: function () {
        var src = "\"a\" b \"c\"";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function (t) {
            return t.value;
        }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual("strings", tokens[0].type, "0: token incorrect type");
        Assert.areEqual("regular", tokens[1].type, "1: token incorrect type");
        Assert.areEqual("strings", tokens[2].type, "2: token incorrect type");
    },
    singleLineBlockComment: function () {
        var src = "/* asdf one 2 three 4 */";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function (t) {
            return t.value;
        }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual("comments", tokens[0].type, "token types do not match");
    },
    multiLineBlockComment: function () {
        var src = "/*\n asdf one\n2 three 4\n*/";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function (t) {
            return t.value;
        }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual("comments", tokens[0].type, "token types do not match");
    },
    multipleMultiLineBlockComment: function () {
        var src = "/*\n asdf one\n2 three 4\n*/\nfunction(){\n/*\n asdf one\n2 three 4\n*/\n}";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function (t) {
            return t.value;
        }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual("comments", tokens[0].type, "0: token types do not match");
        Assert.areEqual("comments", tokens[4].type, "4: token types do not match." + tokens[5].value);
    },
    bigTest: function () {
        var src = "function Hello (){\n" +
                "    // a comment\n" +
                "    function MyFunc ( ) {\n" +
                "        var x = \"Whatever\";\n" +
                "        console.log(x + \" World\");\n" +
                "        /*\n" +
                "          a longer comment\n" +
                "        */\n" +
                "    }\n" +
                "}";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function (t) {
            return t.value;
        }).join("");
        Assert.areEqual(src, res);
    }
};

consoleTest(Grammar);
consoleTest(TextBuffer);