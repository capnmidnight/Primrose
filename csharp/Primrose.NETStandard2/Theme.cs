using System.Drawing;

namespace Primrose
{
    public class Theme
    {
        public string name;
        public string cursorColor;
        public string unfocused;
        public Brush currentRowBackColor;
        public Brush selectedBackColor;

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
                    default: return null;
                }
            }
        }
    }
}