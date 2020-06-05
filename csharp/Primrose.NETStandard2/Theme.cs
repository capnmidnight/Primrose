using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;

namespace Primrose
{
    public struct Theme : IEquatable<Theme>
    {
        public string name;
        public Color cursorColor;
        public Color unfocused;
        public Color currentRowBackColor;
        public Color selectedBackColor;

        public ThemeRule lineNumbers;
        public ThemeRule regular;
        public ThemeRule strings;
        public ThemeRule regexes;
        public ThemeRule numbers;
        public ThemeRule comments;
        public ThemeRule keywords;
        public ThemeRule functions;
        public ThemeRule members;
        public ThemeRule error;

        public ThemeRule this[string name]
        {
            get
            {
                switch (name)
                {
                    case nameof(lineNumbers): return lineNumbers;
                    case nameof(regular): return regular;
                    case nameof(strings): return strings;
                    case nameof(regexes): return regexes;
                    case nameof(numbers): return numbers;
                    case nameof(comments): return comments;
                    case nameof(keywords): return keywords;
                    case nameof(functions): return functions;
                    case nameof(members): return members;
                    case nameof(error): return error;
                    default: default;
                }
            }
        }

        private IEnumerable<ThemeRule> Rules
        {
            get
            {
                yield return lineNumbers;
                yield return regular;
                yield return strings;
                yield return regexes;
                yield return numbers;
                yield return comments;
                yield return keywords;
                yield return functions;
                yield return members;
                yield return error;
            }
        }

        public IEnumerable<FontStyle> Styles
        {
            get
            {
                return Rules
                    .Select(r => r.fontStyle)
                    .Distinct();
            }
        }

        private IEnumerable<Color> AllColors
        {
            get
            {
                yield return cursorColor;
                yield return unfocused;
                yield return currentRowBackColor;
                yield return selectedBackColor;
                foreach (var rule in Rules)
                {
                    yield return rule.foreColor;
                    yield return rule.backColor;
                }
            }
        }

        public IEnumerable<Color> Colors
        {
            get
            {
                return AllColors.Distinct();
            }
        }

        public override bool Equals(object obj)
        {
            return obj is Theme theme && Equals(theme);
        }

        public bool Equals(Theme other)
        {
            return name == other.name &&
                   EqualityComparer<Color>.Default.Equals(cursorColor, other.cursorColor) &&
                   EqualityComparer<Color>.Default.Equals(unfocused, other.unfocused) &&
                   EqualityComparer<Color>.Default.Equals(currentRowBackColor, other.currentRowBackColor) &&
                   EqualityComparer<Color>.Default.Equals(selectedBackColor, other.selectedBackColor) &&
                   lineNumbers.Equals(other.lineNumbers) &&
                   regular.Equals(other.regular) &&
                   strings.Equals(other.strings) &&
                   regexes.Equals(other.regexes) &&
                   numbers.Equals(other.numbers) &&
                   comments.Equals(other.comments) &&
                   keywords.Equals(other.keywords) &&
                   functions.Equals(other.functions) &&
                   members.Equals(other.members) &&
                   error.Equals(other.error);
        }

        public override int GetHashCode()
        {
            var hashCode = 41174688;
            hashCode = hashCode * -1521134295 + EqualityComparer<string>.Default.GetHashCode(name);
            hashCode = hashCode * -1521134295 + cursorColor.GetHashCode();
            hashCode = hashCode * -1521134295 + unfocused.GetHashCode();
            hashCode = hashCode * -1521134295 + currentRowBackColor.GetHashCode();
            hashCode = hashCode * -1521134295 + selectedBackColor.GetHashCode();
            hashCode = hashCode * -1521134295 + lineNumbers.GetHashCode();
            hashCode = hashCode * -1521134295 + regular.GetHashCode();
            hashCode = hashCode * -1521134295 + strings.GetHashCode();
            hashCode = hashCode * -1521134295 + regexes.GetHashCode();
            hashCode = hashCode * -1521134295 + numbers.GetHashCode();
            hashCode = hashCode * -1521134295 + comments.GetHashCode();
            hashCode = hashCode * -1521134295 + keywords.GetHashCode();
            hashCode = hashCode * -1521134295 + functions.GetHashCode();
            hashCode = hashCode * -1521134295 + members.GetHashCode();
            hashCode = hashCode * -1521134295 + error.GetHashCode();
            return hashCode;
        }

        public static bool operator ==(Theme left, Theme right)
        {
            return left.Equals(right);
        }

        public static bool operator !=(Theme left, Theme right)
        {
            return !(left == right);
        }
    }
}