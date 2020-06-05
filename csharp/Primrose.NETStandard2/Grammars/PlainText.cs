using System;
using System.Text.RegularExpressions;

namespace Primrose
{
    public partial class Grammar
    {
        /// <summary>
        /// A grammar that makes displaying plain text work with the text editor designed for syntax highlighting.
        /// </summary>
        public static readonly Grammar PlainText = new Grammar("PlainText", Array.Empty<(string, Regex)>());
    }
}
