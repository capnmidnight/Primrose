export class TimedEvent extends EventTarget {
    constructor(timeout, continuous = false) {
        super();

        const tickEvt = new Event("tick");

        let handle = null;

        this.cancel = () => {
            const wasRunning = this.isRunning;
            if (wasRunning) {
                if (continuous) {
                    clearInterval(handle);
                }
                else {
                    clearTimeout(handle);
                }
                handle = null;
            }

            return wasRunning;
        };

        const tick = () => {
            if (!continuous) {
                this.cancel();
            }
            this.dispatchEvent(tickEvt);
        };

        this.start = () => {
            this.cancel();
            if (continuous) {
                handle = setTimeout(tick, timeout);
            }
            else {
                handle = setInterval(tick, timeout);
            }
        };

        Object.defineProperties(this, {
            isRunning: {
                get: () => handle !== null
            }
        });

        Object.freeze(this);
    }
}