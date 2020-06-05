using System.Collections.Generic;
using System.Drawing;

namespace Primrose
{
    public static class Themes
    {
        /// <summary>
        /// A dark background with light foreground text.
        /// </summary>
        public static readonly Theme Dark = new Theme
        {
            name = "Dark",
            cursorColor = Color.White,
            unfocused = Color.FromArgb(0x3f, 0, 0, 0xff),
            currentRowBackColor = Color.FromArgb(0x20, 0x20, 0x20),
            selectedBackColor = Color.FromArgb(0x40, 0x40, 0x40),
            lineNumbers = new ThemeRule
            {
                foreColor = Color.White
            },
            regular = new ThemeRule
            {
                backColor = Color.Black,
                foreColor = Color.FromArgb(0xc0, 0xc0, 0xc0)
            },
            strings = new ThemeRule
            {
                foreColor = Color.FromArgb(0xaa, 0x99, 0x00),
                fontStyle = FontStyle.Italic
            },
            regexes = new ThemeRule
            {
                foreColor = Color.FromArgb(0xaa, 0x00, 0x99),
                fontStyle = FontStyle.Italic
            },
            numbers = new ThemeRule
            {
                foreColor = Color.Green
            },
            comments = new ThemeRule
            {
                foreColor = Color.Yellow,
                fontStyle = FontStyle.Italic
            },
            keywords = new ThemeRule
            {
                foreColor = Color.Cyan
            },
            functions = new ThemeRule
            {
                foreColor = Color.Brown,
                fontStyle = FontStyle.Bold
            },
            members = new ThemeRule
            {
                foreColor = Color.Green
            },
            error = new ThemeRule
            {
                foreColor = Color.Red,
                fontStyle = FontStyle.Italic | FontStyle.Underline
            }
        };


        /// <summary>
        /// A light background with dark foreground text.
        /// </summary>
        public static readonly Theme Light = new Theme
        {
            name = "Light",
            cursorColor = Color.Black,
            unfocused = Color.FromArgb(0x3f, 0, 0, 0xff),
            currentRowBackColor = Color.FromArgb(0xf0, 0xf0, 0xf0),
            selectedBackColor = Color.FromArgb(0xc0, 0xc0, 0xc0),
            lineNumbers = new ThemeRule
            {
                foreColor = Color.Black
            },
            regular = new ThemeRule
            {
                backColor = Color.White,
                foreColor = Color.Black
            },
            strings = new ThemeRule
            {
                foreColor = Color.FromArgb(0xaa, 0x99, 0x00),
                fontStyle = FontStyle.Italic
            },
            regexes = new ThemeRule
            {
                foreColor = Color.FromArgb(0xaa, 0x00, 0x99),
                fontStyle = FontStyle.Italic
            },
            numbers = new ThemeRule
            {
                foreColor = Color.Green
            },
            comments = new ThemeRule
            {
                foreColor = Color.Gray,
                fontStyle = FontStyle.Italic
            },
            keywords = new ThemeRule
            {
                foreColor = Color.Blue
            },
            functions = new ThemeRule
            {
                foreColor = Color.Brown,
                fontStyle = FontStyle.Bold
            },
            members = new ThemeRule
            {
                foreColor = Color.Green
            },
            error = new ThemeRule
            {
                foreColor = Color.Red,
                fontStyle = FontStyle.Italic | FontStyle.Underline
            }
        };

        public static readonly Dictionary<string, Theme> themes = new Dictionary<string, Theme>() {
            { "light", Light },
            { "dark", Dark }
        };
    }
}