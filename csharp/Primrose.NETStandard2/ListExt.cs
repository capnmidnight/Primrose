using System.Collections.Generic;

namespace Primrose
{
    public static class ListExt
    {
        public static T[] Splice<T>(this List<T> list, int startIndex, int removeCount, IEnumerable<T> insertValues)
        {
            var old = new T[removeCount];
            list.CopyTo(startIndex, old, 0, removeCount);
            list.RemoveRange(startIndex, removeCount);
            list.InsertRange(startIndex, insertValues);
            return old;
        }

        public static T[] Splice<T>(this List<T> list, int startIndex, int removeCount, T insertValue)
        {
            var old = new T[removeCount];
            list.CopyTo(startIndex, old, 0, removeCount);
            list.RemoveRange(startIndex, removeCount);
            list.Insert(startIndex, insertValue);
            return old;
        }
    }
}