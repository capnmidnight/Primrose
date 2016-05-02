"use strict";

Primrose.Text.Rule = function () {
  "use strict";

  pliny.class({
    parent: "Primrose.Text",
    name: "Rule",
    description: "| [under construction]"
  });
  function Rule(name, test) {
    this.name = name;
    this.test = test;
  }

  Rule.prototype.carveOutMatchedToken = function (tokens, j) {
    var token = tokens[j];
    if (token.type === "regular") {
      var res = this.test.exec(token.value);
      if (res) {
        // Only use the last group that matches the regex, to allow for more
        // complex regexes that can match in special contexts, but not make
        // the context part of the token.
        var midx = res[res.length - 1],
            start = res.input.indexOf(midx),
            end = start + midx.length;
        if (start === 0) {
          // the rule matches the start of the token
          token.type = this.name;
          if (end < token.value.length) {
            // but not the end
            var next = token.splitAt(end);
            next.type = "regular";
            tokens.splice(j + 1, 0, next);
          }
        } else {
          // the rule matches from the middle of the token
          var mid = token.splitAt(start);
          if (midx.length < mid.value.length) {
            // but not the end
            var right = mid.splitAt(midx.length);
            tokens.splice(j + 1, 0, right);
          }
          mid.type = this.name;
          tokens.splice(j + 1, 0, mid);
        }
      }
    }
  };

  return Rule;
}();