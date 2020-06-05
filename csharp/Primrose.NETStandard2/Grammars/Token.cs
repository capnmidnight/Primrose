namespace Primrose
{
    /// <summary>
    /// A chunk of text that represents a single element of code,
    /// with fields linking it back to its source.
    /// </summary>
    public class Token
    {
        public string type { get; set; }
        public string value { get; set; }
        public int startStringIndex { get; }

        public int length
        {
            get => value.Length;
        }

        public int endStringIndex
        {
            get => startStringIndex + length;
        }

        public Token(string value, string type, int startStringIndex)
        {
            this.value = value;
            this.type = type;
            this.startStringIndex = startStringIndex;
        }

        public Token clone()
        {
            return new Token(value, type, startStringIndex);
        }

        public Token splitAt(int i)
        {
            var next = value.Substring(i);
            value = value.Substring(0, i);
            return new Token(next, type, startStringIndex + i);
        }

        public override string ToString()
        {
            return $"[{type}: {value}]";
        }
    }
}