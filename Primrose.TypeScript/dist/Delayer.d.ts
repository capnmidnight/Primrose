import { TypedEvent, TypedEventTarget } from "@juniper-lib/events/dist/TypedEventTarget";
export declare class Delayer extends TypedEventTarget<{
    "tick": TypedEvent<"tick">;
}> {
    private readonly timeout;
    private timer;
    private readonly tick;
    constructor(timeout: number);
    get isRunning(): boolean;
    cancel(): boolean;
    start(): void;
}
//# sourceMappingURL=Delayer.d.ts.map