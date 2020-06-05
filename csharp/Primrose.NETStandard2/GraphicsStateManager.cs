using System;
using System.Drawing;
using System.Drawing.Drawing2D;

namespace Primrose
{
    public class GraphicsStateManager : IDisposable
    {
        private Graphics gfx;
        private GraphicsState state;
        public GraphicsStateManager(Graphics gfx)
        {
            this.gfx = gfx;
            state = gfx.Save();
        }

        public void Dispose()
        {
            gfx.Restore(state);
            state = null;
            gfx = null;
        }
    }
}