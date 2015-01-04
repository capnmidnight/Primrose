/*
 * A Rope data structure is a means of storing a collection of characters 
 * that makes insertions and deletions faster than a regular array would do.
 * 
 * So named because a Rope is composed of many Strings
 * 
 * More info: http://en.wikipedia.org/wiki/Rope_(data_structure)
 * 
 * Parameters:
 *  str_or_left: 
 *      A string when used alone, the value of the Rope being created.
 *      A Rope when used with opt_right, the left node of the Rope.
 *  (optional) opt_right:
 *      when not null and not undefined, a Rope to use as the right node.
*/
function Rope(str_or_left, opt_right){
    if(opt_right !== null && opt_right !== undefined){
        if(!(str_or_left instanceof Rope)){
            str_or_left = new Rope(str_or_left);
        }
        if(!(opt_right instanceof Rope)){
            opt_right = new Rope(opt_right);
        }
        this.value = null;
        this.left = str_or_left;
        this.right = opt_right;
    }
    else{
        this.value = str_or_left;
        this.left = null;
        this.right = null;
    }
    if(str_or_left instanceof Rope){
        this.weight = str_or_left.length();
    }
    else{
        this.weight = str_or_left.length;
    }
}

Rope.tests = {
    leafWeightMatchesLength: function(){
        var str = "hello, world";
        var rp = new Rope(str);
        Assert.areEqual(str.length, rp.weight, "length doesn't match weight");
    },
    leafWeightMatchesValue: function(){
        var str = "hello, world";
        var rp = new Rope(str);
        Assert.areEqual(str, rp.value, "values don't match");
    },
    basicRootMatchesLength: function(){
        var l = "hello,";
        var r = " world";
        var rp = new Rope(l, r);
        Assert.areEqual(l.length, rp.weight, "left length doesn't match weight");
    },
    basicRootMatchesLeft: function(){
        var l = "hello,";
        var r = " world";
        var rp = new Rope(l, r);
        Assert.areEqual(l, rp.left.value, "left doesn't match");
    },
    basicRootMatchesRight: function(){
        var l = "hello,";
        var r = " world";
        var rp = new Rope(l, r);
        Assert.areEqual(r, rp.right.value, "right doesn't match");
    }
};

/*
 * Recurses through the Rope to figure out the length of the full
 * string contained. This requires walking down the right-side of the tree,
 * because we already know the length of the left-side of the tree (the 'weight')
 */
Rope.prototype.length = function(){
    var cur = this;
    var len = 0;
    while(cur !== null && cur !== undefined){
        len += cur.weight;
        cur = cur.right;
    }
    return len;
};

Rope.tests.basicLength = function(){
    var str = "hello, my friend";
    var rp = new Rope(str);
    Assert.areEqual(str.length, rp.length());
};

Rope.tests.twoLeafLength = function(){
    var l = "hello, ";
    var r = "my friend";
    var rp = new Rope(l, r);
    Assert.areEqual(l.length + r.length, rp.length());
};

Rope.tests.threeLeafLength = function(){
    var a = "hello, ";
    var b = "my friend";
    var c = " it's been a long time";
    var rp = new Rope(new Rope(a, b), c);
    Assert.areEqual(a.length + b.length + c.length, rp.length());
};

Rope.tests.fourLeafLength = function(){
    var a = "hello, ";
    var b = "my friend.";
    var c = " it's been a long time.";
    var d = " did you receive my package?";
    var rp = new Rope(new Rope(a, b), new Rope(c, d));
    Assert.areEqual(a.length 
            + b.length 
            + c.length
            + d.length, rp.length());
};

Rope.tests.fourLeafWeight = function(){
    var a = "hello, ";
    var b = "my friend.";
    var c = " it's been a long time.";
    var d = " did you receive my package?";
    var rp = new Rope(new Rope(a, b), new Rope(c, d));
    Assert.areEqual(a.length + b.length, rp.weight, "unexpected weight");
};

Rope.tests.leftLoadedLength = function(){
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
            + e.length, rp.length());
};

Rope.tests.rightLoadedLength = function(){
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
            + e.length, rp.length());
};

/*
 * Find a character by index in the Rope
 */
Rope.prototype.charAt = function(i){
    var cur = this;
    // true recursion is defective in JavaScript
    while(cur !== null && cur !== undefined){
        if(i > cur.weight){
            i -= cur.weight;
            cur = cur.right;
        }
        else if(cur.left !== null){
            cur = cur.left;
        }
        else{
            return cur.value[i];
        }
    }
};

Rope.tests.basicCharAt = function(){
    var str = "test string 1234";
    var rp = new Rope(str);
    var idx = Math.floor(str.length / 2);
    Assert.areEqual(str[idx], rp.charAt(idx), "characters don't match");
};

Rope.tests.twoLeafCharAt1 = function(){
    var a = "test string 1234";
    var b = "qwerty asplode";
    var rp = new Rope(a, b);
    var idx = Math.floor(a.length / 2);
    Assert.areEqual(a[idx], rp.charAt(idx), "characters don't match");
};

Rope.tests.twoLeafCharAt2 = function(){
    var a = "test string 1234";
    var b = "qwerty asplode";
    var rp = new Rope(a, b);
    var idx = Math.floor(b.length / 2);
    Assert.areEqual(b[idx], rp.charAt(a.length + idx), "characters don't match");
};

Rope.tests.fourLeafCharAt1 = function(){
    var a = "test string 1234";
    var b = "qwerty asplode";
    var c = "not really";
    var d = "okay, whatever";
    var rp = new Rope(new Rope(a, b), new Rope(c, d));
    var idx = Math.floor(a.length / 2);
    Assert.areEqual(a[idx], rp.charAt(idx), "characters don't match");
};

Rope.tests.fourLeafCharAt2 = function(){
    var a = "test string 1234";
    var b = "qwerty asplode";
    var c = "not really";
    var d = "okay, whatever";
    var rp = new Rope(new Rope(a, b), new Rope(c, d));
    var idx = Math.floor(b.length / 2);
    Assert.areEqual(b[idx], rp.charAt(a.length + idx), "characters don't match");
};

Rope.tests.fourLeafCharAt3 = function(){
    var a = "test string 1234";
    var b = "qwerty asplode";
    var c = "not really";
    var d = "okay, whatever";
    var rp = new Rope(new Rope(a, b), new Rope(c, d));
    var idx = Math.floor(c.length / 2);
    Assert.areEqual(c[idx], rp.charAt(a.length + b.length + idx), "characters don't match");
};

Rope.tests.fourLeafCharAt4 = function(){
    var a = "test string 1234";
    var b = "qwerty asplode";
    var c = "not really";
    var d = "okay, whatever";
    var rp = new Rope(new Rope(a, b), new Rope(c, d));
    var idx = Math.floor(d.length / 2);
    Assert.areEqual(d[idx], rp.charAt(a.length + b.length + c.length + idx), "characters don't match");
};

/*
 * This is supposed to be faster than an array of characters
 */
Rope.prototype.concat = function(str_or_rope){
    if(!(str_or_rope instanceof Rope)){
        str_or_rope = new Rope(str_or_rope);
    }
    if(this.value === null){
        this.left = new Rope(this.left, this.right);
        this.weight += this.right.length();
    }
    else{
        this.left = new Rope(this.value);
        this.value = null;
    }
    this.right = str_or_rope;
    this.rebalance();
};

Rope.tests.basicStringAppendLength = function(){
    var a = "asdf";
    var b = "qwer";
    var rp = new Rope(a);
    rp.concat(b);
    Assert.areEqual(a.length + b.length, rp.length(), "lengths doesn't match");
};

Rope.tests.basicStringAppendLeft = function(){
    var a = "asdf";
    var b = "qwer";
    var rp = new Rope(a);
    rp.concat(b);
    Assert.areEqual(a, rp.left.value, "left doesn't match");
};

Rope.tests.basicStringAppendRight = function(){
    var a = "asdf";
    var b = "qwer";
    var rp = new Rope(a);
    rp.concat(b);
    Assert.areEqual(b, rp.right.value, "right doesn't match");
};

/*
 * Cuts the Rope. Leaves this Rope as everything to the left of i, returns
 * a Rope that is everything to the right of i.
 */
Rope.prototype.split = function(i){
    var cur = this;
    var stack = [];
    // true recursion is defective in JavaScript
    while(cur !== null && cur !== undefined){
        if(i > cur.weight){
            i -= cur.weight;
            cur = cur.right;
        }
        else if(cur.left !== null){
            stack.push(cur.right);
            cur.value = cur.left.value;
            cur.weight = cur.left.weight;
            cur.right = cur.left.right;
            cur.left.right = null;
            var n = cur.left.left;
            cur.left.left = null;
            cur.left = n;
        }
        else{
            var sub = cur.value.substring(i);
            stack.push(new Rope(sub));
            cur.value = cur.value.substring(0, i);
            cur.weight = i;
            cur = null;
        }
    }
    while(stack.length > 0){
        if(cur !== null){
            cur = new Rope(cur, stack.pop());
        }
        else{
            cur = stack.pop();
        }
    }
    this.rebalance();
    cur.rebalance();
    return cur;
};

Rope.tests.basicSplit1Length = function(){
    var str = "0123456789";
    var a = str.substring(0, 5);
    var b = str.substring(5);
    var rp1 = new Rope(str);
    var rp2 = rp1.split(5);
    Assert.areEqual(a.length, rp1.length());
};

Rope.tests.basicSplit1Value = function(){
    var str = "0123456789";
    var a = str.substring(0, 5);
    var b = str.substring(5);
    var rp1 = new Rope(str);
    var rp2 = rp1.split(5);
    Assert.areEqual(a, rp1.substring(0, 5));
};

Rope.tests.basicSplit2Length = function(){
    var str = "0123456789";
    var a = str.substring(0, 5);
    var b = str.substring(5);
    var rp1 = new Rope(str);
    var rp2 = rp1.split(5);
    Assert.areEqual(b.length, rp2.length());
};

Rope.tests.complexSplit1 = function(){
    var a = "asdfqer";
    var b = "1234";
    var c = "what the heck";
    var d = "ok, I think I get it";
    var e = "no time for teletubbies";
    var l = a.length + b.length + c.length + d.length + e.length;
    var rp1 = new Rope(new Rope(a, new Rope(b, c)), new Rope(d, e));
    var rp2 = rp1.split(5);
    Assert.areEqual(l - 5, rp2.length());
};

Rope.tests.complexSplit2 = function(){
    var a = "asdfqer";
    var b = "1234";
    var c = "what the heck";
    var d = "ok, I think I get it";
    var e = "no time for teletubbies";
    var l1 = a.length + b.length + c.length + d.length + e.length;
    var rp1 = new Rope(new Rope(a, new Rope(b, c)), new Rope(d, e));
    var rp2 = rp1.split(Math.floor(l1/2));
    Assert.areEqual(l1, rp1.length() + rp2.length());
};

Rope.prototype.delete = function(i, j){
    var right = this.split(j);
    this.split(i); // discard the middle
    this.concat(right);
    this.weight = this.left.length();
};

Rope.tests.basicDelete = function(){
    var str = "0123456789";
    var rp = new Rope(str);
    rp.delete(3, 5);
    Assert.areEqual(str.length - 2, rp.length());
};

Rope.tests.basicDelete2 = function(){
    var str = "0123456789";
    var rp = new Rope(str);
    rp.delete(3, 5);
    Assert.areEqual("01256789", rp.toString());
};

Rope.prototype.insert = function(i, str_or_rope){
    if(!(str_or_rope instanceof Rope)){
        str_or_rope = new Rope(str_or_rope);
    }
    var right = this.split(i);
    this.concat(str_or_rope);
    this.concat(right);
};

Rope.prototype.toString = function(){
    var str = "";
    var cur = this;
    var stack = [];
    // true recursion is defective in JavaScript
    while(cur !== null && cur !== undefined){
        if(cur.left !== null){
            stack.push(cur.right);
            cur = cur.left;
        }
        else{
            str += cur.value;
            cur = stack.pop();
        }
    }
    return str;
};

Rope.prototype.substring = function(i, j){
    var str = "";
    var cur = this;
    var stack = [];
    // true recursion is defective in JavaScript
    while(cur !== null && cur !== undefined){
        if(i > cur.weight){
            if(j > 0){
                // this simplified logic works because javascript doesn't care 
                // about negative values for substring operations.
                i -= cur.weight;
                j -= cur.weight;
                cur = cur.right;
            }
        }
        else if(cur.left !== null){
            stack.push(cur.right);
            cur = cur.left;
        }
        else{
            // this simplified logic works because javascript doesn't care 
            // about values longer than the string length for substring operations.
            var sub = cur.value.substring(i, j);
            str += sub;
            i = 0;
            j -= sub.length;
            cur = stack.pop();
        }
    }
    return str;
};

Rope.BALANCE_SIZE = 100;

/*
 * Ropes are binary trees, and binary trees are more efficient when they
 * are balanced.
 */
Rope.prototype.rebalance = function(){
    // get the whole string
    var str = this.toString();
    
    // delete all of the links between the old Rope nodes
    var stack = [this];
    while(stack.length > 0){
        var cur = stack.pop();
        if(cur.left !== null){
            stack.push(cur.right);
            stack.push(cur.left);
            cur.left = null;
            cur.right = null;
        }
    }
    
    // figure out the dimensions of the new leaves
    var leafCount = Math.ceil(str.length / Rope.BALANCE_SIZE);
    var leafLen = str.length / leafCount;
    
    // split the whole string into roughtly equally sized leaves
    var leaves = [];
    for(var i = 0; i < leafCount; ++i){
        leaves.push(str.substring(
                Math.floor(i * leafLen), 
                Math.floor((i + 1) * leafLen)));
    }
    
    // rebuild each layer from the bottom up
    var nextLeaves = [];
    while(leaves.length >= 2){
        for(var i = 0; i < leaves.length; i += 2){
            nextLeaves.push(new Rope(leaves[i], leaves[i + 1]));
        }
        // an odd number of nodes will leave a straggler behind. Just append
        // it to the list of nodes for the next level, and it will get picked
        // back up in the right order.
        if((leaves.length % 2) === 1){
            nextLeaves.push(leaves[leaves.length - 1]);
        }
        leaves = nextLeaves;
    }
    
    // overwrite this Rope with the last rope that was left
    var rp = leaves[0];
    this.value = rp.value;
    this.weight = rp.weight;
    this.left = rp.left;
    this.right = rp.right;
    
    // and remove the links so we don't hurt the reference-counting GC.
    rp.left = null;
    rp.right = null;
};