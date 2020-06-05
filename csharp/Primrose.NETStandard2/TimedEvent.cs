using System;

namespace Primrose
{
    public class TimedEvent
    {
        public event EventHandler Tick;

        private bool continuous;
        private int timeout;
        private int? handle;

        public TimedEvent(int timeout, bool continuous = false)
        {
            this.timeout = timeout;
            this.continuous = continuous;
            handle = null;
        }

        public bool cancel()
        {
            var wasRunning = this.isRunning;
            if (wasRunning)
            {
                if (continuous)
                {
                    clearInterval(handle);
                }
                else
                {
                    clearTimeout(handle);
                }
                handle = null;
            }

            return wasRunning;
        }

        private void tick()
        {
            if (!continuous)
            {
                cancel();
            }
            Tick?.Invoke(this, EventArgs.Empty);
        }

        public void start()
        {
            cancel();
            if (continuous)
            {
                handle = setTimeout(tick, timeout);
            }
            else
            {
                handle = setInterval(tick, timeout);
            }
        }

        public bool isRunning => handle != null;
    }
}