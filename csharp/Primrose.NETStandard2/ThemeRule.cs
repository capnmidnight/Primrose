using System;
using System.Collections.Generic;
using System.Drawing;

namespace Primrose
{
    public struct ThemeRule : IEquatable<ThemeRule>
    {
        public Color foreColor;
        public Color backColor;
        public FontStyle fontStyle;

        public override bool Equals(object obj)
        {
            return obj is ThemeRule rule && Equals(rule);
        }

        public bool Equals(ThemeRule other)
        {
            return EqualityComparer<Color>.Default.Equals(foreColor, other.foreColor) &&
                   EqualityComparer<Color>.Default.Equals(backColor, other.backColor) &&
                   fontStyle == other.fontStyle;
        }

        public override int GetHashCode()
        {
            var hashCode = -1203003344;
            hashCode = hashCode * -1521134295 + foreColor.GetHashCode();
            hashCode = hashCode * -1521134295 + backColor.GetHashCode();
            hashCode = hashCode * -1521134295 + fontStyle.GetHashCode();
            return hashCode;
        }

        public static bool operator ==(ThemeRule left, ThemeRule right)
        {
            return left.Equals(right);
        }

        public static bool operator !=(ThemeRule left, ThemeRule right)
        {
            return !(left == right);
        }
    }
}