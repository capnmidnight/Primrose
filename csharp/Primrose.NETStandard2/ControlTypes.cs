using System.Linq;

namespace Primrose
{
    public static class ControlTypes
    {
        public static readonly string[] singleLineOutput = {
            "CursorLeft",
            "CursorRight",
            "CursorSkipLeft",
            "CursorSkipRight",
            "CursorHome",
            "CursorEnd",
            "CursorFullHome",
            "CursorFullEnd",

            "SelectLeft",
            "SelectRight",
            "SelectSkipLeft",
            "SelectSkipRight",
            "SelectHome",
            "SelectEnd",
            "SelectFullHome",
            "SelectFullEnd",

            "SelectAll"
        };

        public static readonly string[] multiLineOutput = singleLineOutput
            .Concat(new string[] {
                "CursorDown",
                "CursorUp",
                "CursorPageDown",
                "CursorPageUp",

                "SelectDown",
                "SelectUp",
                "SelectPageDown",
                "SelectPageUp",

                "ScrollDown",
                "ScrollUp"
            })
            .ToArray();

        private static readonly string[] input = {
            "Backspace",
            "Delete",
            "DeleteWordLeft",
            "DeleteWordRight",
            "DeleteLine",

            "Undo",
            "Redo",
        };

        public static readonly string[] singleLineInput = singleLineOutput
            .Concat(input)
            .ToArray();

        public static readonly string[] multiLineInput = multiLineOutput
            .Concat(input)
            .Concat(new string[]{
                "AppendNewline",
                "PrependNewline"
            })
            .ToArray();
    }
}