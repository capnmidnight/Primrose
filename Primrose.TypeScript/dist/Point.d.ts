import type { Rectangle } from "./Rectangle";
import type { Size } from "./Size";
export declare class Point {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    set(x: number, y: number): void;
    copy(p: Point): void;
    toCell(character: Size, scroll: Point, gridBounds: Rectangle): void;
    inBounds(bounds: Rectangle): boolean;
    clone(): Point;
    toString(): string;
}
//# sourceMappingURL=Point.d.ts.map