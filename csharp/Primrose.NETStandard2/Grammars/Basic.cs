using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace Primrose
{
    // A grammar for a BASIC-like language.
    internal class BasicGrammar : Grammar
    {
        internal BasicGrammar()
            : base("BASIC",
                // Grammar rules are applied in the order they are specified.
                new (string, Regex)[]{
                    // BASIC programs used to require the programmer type in her own line numbers. The start at the beginning of the line.
                    ("lineNumbers", new Regex("^\\d+\\s+", RegexOptions.Compiled)),
                    // Comments were lines that started with the keyword "REM" (for REMARK) and ran to the end of the line. They did not have to be numbered, because they were not executable and were stripped out by the interpreter.
                    ("startLineComments", new Regex("^REM\\s ", RegexOptions.Compiled)),
                    // Both double-quoted and single-quoted strings were not always supported, but in this case, I'm just demonstrating how it would be done for both.
                    ("stringDelim", new Regex("(\"|')", RegexOptions.Compiled)),
                    // Numbers are an optional dash, followed by a optional digits, followed by optional period, followed by 1 or more required digits. This allows us to match both integers and decimal numbers, both positive and negative, with or without leading zeroes for decimal numbers between (-1, 1).
                    ("numbers", new Regex("-?(?:(?:\\b\\d*)?\\.)?\\b\\d+\\b", RegexOptions.Compiled)),
                    // Keywords are really just a list of different words we want to match, surrounded by the "word boundary" selector "\b".
                    ("keywords", new Regex("\\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\\b", RegexOptions.Compiled)),
                    // Sometimes things we want to treat as keywords have different meanings in different locations. We can specify rules for tokens more than once.
                    ("keywords", new Regex("^DEF FN", RegexOptions.Compiled)),
                    // These are all treated as mathematical operations.
                    ("operators", new Regex("(?:\\+|;|,|-|\\*\\*|\\*|\\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\\(|\\)|\\[|\\])", RegexOptions.Compiled)),
                    // Once everything else has been matched, the left over blocks of words are treated as variable and function names.
                    ("members", new Regex("\\w+\\$?", RegexOptions.Compiled))
                })
        { }

        public override List<Token> tokenize(string code)
        {
            return base.tokenize(code.ToUpperInvariant());
        }
    }

    public partial class Grammar
    {
        public static readonly Grammar Basic = new BasicGrammar();
    }
}
