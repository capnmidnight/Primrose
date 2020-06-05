using System.Drawing;

namespace Primrose
{
    public static class GraphicsExt
    {
        public static GraphicsStateManager Push(this Graphics gfx)
        {
            return new GraphicsStateManager(gfx);
        }
    }
}