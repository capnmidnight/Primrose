using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace Primrose
{
    public class Cursor
    {

        private static Regex WordBoundaryPattern = new Regex("\\w+", RegexOptions.Compiled);

        public static Cursor min(Cursor a, Cursor b)
        {
            if (a.i <= b.i)
            {
                return a;
            }
            return b;
        }

        public static Cursor max(Cursor a, Cursor b)
        {
            if (a.i > b.i)
            {
                return a;
            }
            return b;
        }

        public Cursor()
            : this(0, 0, 0)
        { }

        public int i { get; set; }
        public int x { get; set; }
        public int y { get; set; }

        public Cursor(int i, int x, int y)
        {
            this.i = i;
            this.x = x;
            this.y = y;
        }

        public Cursor clone()
        {
            return new Cursor(i, x, y);
        }

        public override string ToString()
        {
            return $"[i:{i} x:{x} y:{y}]";
        }

        public void copy(Cursor cursor)
        {
            i = cursor.i;
            x = cursor.x;
            y = cursor.y;
        }

        public void fullHome()
        {
            i = 0;
            x = 0;
            y = 0;
        }

        public void fullEnd(List<Row> rows)
        {
            i = 0;
            var lastLength = 0;
            for (var y = 0; y < rows.Count; ++y)
            {
                var row = rows[y];
                lastLength = row.stringLength;
                i += lastLength;
            }
            y = rows.Count - 1;
            x = lastLength;
        }

        public void left(List<Row> rows, bool skipAdjust = false)
        {
            if (i > 0)
            {
                --i;
                --x;
                if (x < 0)
                {
                    --y;
                    var row = rows[y];
                    x = row.stringLength - 1;
                }
                else if (!skipAdjust)
                {
                    rows[y].adjust(this, -1);
                }
            }
        }

        public void skipLeft(List<Row> rows)
        {
            if (x <= 1)
            {
                left(rows);
            }
            else
            {
                var row = rows[y];
                var word = row.substring(0, x - 1).Reverse();
                var m = WordBoundaryPattern.Match(word);
                var dx = m.Success
                        ? (m.Index + m.Groups[0].Value.Length + 1)
                        : x;
                i -= dx;
                x -= dx;
                rows[y].adjust(this, -1);
            }
        }

        public void right(List<Row> rows, bool skipAdjust = false)
        {
            var row = rows[y];
            if (y < rows.Count - 1
                || x < row.stringLength)
            {
                ++i;
                ++x;
                if (y < rows.Count - 1
                    && x == row.stringLength)
                {
                    x = 0;
                    ++y;
                }
                else if (!skipAdjust)
                {
                    rows[y].adjust(this, 1);
                }
            }
        }

        public void skipRight(List<Row> rows)
        {
            var row = rows[y];
            if (x < row.stringLength - 1)
            {
                var subrow = row.substring(x + 1);
                var m = WordBoundaryPattern.Match(subrow);
                var dx = m.Success
                        ? (m.Index + m.Groups[0].Value.Length + 1)
                        : (row.stringLength - x);
                i += dx;
                x += dx;
                if (x > 0
                    && x == row.stringLength
                    && y < rows.Count - 1)
                {
                    --x;
                    --i;
                }
                rows[y].adjust(this, 1);
            }
            else if (y < rows.Count - 1)
            {
                right(rows);
            }
        }

        public void home()
        {
            i -= x;
            x = 0;
        }

        public void end(List<Row> rows)
        {
            var row = rows[y];
            var dx = row.stringLength - x;
            if (y < rows.Count - 1)
            {
                --dx;
            }
            i += dx;
            x += dx;
        }

        public void up(List<Row> rows, bool skipAdjust = false)
        {
            if (y > 0)
            {
                --y;
                var row = rows[y];
                var dx = Math.Min(0, row.stringLength - x - 1);
                x += dx;
                i -= row.stringLength - dx;
                if (!skipAdjust)
                {
                    rows[y].adjust(this, 1);
                }
            }
        }

        public void down(List<Row> rows, bool skipAdjust = false)
        {
            if (y < rows.Count - 1)
            {
                var prevRow = rows[y];
                ++y;
                i += prevRow.stringLength;

                var row = rows[y];
                if (x >= row.stringLength)
                {
                    var dx = x - row.stringLength;
                    if (y < rows.Count - 1)
                    {
                        ++dx;
                    }
                    i -= dx;
                    x -= dx;
                }
                if (!skipAdjust)
                {
                    rows[y].adjust(this, 1);
                }
            }
        }

        public void incX(List<Row> rows, int dx)
        {
            var dir = Math.Sign(dx);
            dx = Math.Abs(dx);
            if (dir == -1)
            {
                for (var i = 0; i < dx; ++i)
                {
                    left(rows, true);
                }
                rows[y].adjust(this, -1);
            }
            else if (dir == 1)
            {
                for (var i = 0; i < dx; ++i)
                {
                    right(rows, true);
                }
                rows[this.y].adjust(this, 1);
            }
        }

        public void incY(List<Row> rows, int dy)
        {
            var dir = Math.Sign(dy);
            dy = Math.Abs(dy);
            if (dir == -1)
            {
                for (var i = 0; i < dy; ++i)
                {
                    up(rows, true);
                }
            }
            else if (dir == 1)
            {
                for (var i = 0; i < dy; ++i)
                {
                    down(rows, true);
                }
            }
            rows[y].adjust(this, 1);
        }

        public void setXY(List<Row> rows, int x, int y)
        {
            this.y = y = Math.Max(0, Math.Min(rows.Count - 1, y));
            var row = rows[y];
            this.x = x = Math.Max(0, Math.Min(row.stringLength, x));
            i = x;
            for (var i = 0; i < y; ++i)
            {
                i += rows[i].stringLength;
            }
            if (x > 0
                && x == row.stringLength
                && y < rows.Count - 1)
            {
                this.x = --x;
                --i;
            }
            rows[y].adjust(this, 1);
        }

        public void setI(List<Row> rows, int i)
        {
            var delta = i - this.i;
            var dir = Math.Sign(delta);
            x = this.i = i;
            y = 0;
            var total = 0;
            var row = rows[this.y];
            while (x > row.stringLength)
            {
                x -= row.stringLength;
                total += row.stringLength;
                if (y >= rows.Count - 1)
                {
                    this.i = i = total;
                    x = row.stringLength;
                    break;
                }
                ++y;
                row = rows[y];
            }

            if (y < rows.Count - 1
                && x == row.stringLength)
            {
                x = 0;
                ++y;
            }

            rows[y].adjust(this, dir);
        }
    }
}