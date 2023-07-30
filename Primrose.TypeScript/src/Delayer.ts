import { TypedEvent, TypedEventTarget } from "@juniper-lib/events/TypedEventBase";

export class Delayer extends TypedEventTarget<{
    "tick": TypedEvent<"tick">;
}> {

    private timer: ReturnType<typeof setInterval> = null;

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
        this.timer = setInterval(this.tick, this.timeout);
    }
}