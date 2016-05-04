Primrose.Text.Grammars.Basic = (function () {

  pliny.value({
    parent: "Primrose.Text.Grammars",
    name: "Basic",
    description: "| [under construction]"
  });
  var basicGrammar = new Primrose.Text.Grammar("BASIC",
    // Grammar rules are applied in the order they are specified.
    [
      // Text needs at least the newlines token, or else every line will attempt to render as a single line and the line count won't work.
      ["newlines", /(?:\r\n|\r|\n)/],
      // BASIC programs used to require the programmer type in her own line numbers. The start at the beginning of the line.
      ["lineNumbers", /^\d+\s+/],
      // Comments were lines that started with the keyword "REM" (for REMARK) and ran to the end of the line. They did not have to be numbered, because they were not executable and were stripped out by the interpreter.
      ["startLineComments", /^REM\s/],
      // Both double-quoted and single-quoted strings were not always supported, but in this case, I'm just demonstrating how it would be done for both.
      ["strings", /"(?:\\"|[^"])*"/],
      ["strings", /'(?:\\'|[^'])*'/],
      // Numbers are an optional dash, followed by a optional digits, followed by optional period, followed by 1 or more required digits. This allows us to match both integers and decimal numbers, both positive and negative, with or without leading zeroes for decimal numbers between (-1, 1).
      ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
      // Keywords are really just a list of different words we want to match, surrounded by the "word boundary" selector "\b".
      ["keywords",
        /\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\b/
      ],
      // Sometimes things we want to treat as keywords have different meanings in different locations. We can specify rules for tokens more than once.
      ["keywords", /^DEF FN/],
      // These are all treated as mathematical operations.
      ["operators",
        /(?:\+|;|,|-|\*\*|\*|\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\(|\)|\[|\])/
      ],
      // Once everything else has been matched, the left over blocks of words are treated as variable and function names.
      ["identifiers", /\w+\$?/]
    ]);

  var oldTokenize = basicGrammar.tokenize;
  basicGrammar.tokenize = function (code) {
    return oldTokenize.call(this, code.toUpperCase());
  };

  basicGrammar.interpret = function (sourceCode, input, output, errorOut, next,
    clearScreen, loadFile, done) {
    var tokens = this.tokenize(sourceCode),
      EQUAL_SIGN = new Primrose.Text.Token("=", "operators"),
      counter = 0,
      isDone = false,
      program = {},
      lineNumbers = [],
      currentLine = [],
      lines = [currentLine],
      data = [],
      returnStack = [],
      forLoopCounters = {},
      dataCounter = 0,
      state = {
        INT: function (v) {
          return v | 0;
        },
        RND: function () {
          return Math.random();
        },
        CLK: function () {
          return Date.now() / 3600000;
        },
        LEN: function (id) {
          return id.length;
        },
        LINE: function () {
          return lineNumbers[counter];
        },
        TAB: function (v) {
          var str = "";
          for (var i = 0; i < v; ++i) {
            str += " ";
          }
          return str;
        },
        POW: function (a, b) {
          return Math.pow(a, b);
        }
      };

    function toNum(ln) {
      return new Primrose.Text.Token(ln.toString(), "numbers");
    }

    function toStr(str) {
      return new Primrose.Text.Token("\"" + str.replace("\n", "\\n")
        .replace("\"", "\\\"") + "\"", "strings");
    }

    var tokenMap = {
      "OR": "||",
      "AND": "&&",
      "NOT": "!",
      "MOD": "%",
      "<>": "!="
    };

    while (tokens.length > 0) {
      var token = tokens.shift();
      if (token.type === "newlines") {
        currentLine = [];
        lines.push(currentLine);
      }
      else if (token.type !== "regular" && token.type !== "comments") {
        token.value = tokenMap[token.value] || token.value;
        currentLine.push(token);
      }
    }

    for (var i = 0; i < lines.length; ++i) {
      var line = lines[i];
      if (line.length > 0) {
        var lastLine = lineNumbers[lineNumbers.length - 1];
        var lineNumber = line.shift();

        if (lineNumber.type !== "lineNumbers") {
          line.unshift(lineNumber);

          if (lastLine === undefined) {
            lastLine = -1;
          }

          lineNumber = toNum(lastLine + 1);
        }

        lineNumber = parseFloat(lineNumber.value);
        if (lastLine && lineNumber <= lastLine) {
          throw new Error("expected line number greater than " + lastLine +
            ", but received " + lineNumber + ".");
        }
        else if (line.length > 0) {
          lineNumbers.push(lineNumber);
          program[lineNumber] = line;
        }
      }
    }


    function process(line) {
      if (line && line.length > 0) {
        var op = line.shift();
        if (op) {
          if (commands.hasOwnProperty(op.value)) {
            return commands[op.value](line);
          }
          else if (!isNaN(op.value)) {
            return setProgramCounter([op]);
          }
          else if (state[op.value] ||
            (line.length > 0 && line[0].type === "operators" &&
              line[0].value === "=")) {
            line.unshift(op);
            return translate(line);
          }
          else {
            error("Unknown command. >>> " + op.value);
          }
        }
      }
      return pauseBeforeComplete();
    }

    function error(msg) {
      errorOut("At line " + lineNumbers[counter] + ": " + msg);
    }

    function getLine(i) {
      var lineNumber = lineNumbers[i];
      var line = program[lineNumber];
      return line && line.slice();
    }

    function evaluate(line) {
      var script = "";
      for (var i = 0; i < line.length; ++i) {
        var t = line[i];
        var nest = 0;
        if (t.type === "identifiers" &&
          typeof state[t.value] !== "function" &&
          i < line.length - 1 &&
          line[i + 1].value === "(") {
          for (var j = i + 1; j < line.length; ++j) {
            var t2 = line[j];
            if (t2.value === "(") {
              if (nest === 0) {
                t2.value = "[";
              }
              ++nest;
            }
            else if (t2.value === ")") {
              --nest;
              if (nest === 0) {
                t2.value = "]";
              }
            }
            else if (t2.value === "," && nest === 1) {
              t2.value = "][";
            }

            if (nest === 0) {
              break;
            }
          }
        }
        script += t.value;
      }
      //with ( state ) { // jshint ignore:line
      try {
        return eval(script); // jshint ignore:line
      }
      catch (exp) {
        console.error(exp);
        console.debug(line.join(", "));
        console.error(script);
        error(exp.message + ": " + script);
      }
      //}
    }

    function declareVariable(line) {
      var decl = [],
        decls = [decl],
        nest = 0,
        i;
      for (i = 0; i < line.length; ++i) {
        var t = line[i];
        if (t.value === "(") {
          ++nest;
        }
        else if (t.value === ")") {
          --nest;
        }
        if (nest === 0 && t.value === ",") {
          decl = [];
          decls.push(decl);
        }
        else {
          decl.push(t);
        }
      }
      for (i = 0; i < decls.length; ++i) {
        decl = decls[i];
        var id = decl.shift();
        if (id.type !== "identifiers") {
          error("Identifier expected: " + id.value);
        }
        else {
          var val = null,
            j;
          id = id.value;
          if (decl[0].value === "(" && decl[decl.length - 1].value === ")") {
            var sizes = [];
            for (j = 1; j < decl.length - 1; ++j) {
              if (decl[j].type === "numbers") {
                sizes.push(decl[j].value | 0);
              }
            }
            if (sizes.length === 0) {
              val = [];
            }
            else {
              val = new Array(sizes[0]);
              var queue = [val];
              for (j = 1; j < sizes.length; ++j) {
                var size = sizes[j];
                for (var k = 0,
                  l = queue.length; k < l; ++k) {
                  var arr = queue.shift();
                  for (var m = 0; m < arr.length; ++m) {
                    arr[m] = new Array(size);
                    if (j < sizes.length - 1) {
                      queue.push(arr[m]);
                    }
                  }
                }
              }
            }
          }
          state[id] = val;
          return true;
        }
      }
    }

    function print(line) {
      var endLine = "\n";
      var nest = 0;
      line = line.map(function (t, i) {
        t = t.clone();
        if (t.type === "operators") {
          if (t.value === ",") {
            if (nest === 0) {
              t.value = "+ \", \" + ";
            }
          }
          else if (t.value === ";") {
            t.value = "+ \" \"";
            if (i < line.length - 1) {
              t.value += " + ";
            }
            else {
              endLine = "";
            }
          }
          else if (t.value === "(") {
            ++nest;
          }
          else if (t.value === ")") {
            --nest;
          }
        }
        return t;
      });
      var txt = evaluate(line);
      if (txt === undefined) {
        txt = "";
      }
      output(txt + endLine);
      return true;
    }

    function setProgramCounter(line) {
      var lineNumber = parseFloat(evaluate(line));
      counter = -1;
      while (counter < lineNumbers.length - 1 &&
        lineNumbers[counter + 1] < lineNumber) {
        ++counter;
      }

      return true;
    }

    function checkConditional(line) {
      var thenIndex = -1,
        elseIndex = -1,
        i;
      for (i = 0; i < line.length; ++i) {
        if (line[i].type === "keywords" && line[i].value === "THEN") {
          thenIndex = i;
        }
        else if (line[i].type === "keywords" && line[i].value === "ELSE") {
          elseIndex = i;
        }
      }
      if (thenIndex === -1) {
        error("Expected THEN clause.");
      }
      else {
        var condition = line.slice(0, thenIndex);
        for (i = 0; i < condition.length; ++i) {
          var t = condition[i];
          if (t.type === "operators" && t.value === "=") {
            t.value = "==";
          }
        }
        var thenClause,
          elseClause;
        if (elseIndex === -1) {
          thenClause = line.slice(thenIndex + 1);
        }
        else {
          thenClause = line.slice(thenIndex + 1, elseIndex);
          elseClause = line.slice(elseIndex + 1);
        }
        if (evaluate(condition)) {
          return process(thenClause);
        }
        else if (elseClause) {
          return process(elseClause);
        }
      }

      return true;
    }

    function pauseBeforeComplete() {
      output("PROGRAM COMPLETE - PRESS RETURN TO FINISH.");
      input(function () {
        isDone = true;
        if (done) {
          done();
        }
      });
      return false;
    }

    function labelLine(line) {
      line.push(EQUAL_SIGN);
      line.push(toNum(lineNumbers[counter]));
      return translate(line);
    }

    function waitForInput(line) {
      var toVar = line.pop();
      if (line.length > 0) {
        print(line);
      }
      input(function (str) {
        str = str.toUpperCase();
        var valueToken = null;
        if (!isNaN(str)) {
          valueToken = toNum(str);
        }
        else {
          valueToken = toStr(str);
        }
        evaluate([toVar, EQUAL_SIGN, valueToken]);
        if (next) {
          next();
        }
      });
      return false;
    }

    function onStatement(line) {
      var idxExpr = [],
        idx = null,
        targets = [];
      try {
        while (line.length > 0 &&
          (line[0].type !== "keywords" ||
            line[0].value !== "GOTO")) {
          idxExpr.push(line.shift());
        }

        if (line.length > 0) {
          line.shift(); // burn the goto;

          for (var i = 0; i < line.length; ++i) {
            var t = line[i];
            if (t.type !== "operators" ||
              t.value !== ",") {
              targets.push(t);
            }
          }

          idx = evaluate(idxExpr) - 1;

          if (0 <= idx && idx < targets.length) {
            return setProgramCounter([targets[idx]]);
          }
        }
      }
      catch (exp) {
        console.error(exp);
      }
      return true;
    }

    function gotoSubroutine(line) {
      returnStack.push(toNum(lineNumbers[counter + 1]));
      return setProgramCounter(line);
    }

    function setRepeat() {
      returnStack.push(toNum(lineNumbers[counter]));
      return true;
    }

    function conditionalReturn(cond) {
      var ret = true;
      var val = returnStack.pop();
      if (val && cond) {
        ret = setProgramCounter([val]);
      }
      return ret;
    }

    function untilLoop(line) {
      var cond = !evaluate(line);
      return conditionalReturn(cond);
    }

    function findNext(str) {
      for (i = counter + 1; i < lineNumbers.length; ++i) {
        var l = getLine(i);
        if (l[0].value === str) {
          return i;
        }
      }
      return lineNumbers.length;
    }

    function whileLoop(line) {
      var cond = evaluate(line);
      if (!cond) {
        counter = findNext("WEND");
      }
      else {
        returnStack.push(toNum(lineNumbers[counter]));
      }
      return true;
    }

    var FOR_LOOP_DELIMS = ["=", "TO", "STEP"];

    function forLoop(line) {
      var n = lineNumbers[counter];
      var varExpr = [];
      var fromExpr = [];
      var toExpr = [];
      var skipExpr = [];
      var arrs = [varExpr, fromExpr, toExpr, skipExpr];
      var a = 0;
      var i = 0;
      for (i = 0; i < line.length; ++i) {
        var t = line[i];
        if (t.value === FOR_LOOP_DELIMS[a]) {
          if (a === 0) {
            varExpr.push(t);
          }
          ++a;
        }
        else {
          arrs[a].push(t);
        }
      }

      var skip = 1;
      if (skipExpr.length > 0) {
        skip = evaluate(skipExpr);
      }

      if (forLoopCounters[n] === undefined) {
        forLoopCounters[n] = evaluate(fromExpr);
      }

      var end = evaluate(toExpr);
      var cond = forLoopCounters[n] <= end;
      if (!cond) {
        delete forLoopCounters[n];
        counter = findNext("NEXT");
      }
      else {
        varExpr.push(toNum(forLoopCounters[n]));
        process(varExpr);
        forLoopCounters[n] += skip;
        returnStack.push(toNum(lineNumbers[counter]));
      }
      return true;
    }

    function stackReturn() {
      return conditionalReturn(true);
    }

    function loadCodeFile(line) {
      loadFile(evaluate(line)).then(next);
      return false;
    }

    function noop() {
      return true;
    }

    function loadData(line) {
      while (line.length > 0) {
        var t = line.shift();
        if (t.type !== "operators") {
          data.push(t.value);
        }
      }
      return true;
    }

    function readData(line) {
      if (data.length === 0) {
        var dataLine = findNext("DATA");
        process(getLine(dataLine));
      }
      var value = data[dataCounter];
      ++dataCounter;
      line.push(EQUAL_SIGN);
      line.push(toNum(value));
      return translate(line);
    }

    function restoreData() {
      dataCounter = 0;
      return true;
    }

    function defineFunction(line) {
      var name = line.shift().value;
      var signature = "";
      var body = "";
      var fillSig = true;
      for (var i = 0; i < line.length; ++i) {
        var t = line[i];
        if (t.type === "operators" && t.value === "=") {
          fillSig = false;
        }
        else if (fillSig) {
          signature += t.value;
        }
        else {
          body += t.value;
        }
      }
      name = "FN" + name;
      var script = "(function " + name + signature + "{ return " + body +
        "; })";
      state[name] = eval(script); // jshint ignore:line
      return true;
    }

    function translate(line) {
      evaluate(line);
      return true;
    }

    var commands = {
      DIM: declareVariable,
      LET: translate,
      PRINT: print,
      GOTO: setProgramCounter,
      IF: checkConditional,
      INPUT: waitForInput,
      END: pauseBeforeComplete,
      STOP: pauseBeforeComplete,
      REM: noop,
      "'": noop,
      CLS: clearScreen,
      ON: onStatement,
      GOSUB: gotoSubroutine,
      RETURN: stackReturn,
      LOAD: loadCodeFile,
      DATA: loadData,
      READ: readData,
      RESTORE: restoreData,
      REPEAT: setRepeat,
      UNTIL: untilLoop,
      "DEF FN": defineFunction,
      WHILE: whileLoop,
      WEND: stackReturn,
      FOR: forLoop,
      NEXT: stackReturn,
      LABEL: labelLine
    };

    return function () {
      if (!isDone) {
        var goNext = true;
        while (goNext) {
          var line = getLine(counter);
          goNext = process(line);
          ++counter;
        }
      }
    };
  };
  return basicGrammar;
})();

