using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace Primrose
{
    // A single syntax matching rule, for tokenizing code.
    public class Rule
    {
        private readonly string name;
        private readonly Regex test;

        public Rule(string name, Regex test)
        {
            this.name = name;
            this.test = test;
        }

        public void carveOutMatchedToken(List<Token> tokens, int j)
        {
            var token = tokens[j];
            if (token.type == "regular")
            {
                var res = test.Match(token.value);
                if (res.Success)
                {
                    // Only use the last group that matches the regex, to allow for more
                    // complex regexes that can match in special contexts, but not make
                    // the context part of the token.
                    var midx = res.Groups[res.Groups.Count - 1].Value;
                    int start = res.Value.IndexOf(midx),
                        end = start + midx.Length;
                    if (start == 0)
                    {
                        // the rule matches the start of the token
                        token.type = name;
                        if (end < token.length)
                        {
                            // but not the end
                            var next = token.splitAt(end);
                            next.type = "regular";
                            tokens.Insert(j + 1, next);
                        }
                    }
                    else
                    {
                        // the rule matches from the middle of the token
                        var mid = token.splitAt(start);
                        if (midx.Length < mid.length)
                        {
                            // but not the end
                            var right = mid.splitAt(midx.Length);
                            tokens.Insert(j + 1, right);
                        }
                        mid.type = name;
                        tokens.Insert(j + 1, mid);
                    }
                }
            }
        }
    };
}