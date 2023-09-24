import { TypedEvent, TypedEventTarget } from "@juniper-lib/events/dist/TypedEventTarget";
export class Delayer extends TypedEventTarget {
    constructor(timeout) {
        super();
        this.timeout = timeout;
        this.timer = null;
        const tickEvt = new TypedEvent("tick");
        this.tick = () => {
            this.cancel();
            this.dispatchEvent(tickEvt);
        };
        Object.seal(this);
    }
    get isRunning() {
        return this.timer !== null;
    }
    cancel() {
        const wasRunning = this.isRunning;
        if (wasRunning) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        return wasRunning;
    }
    start() {
        this.cancel();
        this.timer = setInterval(this.tick, this.timeout);
    }
}
//# sourceMappingURL=Delayer.js.map