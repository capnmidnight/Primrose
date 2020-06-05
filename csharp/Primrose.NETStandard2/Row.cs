using System;
using System.Globalization;

namespace Primrose
{

    public class Row
    {

        public static Row emptyRow(int startStringIndex, int startTokenIndex, int lineNumber)
        {
            return new Row(string.Empty, Array.Empty<Token>(), startStringIndex, startTokenIndex, lineNumber);
        }

        public string text { get; }
        public int startStringIndex { get; set; }
        public int stringLength => text.Length;
        public int endStringIndex => startStringIndex + stringLength;
        public Token[] tokens { get; }
        public int startTokenIndex { get; set; }
        public int numTokens => tokens.Length;
        public int endTokenIndex => startTokenIndex + numTokens;
        public int lineNumber { get; set; }

        private readonly int[] leftCorrections;
        private readonly int[] rightCorrections;

        public Row(string txt, Token[] tokens, int startStringIndex, int startTokenIndex, int lineNumber)
        {
            text = txt;
            this.startStringIndex = startStringIndex;

            this.tokens = tokens;
            this.startTokenIndex = startTokenIndex;

            this.lineNumber = lineNumber;

            var graphemes = txt.Graphemes();
            leftCorrections = new int[txt.Length];
            rightCorrections = new int[txt.Length];

            var x = 0;
            foreach (var grapheme in graphemes)
            {
                leftCorrections[x] = 0;
                rightCorrections[x] = 0;
                for (var i = 1; i < grapheme.Length; ++i)
                {
                    leftCorrections[x + i] = -i;
                    rightCorrections[x + i] = grapheme.Length - i;
                }
                x += grapheme.Length;
            }
        }

        public void adjust(Cursor cursor, int dir)
        {
            var correction = dir == -1
                ? leftCorrections
                : rightCorrections;

            if (cursor.x < correction.Length)
            {
                var delta = correction[cursor.x];
                cursor.x += delta;
                cursor.i += delta;
            }
            else if (dir == 1
                && text[text.Length - 1] == '\n')
            {
                this.adjust(cursor, -1);
            }
        }

        public string substring(int x)
        {
            return text.Substring(x);
        }

        public string substring(int x, int y)
        {
            return text.Substring(x, y);
        }

        public override string ToString()
        {
            return text;
        }
    }
}