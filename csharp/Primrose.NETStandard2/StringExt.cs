using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace Primrose
{
    public static class StringExt
    {
        public static IEnumerable<string> Graphemes(this string s)
        {
            var enumerator = StringInfo.GetTextElementEnumerator(s);
            while (enumerator.MoveNext())
            {
                yield return (string)enumerator.Current;
            }
        }

        public static string Reverse(this string s)
        {
            return string.Join("", s.Graphemes().Reverse().ToArray());
        }
    }
}