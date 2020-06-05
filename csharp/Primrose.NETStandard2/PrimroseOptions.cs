namespace Primrose
{
    public struct PrimroseOptions
    {
        public bool? readOnly,
            multiLine,
            wordWrap,
            scrollBars,
            lineNumbers;

        public int? padding,
            fontSize,
            scaleFactor,
            width,
            height;

        public string language;

        public static readonly PrimroseOptions Default = new PrimroseOptions
        {
            readOnly = false,
            multiLine = true,
            wordWrap = true,
            scrollBars = true,
            lineNumbers = true,
            padding = 0,
            fontSize = 16,
            language = "JavaScript",
            scaleFactor = 1,
            width = 1024,
            height = 1024
        };
    }
}