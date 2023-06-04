import { TypedEvent, TypedEventBase } from "@juniper-lib/events/EventBase";

export class Delayer extends TypedEventBase<{
    "tick": TypedEvent<"tick">;
}> {

    private timer: number = null;

    private readonly tick: () => void;

    constructor(private readonly timeout: number) {
        super();

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
        this.timer = setInterval(this.tick, this.timeout) as any;
    }
}