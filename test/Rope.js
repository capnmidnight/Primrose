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
function Rope(str_or_left, opt_right) {
    if (opt_right !== null && opt_right !== undefined) {
        if (!(str_or_left instanceof Rope)) {
            str_or_left = new Rope(str_or_left);
        }
        if (!(opt_right instanceof Rope)) {
            opt_right = new Rope(opt_right);
        }
        this.value = null;
        this.left = str_or_left;
        this.right = opt_right;
        this.length = opt_right.length;
    }
    else {
        this.value = str_or_left;
        this.left = null;
        this.right = null;
        this.length = 0;
    }
    if (str_or_left instanceof Rope) {
        this.weight = str_or_left.getLength();
    }
    else {
        this.weight = str_or_left.length;
    }
    this.length += this.weight;
}

/*
 * Recurses through the Rope to figure out the length of the full
 * string contained. This requires walking down the right-side of the tree,
 * because we already know the length of the left-side of the tree (the 'weight')
 */
Rope.prototype.getLength = function () {
    var cur = this;
    var len = 0;
    while (cur !== null && cur !== undefined) {
        len += cur.weight;
        cur = cur.right;
    }
    return len;
};
/*
 * Find a character by index in the Rope
 */
Rope.prototype.charAt = function (i) {
    var cur = this;
    // true recursion is defective in JavaScript
    while (cur !== null && cur !== undefined) {
        if (i > cur.weight) {
            i -= cur.weight;
            cur = cur.right;
        }
        else if (cur.left !== null) {
            cur = cur.left;
        }
        else {
            return cur.value[i];
        }
    }
};

/*
 * This is supposed to be faster than an array of characters
 */
Rope.prototype.concat = function (str_or_rope) {
    if (!(str_or_rope instanceof Rope)) {
        str_or_rope = new Rope(str_or_rope);
    }
    if (this.value === null) {
        this.left = new Rope(this.left, this.right);
        this.weight += this.right.getLength();
    }
    else {
        this.left = new Rope(this.value);
        this.value = null;
    }
    this.right = str_or_rope;
    this.rebalance();
};
/*
 * Cuts the Rope. Leaves this Rope as everything to the left of i, returns
 * a Rope that is everything to the right of i.
 */
Rope.prototype.split = function (i) {
    var cur = this;
    var stack = [];
    // true recursion is defective in JavaScript
    while (cur !== null && cur !== undefined) {
        if (i > cur.weight) {
            i -= cur.weight;
            cur = cur.right;
        }
        else if (cur.left !== null) {
            stack.push(cur.right);
            cur.value = cur.left.value;
            cur.weight = cur.left.weight;
            cur.right = cur.left.right;
            cur.left.right = null;
            var n = cur.left.left;
            cur.left.left = null;
            cur.left = n;
        }
        else {
            var sub = cur.value.substring(i);
            stack.push(new Rope(sub));
            cur.value = cur.value.substring(0, i);
            cur.weight = i;
            cur = null;
        }
    }
    while (stack.length > 0) {
        if (cur !== null) {
            cur = new Rope(cur, stack.pop());
        }
        else {
            cur = stack.pop();
        }
    }
    this.rebalance();
    cur.rebalance();
    return cur;
};

Rope.prototype.delete = function (i, j) {
    var right = this.split(j);
    this.split(i); // discard the middle
    this.concat(right);
};

Rope.prototype.insert = function (i, str_or_rope) {
    if (!(str_or_rope instanceof Rope)) {
        str_or_rope = new Rope(str_or_rope);
    }
    var right = this.split(i);
    this.concat(str_or_rope);
    this.concat(right);
};
Rope.prototype.toString = function () {
    var str = "";
    var cur = this;
    var stack = [];
    // true recursion is defective in JavaScript
    while (cur !== null && cur !== undefined) {
        if (cur.left !== null) {
            stack.push(cur.right);
            cur = cur.left;
        }
        else {
            str += cur.value;
            cur = stack.pop();
        }
    }
    return str;
};

Rope.prototype.substring = function (i, j) {
    var str = "";
    var cur = this;
    var stack = [];
    // true recursion is defective in JavaScript
    while (cur !== null && cur !== undefined) {
        if (i > cur.weight) {
            if (j > 0) {
                // this simplified logic works because javascript doesn't care 
                // about negative values for substring operations.
                i -= cur.weight;
                j -= cur.weight;
                cur = cur.right;
            }
        }
        else if (cur.left !== null) {
            stack.push(cur.right);
            cur = cur.left;
        }
        else {
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
Rope.prototype.rebalance = function (str, opt_size) {
    // get the whole string
    var str = str || this.toString();
    opt_size = opt_size || Rope.BALANCE_SIZE;
    // delete all of the links between the old Rope nodes
    var stack = [this];
    while (stack.length > 0) {
        var cur = stack.pop();
        if (cur.left !== null) {
            stack.push(cur.right);
            stack.push(cur.left);
            cur.left = null;
            cur.right = null;
        }
    }

    if (str.length === 0) {
        this.value = "";
    }
    else {
        // figure out the dimensions of the new leaves
        var leafCount = Math.ceil(str.length / opt_size);
        var leafLen = str.length / leafCount;
        // split the whole string into roughtly equally sized leaves
        var leaves = [];
        for (var i = 0; i < leafCount; ++i) {
            var sub = str.substring(
                    Math.floor(i * leafLen),
                    Math.floor((i + 1) * leafLen));
            leaves.push(new Rope(sub));
        }
        // rebuild each layer from the bottom up
        while (leaves.length >= 2) {
            var nextLeaves = [];
            for (var i = 0; i < leaves.length - 1; i += 2) {
                nextLeaves.push(new Rope(leaves[i], leaves[i + 1]));
            }
            // an odd number of nodes will leave a straggler behind. Just append
            // it to the list of nodes for the next level, and it will get picked
            // back up in the right order.
            if ((leaves.length % 2) === 1) {
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
    }
};