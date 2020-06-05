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
            cursorColor = "white",
            unfocused = "rgba(0, 0, 255, 0.25)",
            currentRowBackColor = new SolidBrush(Color.FromArgb(0x20, 0x20, 0x20)),
            selectedBackColor = new SolidBrush(Color.FromArgb(0x40, 0x40, 0x40)),
            lineNumbers = new ThemeRule
            {
                foreColor = "white"
            },
            regular = new ThemeRule
            {
                backColor = Brushes.Black,
                foreColor = "#c0c0c0"
            },
            strings = new ThemeRule
            {
                foreColor = "#aa9900",
                fontStyle = "italic"
            },
            regexes = new ThemeRule
            {
                foreColor = "#aa0099",
                fontStyle = "italic"
            },
            numbers = new ThemeRule
            {
                foreColor = "green"
            },
            comments = new ThemeRule
            {
                foreColor = "yellow",
                fontStyle = "italic"
            },
            keywords = new ThemeRule
            {
                foreColor = "cyan"
            },
            functions = new ThemeRule
            {
                foreColor = "brown",
                fontWeight = "bold"
            },
            members = new ThemeRule
            {
                foreColor = "green"
            },
            error = new ThemeRule
            {
                foreColor = "red",
                fontStyle = "underline italic"
            }
        };


        /// <summary>
        /// A light background with dark foreground text.
        /// </summary>
        public static readonly Theme Light = new Theme
        {
            name = "Light",
            cursorColor = "black",
            unfocused = "rgba(0, 0, 255, 0.25)",
            currentRowBackColor = new SolidBrush(Color.FromArgb(0xf0, 0xf0, 0xf0)),
            selectedBackColor = new SolidBrush(Color.FromArgb(0xc0, 0xc0, 0xc0)),
            lineNumbers = new ThemeRule
            {
                foreColor = "black"
            },
            regular = new ThemeRule
            {
                backColor = Brushes.White,
                foreColor = "black"
            },
            strings = new ThemeRule
            {
                foreColor = "#aa9900",
                fontStyle = "italic"
            },
            regexes = new ThemeRule
            {
                foreColor = "#aa0099",
                fontStyle = "italic"
            },
            numbers = new ThemeRule
            {
                foreColor = "green"
            },
            comments = new ThemeRule
            {
                foreColor = "grey",
                fontStyle = "italic"
            },
            keywords = new ThemeRule
            {
                foreColor = "blue"
            },
            functions = new ThemeRule
            {
                foreColor = "brown",
                fontWeight = "bold"
            },
            members = new ThemeRule
            {
                foreColor = "green"
            },
            error = new ThemeRule
            {
                foreColor = "red",
                fontStyle = "underline italic"
            }
        };

        public static readonly Dictionary<string, Theme> themes = new Dictionary<string, Theme>() {
            { "light", Light },
            { "dark", Dark }
        };
    }
}